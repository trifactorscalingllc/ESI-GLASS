// Microsoft Clarity Sync — Supabase Edge Function
// Fetches Clarity session metrics and stores in Supabase
// Deploy with: npx supabase functions deploy clarity-sync --no-verify-jwt

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

// ── Clarity API ────────────────────────────────────────────────────────────

async function clarityFetch(path: string, token: string) {
  const res = await fetch(`https://clarity.microsoft.com/api/v1${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Clarity API ${path} → ${res.status}: ${text}`)
  return JSON.parse(text)
}

// ── Date helpers ───────────────────────────────────────────────────────────

function dateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const cur = new Date(startDate)
  const end = new Date(endDate)
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

// ── Main ──────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  try {
    const projectId = Deno.env.get('CLARITY_PROJECT_ID')
    const token     = Deno.env.get('CLARITY_API_TOKEN')

    if (!projectId || !token) throw new Error('CLARITY_PROJECT_ID or CLARITY_API_TOKEN secret not set')

    const body = await req.json().catch(() => ({}))

    // How many days to fetch (default 90 for incremental, use startDate for backfill)
    const startDate = body.startDate ?? (() => {
      const d = new Date(); d.setDate(d.getDate() - 90); return d.toISOString().slice(0, 10)
    })()
    const endDate = new Date().toISOString().slice(0, 10)

    // Number of days to request
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1

    // Fetch Clarity daily metrics
    // Clarity metrics API: GET /projects/{projectId}/metrics?num={days}&url={siteUrl}
    const metricsData = await clarityFetch(
      `/projects/${projectId}/metrics?num=${Math.min(days, 365)}`,
      token
    )

    let total = 0

    // The Clarity metrics response structure varies — handle both array and object responses
    const metricsList = Array.isArray(metricsData)
      ? metricsData
      : (metricsData.data ?? metricsData.metrics ?? metricsData.dailyMetrics ?? [])

    if (metricsList.length > 0) {
      const rows = metricsList
        .filter((item: any) => item.date || item.day || item.timestamp)
        .map((item: any) => {
          // Normalize date field (Clarity uses various formats)
          const rawDate = item.date ?? item.day ?? item.timestamp
          const date = typeof rawDate === 'string' && rawDate.length === 8
            ? `${rawDate.slice(0,4)}-${rawDate.slice(4,6)}-${rawDate.slice(6,8)}`
            : new Date(rawDate).toISOString().slice(0, 10)

          return {
            date,
            total_sessions:  parseInt(item.sessions ?? item.totalSessions ?? item.sessionCount ?? '0'),
            total_users:     parseInt(item.users ?? item.totalUsers ?? item.userCount ?? '0'),
            rage_clicks:     parseInt(item.rageClicks ?? item.rage_clicks ?? '0'),
            dead_clicks:     parseInt(item.deadClicks ?? item.dead_clicks ?? '0'),
            quick_backs:     parseInt(item.quickBacks ?? item.quick_backs ?? '0'),
          }
        })
        .filter((r: any) => r.date && r.date.match(/^\d{4}-\d{2}-\d{2}$/))

      total += await upsert('clarity_daily', rows)
    }

    // Log sync
    await upsert('analytics_sync_log', [{
      source: 'clarity', sync_type: body.startDate ? 'backfill' : 'incremental',
      records_processed: total, status: 'completed',
    }])

    return new Response(JSON.stringify({
      success: true,
      records: total,
      raw_response_keys: Object.keys(metricsData),
      dateRange: { startDate, endDate },
    }), { headers: { ...CORS, 'Content-Type': 'application/json' } })

  } catch (err: any) {
    console.error(err)
    try {
      await upsert('analytics_sync_log', [{
        source: 'clarity', sync_type: 'sync',
        records_processed: 0, status: 'failed', error_message: err.message,
      }])
    } catch {}
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
