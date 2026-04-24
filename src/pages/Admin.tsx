import { useState, useEffect, useCallback, ReactNode } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie,
} from 'recharts'

// ── Config ──────────────────────────────────────────────────────────────────
const EDGE_URL = 'https://qamvvvwlpzkjvxoomjno.supabase.co/functions/v1/ga4-report'
const ADMIN_PASS = 'tfs-admin-2026'

// ── Brand ────────────────────────────────────────────────────────────────────
const C = {
  gold:    '#D4AF37',
  goldDim: 'rgba(212,175,55,0.12)',
  goldBrd: 'rgba(212,175,55,0.22)',
  black:   '#050505',
  surface: 'rgba(255,255,255,0.03)',
  border:  'rgba(255,255,255,0.07)',
  gray:    'rgba(255,255,255,0.45)',
  white:   '#ffffff',
  green:   '#22c55e',
  red:     '#ef4444',
}

const DEVICE_COLORS  = [C.gold, 'rgba(212,175,55,0.5)', 'rgba(212,175,55,0.22)']
const SOURCE_COLORS  = [C.gold, '#b8942e', '#8a6e22', '#5c4916',
  'rgba(212,175,55,0.4)', 'rgba(212,175,55,0.25)', 'rgba(212,175,55,0.15)', C.goldBrd]

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt     = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
const fmtDur  = (s: number) => `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`
const fmtPct  = (v: number) => `${(v * 100).toFixed(1)}%`

async function fetchReport(report: string, startDate: string, endDate: string) {
  const res = await fetch(EDGE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report, startDate, endDate }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
  return json.data
}

// ── Tiny components ───────────────────────────────────────────────────────────

