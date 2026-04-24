// GA4 Reporting API — Supabase Edge Function
// Handles all analytics queries for the TFS Admin Dashboard
// Deploy with: npx supabase functions deploy ga4-report --no-verify-jwt

const PROPERTY_ID = '534400185'
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ── JWT signing for Google service account ─────────────────────────────────

function b64url(str: string): string {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function b64urlBytes(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getAccessToken(): Promise<string> {
  const clientEmail = Deno.env.get('GA4_CLIENT_EMAIL')
  const privateKeyPem = Deno.env.get('GA4_PRIVATE_KEY')

  if (!clientEmail || !privateKeyPem) {
    throw new Error('GA4_CLIENT_EMAIL or GA4_PRIVATE_KEY secret not set')
  }

  const header  = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const now     = Math.floor(Date.now() / 1000)
  const payload = b64url(JSON.stringify({
    iss:   clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud:   'https://oauth2.googleapis.com/token',
    exp:   now + 3600,
    iat:   now,
  }))

  const signingInput = `${header}.${payload}`

  // Parse PEM → raw DER bytes
  // Strip headers, then keep ONLY valid base64 chars (handles any stray whitespace/quotes/etc)
  const b64 = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/[^A-Za-z0-9+/=]/g, '')  // strip everything that isn't valid base64

  let der: Uint8Array
  try {
    der = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  } catch (e) {
    throw new Error(`Failed to decode private key base64 (len=${b64.length}, mod4=${b64.length%4}): ${e}`)
  }

  const key = await crypto.subtle.importKey(
    'pkcs8', der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )

  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', key,
    new TextEncoder().encode(signingInput)
  )

  const jwt = `${signingInput}.${b64urlBytes(new Uint8Array(sig))}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`)
  return data.access_token
}

// ── GA4 API helpers ────────────────────────────────────────────────────────

async function runReport(token: string, body: object) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
  return res.json()
}

async function runRealtimeReport(token: string, body: object) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runRealtimeReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
  return res.json()
}

// ── Report builders ────────────────────────────────────────────────────────

function parseRows(report: any, keys: string[]) {
  if (!report.rows) return []
  return report.rows.map((row: any) => {
    const obj: any = {}
    keys.forEach((k, i) => {
      const dimLen = report.dimensionHeaders?.length ?? 0
      obj[k] = i < dimLen
        ? row.dimensionValues[i].value
        : row.metricValues[i - dimLen].value
    })
    return obj
  })
}

async function getOverview(token: string, startDate: string, endDate: string) {
  const [main, prev] = await Promise.all([
    runReport(token, {
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    }),
    // Previous period for delta %
    runReport(token, {
      dateRanges: [{ startDate: `${getPrevDays(startDate)}daysAgo`, endDate: `${getDays(startDate)}daysAgo` }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    }),
  ])

  const cur  = main.rows?.[0]?.metricValues ?? []
  const prv  = prev.rows?.[0]?.metricValues ?? []
  const delta = (i: number) => {
    const c = parseFloat(cur[i]?.value ?? '0')
    const p = parseFloat(prv[i]?.value ?? '0')
    if (p === 0) return null
    return Math.round(((c - p) / p) * 100)
  }

  return {
    sessions:       { value: parseInt(cur[0]?.value ?? '0'), delta: delta(0) },
    users:          { value: parseInt(cur[1]?.value ?? '0'), delta: delta(1) },
    pageViews:      { value: parseInt(cur[2]?.value ?? '0'), delta: delta(2) },
    bounceRate:     { value: parseFloat(cur[3]?.value ?? '0'), delta: delta(3) ? -delta(3)! : null },
    avgDuration:    { value: parseFloat(cur[4]?.value ?? '0'), delta: delta(4) },
  }
}

async function getTimeseries(token: string, startDate: string, endDate: string) {
  const report = await runReport(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  })
  return parseRows(report, ['date', 'sessions', 'users']).map((r: any) => ({
    date: `${r.date.slice(4,6)}/${r.date.slice(6,8)}`,
    sessions: parseInt(r.sessions),
    users: parseInt(r.users),
  }))
}

async function getTopPages(token: string, startDate: string, endDate: string) {
  const report = await runReport(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }, { name: 'bounceRate' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  })
  return parseRows(report, ['path', 'title', 'views', 'sessions', 'bounceRate']).map((r: any) => ({
    path: r.path,
    title: r.title || r.path,
    views: parseInt(r.views),
    sessions: parseInt(r.sessions),
    bounceRate: Math.round(parseFloat(r.bounceRate) * 100),
  }))
}

async function getSources(token: string, startDate: string, endDate: string) {
  const report = await runReport(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'conversions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 8,
  })
  return parseRows(report, ['channel', 'sessions', 'users', 'conversions']).map((r: any) => ({
    channel: r.channel,
    sessions: parseInt(r.sessions),
    users: parseInt(r.users),
    conversions: parseInt(r.conversions),
  }))
}

async function getDevices(token: string, startDate: string, endDate: string) {
  const report = await runReport(token, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  })
  return parseRows(report, ['device', 'sessions', 'users']).map((r: any) => ({
    device: r.device,
    sessions: parseInt(r.sessions),
    users: parseInt(r.users),
  }))
}

async function getRealtime(token: string) {
  const report = await runRealtimeReport(token, {
    metrics: [{ name: 'activeUsers' }],
  })
  return { activeUsers: parseInt(report.rows?.[0]?.metricValues?.[0]?.value ?? '0') }
}

// ── Date helpers ───────────────────────────────────────────────────────────

function getDays(startDate: string): number {
  if (startDate.endsWith('daysAgo')) return parseInt(startDate)
  const ms = Date.now() - new Date(startDate).getTime()
  return Math.ceil(ms / 86400000)
}

function getPrevDays(startDate: string): number {
  return getDays(startDate) * 2
}

// ── Main handler ───────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS })
  }

  try {
    const { report, startDate = '30daysAgo', endDate = 'today' } = await req.json()
    const token = await getAccessToken()

    let data
    switch (report) {
      case 'overview':   data = await getOverview(token, startDate, endDate);   break
      case 'timeseries': data = await getTimeseries(token, startDate, endDate); break
      case 'pages':      data = await getTopPages(token, startDate, endDate);   break
      case 'sources':    data = await getSources(token, startDate, endDate);    break
      case 'devices':    data = await getDevices(token, startDate, endDate);    break
      case 'realtime':   data = await getRealtime(token);                       break
      default: throw new Error(`Unknown report type: ${report}`)
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
