// GA4 Historical Backfill — Supabase Edge Function
// Pulls all GA4 data from a start date and upserts into Supabase tables
// Deploy with: npx supabase functions deploy ga4-backfill --no-verify-jwt

const PROPERTY_ID = '534400185'
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ── Google JWT auth (same approach as ga4-report) ─────────────────────────

function b64url(str: string): string {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function b64urlBytes(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getGoogleToken(): Promise<string> {
  const clientEmail = Deno.env.get('GA4_CLIENT_EMAIL')!
  const privateKeyPem = Deno.env.get('GA4_PRIVATE_KEY')!

  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload = b64url(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }))
  const signingInput = `${header}.${payload}`

  const b64 = privateKeyPem
    .replace(/\\n/g, '\n')
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/[^A-Za-z0-9+/=]/g, '')

  const der = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const key = await crypto.subtle.importKey(
    'pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput))
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
  if (!data.access_token) throw new Error(`GA4 token error: ${JSON.stringify(data)}`)
  return data.access_token
}

// ── GA4 API ────────────────────────────────────────────────────────────────

async function ga4Report(token: string, body: object) {
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

// ── Supabase upsert ────────────────────────────────────────────────────────

async function upsert(table: string, rows: object[]): Promise<number> {
  if (rows.length === 0) return 0
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key!,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`DB upsert ${table} failed (${res.status}): ${text}`)
  }
  return rows.length
}

// ── Helpers ───────────────────────────────────────────────────────────────

function getMonths(startDate: string, endDate: string): string[] {
  const months: string[] = []
  const end = new Date(endDate)
  let cur = new Date(startDate.slice(0, 7) + '-01')
  const endMon = new Date(end.getFullYear(), end.getMonth(), 1)
  while (cur <= endMon) {
    months.push(cur.toISOString().slice(0, 7))
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
  }
  return months
}

function monthBounds(ym: string): { start: string; end: string } {
  const [y, m] = ym.split('-').map(Number)
  return {
    start: new Date(y, m - 1, 1).toISOString().slice(0, 10),
    end:   new Date(y, m, 0).toISOString().slice(0, 10),
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  try {
    const body = await req.json().catch(() => ({}))
    const startDate = body.startDate ?? '2024-01-01'
    const endDate   = new Date().toISOString().slice(0, 10)

    const token = await getGoogleToken()
    let total = 0

    // ── 1. Daily timeseries — one API call for the full range ──────────────
    const dailyRpt = await ga4Report(token, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
      limit: 1500,
    })

    const dailyRows = (dailyRpt.rows ?? []).map((row: any) => {
      const d = row.dimensionValues[0].value // YYYYMMDD
      return {
        date: `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`,
        sessions:              parseInt(row.metricValues[0].value ?? '0'),
        users:                 parseInt(row.metricValues[1].value ?? '0'),
        page_views:            parseInt(row.metricValues[2].value ?? '0'),
        bounce_rate:           parseFloat(row.metricValues[3].value ?? '0'),
        avg_session_duration:  parseFloat(row.metricValues[4].value ?? '0'),
      }
    })
    total += await upsert('ga4_daily', dailyRows)

    // ── 2. Monthly sources / pages / devices ───────────────────────────────
    const months = getMonths(startDate, endDate)

    for (const ym of months) {
      const { start: mS, end: mE } = monthBounds(ym)
      const monthDate = `${ym}-01`

      // Traffic sources
      const srcRpt = await ga4Report(token, {
        dateRanges: [{ startDate: mS, endDate: mE }],
        dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'conversions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      })
      total += await upsert('ga4_monthly_sources', (srcRpt.rows ?? []).map((r: any) => ({
        month: monthDate,
        channel:     r.dimensionValues[0].value,
        sessions:    parseInt(r.metricValues[0].value ?? '0'),
        users:       parseInt(r.metricValues[1].value ?? '0'),
        conversions: parseInt(r.metricValues[2].value ?? '0'),
      })))

      // Top pages
      const pgRpt = await ga4Report(token, {
        dateRanges: [{ startDate: mS, endDate: mE }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }, { name: 'bounceRate' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 25,
      })
      total += await upsert('ga4_monthly_pages', (pgRpt.rows ?? []).map((r: any) => ({
        month:      monthDate,
        page_path:  r.dimensionValues[0].value,
        page_title: r.dimensionValues[1].value || r.dimensionValues[0].value,
        views:       parseInt(r.metricValues[0].value ?? '0'),
        sessions:    parseInt(r.metricValues[1].value ?? '0'),
        bounce_rate: parseFloat(r.metricValues[2].value ?? '0'),
      })))

      // Devices
      const devRpt = await ga4Report(token, {
        dateRanges: [{ startDate: mS, endDate: mE }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      })
      total += await upsert('ga4_monthly_devices', (devRpt.rows ?? []).map((r: any) => ({
        month:           monthDate,
        device_category: r.dimensionValues[0].value,
        sessions:        parseInt(r.metricValues[0].value ?? '0'),
        users:           parseInt(r.metricValues[1].value ?? '0'),
      })))
    }

    // ── Log success ────────────────────────────────────────────────────────
    await upsert('analytics_sync_log', [{
      source: 'ga4', sync_type: 'backfill',
      records_processed: total, status: 'completed',
    }])

    return new Response(JSON.stringify({ success: true, records: total, months: months.length, dateRange: { startDate, endDate } }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    console.error(err)
    try {
      await upsert('analytics_sync_log', [{
        source: 'ga4', sync_type: 'backfill',
        records_processed: 0, status: 'failed', error_message: err.message,
      }])
    } catch {}
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