function Card({ children, style = {} }: { children: ReactNode; style?: object }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.goldBrd}`,
      borderRadius: 12,
      padding: '24px 28px',
      ...style,
    }}>{children}</div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase' as const, color: C.gold, marginBottom: 20,
    }}>{children}</div>
  )
}

function Skeleton({ h = 120 }: { h?: number }) {
  return (
    <div style={{
      height: h, background: 'rgba(255,255,255,0.05)',
      borderRadius: 8, animation: 'tfsPulse 1.6s ease-in-out infinite',
    }} />
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{ padding: '16px 20px', background: 'rgba(239,68,68,0.08)',
      border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
      color: C.red, fontSize: 13 }}>
      ⚠ {msg}
    </div>
  )
}

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#111', border: `1px solid ${C.goldBrd}`,
      borderRadius: 8, padding: '10px 16px', fontSize: 13 }}>
      <div style={{ color: C.gray, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  )
}

function KPI({ label, value, delta, display }: {
  label: string; value: number; delta: number | null; display: string
}) {
  const up = delta !== null && delta > 0
  const dn = delta !== null && delta < 0
  return (
    <Card style={{ flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase' as const, color: C.gold, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: C.white, lineHeight: 1 }}>
        {display}
      </div>
      {delta !== null && (
        <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600,
          color: up ? C.green : dn ? C.red : C.gray }}>
          {up ? '▲' : dn ? '▼' : '—'} {Math.abs(delta)}% vs prev
        </div>
      )}
    </Card>
  )
}

// ── Login ─────────────────────────────────────────────────────────────────────
function Login({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw]   = useState('')
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASS) { sessionStorage.setItem('tfs_admin', '1'); onAuth() }
    else { setErr(true); setPw('') }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.black, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ width: 380, padding: '48px 40px', background: C.surface,
        border: `1px solid ${C.goldBrd}`, borderRadius: 16 }}>
        <img src="/TFS-Logo-Transparent.png" alt="TFS" style={{ height: 44, marginBottom: 28 }} />
        <div style={{ fontSize: 22, fontWeight: 800, color: C.white, marginBottom: 6 }}>
          Admin Portal
        </div>
        <div style={{ fontSize: 14, color: C.gray, marginBottom: 28 }}>
          Enter your access code to continue.
        </div>
        <form onSubmit={submit}>
          <input type="password" value={pw} autoFocus
            onChange={e => { setPw(e.target.value); setErr(false) }}
            placeholder="Access code"
            style={{ width: '100%', padding: '13px 15px', borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${err ? C.red : C.goldBrd}`,
              color: C.white, fontSize: 15, outline: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxSizing: 'border-box' as const, marginBottom: err ? 8 : 20 }}
          />
          {err && <div style={{ color: C.red, fontSize: 13, marginBottom: 16 }}>
            Incorrect access code.
          </div>}
          <button type="submit" style={{ width: '100%', padding: '13px',
            background: C.gold, color: C.black, border: 'none', borderRadius: 8,
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Enter Dashboard →
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const RANGES = [
  { label: '7 days',  start: '7daysAgo',  end: 'today' },
  { label: '30 days', start: '30daysAgo', end: 'today' },
  { label: '90 days', start: '90daysAgo', end: 'today' },
]

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [range, setRange]       = useState(1)
  const [overview, setOverview] = useState<any>(null)
  const [ts, setTs]             = useState<any[]>([])
  const [pages, setPages]       = useState<any[]>([])
  const [sources, setSources]   = useState<any[]>([])
  const [devices, setDevices]   = useState<any[]>([])
  const [active, setActive]     = useState<number | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [updated, setUpdated]   = useState('')

  const { start, end } = RANGES[range]

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [ov, timeseries, pg, src, dev, rt] = await Promise.all([
        fetchReport('overview',   start, end),
        fetchReport('timeseries', start, end),
        fetchReport('pages',      start, end),
        fetchReport('sources',    start, end),
        fetchReport('devices',    start, end),
        fetchReport('realtime',   start, end),
      ])
      setOverview(ov)
      setTs(timeseries)
      setPages(pg)
      setSources(src)
      setDevices(dev)
      setActive(rt.activeUsers)
      setUpdated(new Date().toLocaleTimeString())
    } catch (e: any) {
      setError(e.message ?? 'Failed to load analytics data.')
    }
    setLoading(false)
  }, [start, end])

  useEffect(() => { load() }, [load])

  // Refresh active users every 30s
  useEffect(() => {
    const id = setInterval(async () => {
      try { const rt = await fetchReport('realtime', start, end); setActive(rt.activeUsers) } catch {}
    }, 30000)
    return () => clearInterval(id)
  }, [start, end])

  const totalSessions = sources.reduce((a, s) => a + s.sessions, 0)
  const totalDevSessions = devices.reduce((a, d) => a + d.sessions, 0)

  return (
    <div style={{ minHeight: '100vh', background: C.black,
      fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.white }}>

      {/* Nav bar */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 66, position: 'sticky', top: 0, background: C.black, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="/TFS-Logo-Transparent.png" alt="TFS" style={{ height: 40 }} />
          <div style={{ width: 1, height: 22, background: C.border }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase' as const, color: C.gold }}>
            Analytics
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {active !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
              background: C.goldDim, border: `1px solid ${C.goldBrd}`,
              borderRadius: 20, padding: '5px 14px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%',
                background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{active} live</span>
            </div>
          )}
          {updated && <span style={{ fontSize: 12, color: C.gray }}>Updated {updated}</span>}
          {[{ label: '↻ Refresh', fn: load }, { label: 'Sign out', fn: onLogout }].map(b => (
            <button key={b.label} onClick={b.fn} style={{
              background: 'transparent', border: `1px solid ${C.border}`,
              color: C.gray, padding: '7px 16px', borderRadius: 6, cursor: 'pointer',
              fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>{b.label}</button>
          ))}
        </div>
      </div>

      {/* Page body */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px' }}>

        {/* Header + range */}
        <div style={{ display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap' as const,
          gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>trifactorscaling.com</div>
            <div style={{ fontSize: 14, color: C.gray, marginTop: 4 }}>
              Analytics dashboard
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, background: C.surface,
            border: `1px solid ${C.border}`, borderRadius: 8, padding: 4 }}>
            {RANGES.map((r, i) => (
              <button key={i} onClick={() => setRange(i)} style={{
                padding: '8px 18px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                background: range === i ? C.gold : 'transparent',
                color: range === i ? C.black : C.gray,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        {error && <div style={{ marginBottom: 24 }}><ErrorBox msg={error} /></div>}

        {/* KPI row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' as const }}>
          {loading ? [1,2,3,4,5].map(i => (
            <div key={i} style={{ flex: 1, minWidth: 160 }}><Skeleton h={112} /></div>
          )) : overview ? <>
            <KPI label="Sessions"    value={overview.sessions.value}    delta={overview.sessions.delta}    display={fmt(overview.sessions.value)} />
            <KPI label="Users"       value={overview.users.value}       delta={overview.users.delta}       display={fmt(overview.users.value)} />
            <KPI label="Page Views"  value={overview.pageViews.value}   delta={overview.pageViews.delta}   display={fmt(overview.pageViews.value)} />
            <KPI label="Bounce Rate" value={overview.bounceRate.value}  delta={overview.bounceRate.delta}  display={fmtPct(overview.bounceRate.value)} />
            <KPI label="Avg Session" value={overview.avgDuration.value} delta={overview.avgDuration.delta} display={fmtDur(overview.avgDuration.value)} />
          </> : null}
        </div>

        {/* Timeseries */}
        <Card style={{ marginBottom: 20 }}>
          <SectionTitle>Sessions Over Time</SectionTitle>
          {loading ? <Skeleton h={220} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ts} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="date" tick={{ fill: C.gray, fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: C.gray, fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<Tip />} />
                <Line type="monotone" dataKey="sessions" name="Sessions" stroke={C.gold} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: C.gold }} />
                <Line type="monotone" dataKey="users" name="Users" stroke="rgba(212,175,55,0.38)" strokeWidth={2} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Pages + Sources */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 20, marginBottom: 20 }}>

          <Card>
            <SectionTitle>Top Pages</SectionTitle>
            {loading ? <Skeleton h={200} /> : (
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Page', 'Views', 'Sessions', 'Bounce'].map(h => (
                      <th key={h} style={{ textAlign: h === 'Page' ? 'left' as const : 'right' as const,
                        padding: '0 8px 12px 0', color: C.gray, fontWeight: 600,
                        fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase' as const,
                        borderBottom: `1px solid ${C.border}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pages.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: '11px 8px 11px 0', color: C.gray, maxWidth: 200,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                        {p.path}
                      </td>
                      <td style={{ padding: '11px 8px 11px 0', textAlign: 'right' as const, color: C.white, fontWeight: 600 }}>
                        {fmt(p.views)}
                      </td>
                      <td style={{ padding: '11px 8px 11px 0', textAlign: 'right' as const, color: C.gray }}>
                        {fmt(p.sessions)}
                      </td>
                      <td style={{ padding: '11px 0 11px 0', textAlign: 'right' as const,
                        color: p.bounceRate > 60 ? C.red : p.bounceRate < 40 ? C.green : C.gray }}>
                        {p.bounceRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          <Card>
            <SectionTitle>Traffic Sources</SectionTitle>
            {loading ? <Skeleton h={200} /> : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={sources} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="channel" tick={{ fill: C.gray, fontSize: 11 }}
                      tickLine={false} axisLine={false} width={105} />
                    <Tooltip content={<Tip />} />
                    <Bar dataKey="sessions" name="Sessions" radius={3}>
                      {sources.map((_: any, i: number) => (
                        <Cell key={i} fill={SOURCE_COLORS[i] ?? C.goldBrd} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {sources.map((s: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: C.gray }}>{s.channel}</span>
                      <span style={{ color: C.gold, fontWeight: 600 }}>
                        {totalSessions > 0 ? Math.round((s.sessions / totalSessions) * 100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Devices + Conversions */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1.4fr', gap: 20 }}>

          <Card>
            <SectionTitle>Devices</SectionTitle>
            {loading ? <Skeleton h={180} /> : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={devices} dataKey="sessions" nameKey="device"
                      cx="50%" cy="50%" innerRadius={44} outerRadius={72} strokeWidth={0}>
                      {devices.map((_: any, i: number) => (
                        <Cell key={i} fill={DEVICE_COLORS[i] ?? C.goldBrd} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [fmt(v), 'Sessions']} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                  {devices.map((d: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 9, height: 9, borderRadius: 2, flexShrink: 0,
                        background: DEVICE_COLORS[i] ?? C.goldBrd }} />
                      <span style={{ fontSize: 13, color: C.white, flex: 1, textTransform: 'capitalize' as const }}>
                        {d.device}
                      </span>
                      <span style={{ fontSize: 13, color: C.gold, fontWeight: 700 }}>
                        {totalDevSessions > 0 ? Math.round((d.sessions / totalDevSessions) * 100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card>
            <SectionTitle>Conversions &amp; Users by Channel</SectionTitle>
            {loading ? <Skeleton h={180} /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sources} margin={{ top: 4, right: 8, bottom: 28, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="channel" tick={{ fill: C.gray, fontSize: 11 }}
                    tickLine={false} axisLine={false} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fill: C.gray, fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="users" name="Users" radius={3} fill="rgba(212,175,55,0.22)" />
                  <Bar dataKey="conversions" name="Conversions" radius={3} fill={C.gold} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes tfsPulse { 0%,100%{opacity:.35} 50%{opacity:.65} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.3);border-radius:3px}
      `}</style>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('tfs_admin') === '1'
  )
  if (!authed) return <Login onAuth={() => setAuthed(true)} />
  return <Dashboard onLogout={() => { sessionStorage.removeItem('tfs_admin'); setAuthed(false) }} />
}
