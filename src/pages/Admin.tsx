import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend,
} from 'recharts'

// ── Config ─────────────────────────────────────────────────────────────────
const EDGE_URL = 'https://qamvvvwlpzkjvxoomjno.supabase.co/functions/v1/ga4-report'
const ADMIN_PASS = 'tfs-admin-2026'  // Change via Lovable env if needed

// ── Brand tokens ────────────────────────────────────────────────────────────
const G = {
  gold:    '#D4AF37',
  goldDim: 'rgba(212,175,55,0.15)',
  goldBrd: 'rgba(212,175,55,0.25)',
  black:   '#050505',
  surface: 'rgba(255,255,255,0.03)',
  border:  'rgba(255,255,255,0.06)',
  gray:    'rgba(255,255,255,0.45)',
  white:   '#ffffff',
  red:     '#ef4444',
  green:   '#22c55e',
}

const DEVICE_COLORS = [G.gold, 'rgba(212,175,55,0.55)', 'rgba(212,175,55,0.25)']
const SOURCE_COLORS = [G.gold, '#b8942e', '#8a6e22', '#5c4916', 'rgba(212,175,55,0.4)', 'rgba(212,175,55,0.25)', 'rgba(212,175,55,0.15)', 'rgba(212,175,55,0.1)']

// ── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number) { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString() }
function fmtDur(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return `${m}m ${sec}s`
}

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

// ── Sub-components ───────────────────────────────────────────────────────────

function KPICard({ label, value, delta, format = 'number' }: {
  label: string; value: number; delta: number | null; format?: string
}) {
  const display =
    format === 'percent'   ? `${value.toFixed(1)}%` :
    format === 'duration'  ? fmtDur(value) :
    format === 'pct-raw'   ? `${(value * 100).toFixed(1)}%` :
    fmt(value)

  const isPos = delta !== null && delta > 0
  const isNeg = delta !== null && delta < 0

  return (
    <div style={{
      background: G.surface, border: `1px solid ${G.goldBrd}`,
      borderRadius: 12, padding: '24px 28px', flex: 1, minWidth: 180,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: G.gold, marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color: G.white,
        fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1 }}>
        {display}
      </div>
      {delta !== null && (
        <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600,
          color: isPos ? G.green : isNeg ? G.red : G.gray }}>
          {isPos ? '▲' : isNeg ? '▼' : '—'} {Math.abs(delta)}% vs prev period
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: G.surface, border: `1px solid ${G.border}`,
      borderRadius: 12, padding: '28px 32px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: G.gold, marginBottom: 24 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: 180, color: G.gray, fontSize: 14 }}>
      Loading…
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#111', border: `1px solid ${G.goldBrd}`,
      borderRadius: 8, padding: '10px 16px', fontSize: 13 }}>
      <div style={{ color: G.gray, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  )
}

// ── Login gate ───────────────────────────────────────────────────────────────
function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw]   = useState('')
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASS) {
      sessionStorage.setItem('tfs_admin', '1')
      onAuth()
    } else {
      setErr(true)
      setPw('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: G.black, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ width: 380, padding: '48px 40px',
        background: G.surface, border: `1px solid ${G.goldBrd}`, borderRadius: 16 }}>
        <img src="/TFS-Logo-Transparent.png" alt="TFS" style={{ height: 48, marginBottom: 32 }} />
        <div style={{ fontSize: 22, fontWeight: 800, color: G.white, marginBottom: 6 }}>
          Admin Portal
        </div>
        <div style={{ fontSize: 14, color: G.gray, marginBottom: 32 }}>
          Enter your access code to continue.
        </div>
        <form onSubmit={submit}>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(false) }}
            placeholder="Access code"
            autoFocus
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${err ? G.red : G.goldBrd}`,
              color: G.white, fontSize: 15, outline: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxSizing: 'border-box', marginBottom: err ? 8 : 16,
            }}
          />
          {err && <div style={{ color: G.red, fontSize: 13, marginBottom: 16 }}>
            Incorrect access code.
          </div>}
          <button type="submit" style={{
            width: '100%', padding: '14px', background: G.gold, color: G.black,
            border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15,
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Enter Dashboard →
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
const RANGES = [
  { label: '7 days',  start: '7daysAgo',  end: 'today' },
  { label: '30 days', start: '30daysAgo', end: 'today' },
  { label: '90 days', start: '90daysAgo', end: 'today' },
]

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [range, setRange]         = useState(1)
  const [overview, setOverview]   = useState<any>(null)
  const [timeseries, setTimeseries] = useState<any[]>([])
  const [pages, setPages]         = useState<any[]>([])
  const [sources, setSources]     = useState<any[]>([])
  const [devices, setDevices]     = useState<any[]>([])
  const [realtime, setRealtime]   = useState<number | null>(null)
  const [loading, setLoading]     = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')

  const { start, end } = RANGES[range]

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [ov, ts, pg, src, dev, rt] = await Promise.all([
        fetchReport('overview',   start, end),
        fetchReport('timeseries', start, end),
        fetchReport('pages',      start, end),
        fetchReport('sources',    start, end),
        fetchReport('devices',    start, end),
        fetchReport('realtime',   start, end),
      ])
      setOverview(ov)
      setTimeseries(ts)
      setPages(pg)
      setSources(src)
      setDevices(dev)
      setRealtime(rt.activeUsers)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [start, end])

  useEffect(() => { loadAll() }, [loadAll])

  // Refresh realtime every 30s
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const rt = await fetchReport('realtime', start, end)
        setRealtime(rt.activeUsers)
      } catch {}
    }, 30000)
    return () => clearInterval(id)
  }, [start, end])

  const totalSessions = sources.reduce((a, s) => a + s.sessions, 0)

  return (
    <div style={{ minHeight: '100vh', background: G.black,
      fontFamily: "'Plus Jakarta Sans', sans-serif", color: G.white }}>

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 68, position: 'sticky', top: 0, background: G.black, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="/TFS-Logo-Transparent.png" alt="TFS" style={{ height: 42 }} />
          <div style={{ width: 1, height: 24, background: G.border }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: G.gold }}>
            Analytics
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {realtime !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
              background: G.goldDim, border: `1px solid ${G.goldBrd}`,
              borderRadius: 20, padding: '6px 14px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%',
                background: G.green, boxShadow: `0 0 6px ${G.green}` }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: G.white }}>
                {realtime} active now
              </span>
            </div>
          )}
          <span style={{ fontSize: 12, color: G.gray }}>Updated {lastUpdated}</span>
          <button onClick={loadAll} style={{
            background: 'transparent', border: `1px solid ${G.border}`,
            color: G.gray, padding: '7px 16px', borderRadius: 6, cursor: 'pointer',
            fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            ↻ Refresh
          </button>
          <button onClick={onLogout} style={{
            background: 'transparent', border: `1px solid ${G.border}`,
            color: G.gray, padding: '7px 16px', borderRadius: 6, cursor: 'pointer',
            fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36, display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: G.white }}>
              trifactorscaling.com
            </div>
            <div style={{ fontSize: 15, color: G.gray, marginTop: 4 }}>
              Website analytics dashboard
            </div>
          </div>
          {/* Date range */}
          <div style={{ display: 'flex', gap: 6, background: G.surface,
            border: `1px solid ${G.border}`, borderRadius: 8, padding: 4 }}>
            {RANGES.map((r, i) => (
              <button key={i} onClick={() => setRange(i)} style={{
                padding: '8px 18px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                background: range === i ? G.gold : 'transparent',
                color: range === i ? G.black : G.gray,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'all 0.18s',
              }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ flex: 1, height: 120, background: G.surface,
                border: `1px solid ${G.goldBrd}`, borderRadius: 12,
                animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : overview ? (
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <KPICard label="Sessions"   value={overview.sessions.value}    delta={overview.sessions.delta} />
            <KPICard label="Users"      value={overview.users.value}       delta={overview.users.delta} />
            <KPICard label="Page Views" value={overview.pageViews.value}   delta={overview.pageViews.delta} />
            <KPICard label="Bounce Rate" value={overview.bounceRate.value} delta={overview.bounceRate.delta} format="pct-raw" />
            <KPICard label="Avg Session" value={overview.avgDuration.value} delta={overview.avgDuration.delta} format="duration" />
          </div>
        ) : null}

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 20 }}>
          <Section title="Sessions Over Time">
            {loading ? <Spinner /> : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={timeseries} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={G.border} />
                  <XAxis dataKey="date" tick={{ fill: G.gray, fontSize: 12 }}
                    tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: G.gray, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="sessions" name="Sessions"
                    stroke={G.gold} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: G.gold }} />
                  <Line type="monotone" dataKey="users" name="Users"
                    stroke="rgba(212,175,55,0.4)" strokeWidth={2} dot={false}
                    strokeDasharray="4 3" activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Section>
        </div>

        {/* Second row: Top Pages + Sources */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, marginBottom: 20 }}>

          <Section title="Top Pages">
            {loading ? <Spinner /> : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${G.border}` }}>
                      {['Page', 'Views', 'Sessions', 'Bounce'].map(h => (
                        <th key={h} style={{ textAlign: h === 'Page' ? 'left' : 'right',
                          padding: '0 12px 14px 0', color: G.gray, fontWeight: 600,
                          letterSpacing: '0.06em', fontSize: 11, textTransform: 'uppercase' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((p, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${G.border}` }}>
                        <td style={{ padding: '13px 12px 13px 0', color: G.white,
                          maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap' }}>
                          <span style={{ color: G.gray }}>{p.path === '/' ? '/' : p.path}</span>
                        </td>
                        <td style={{ padding: '13px 12px 13px 0', textAlign: 'right',
                          color: G.white, fontWeight: 600 }}>{fmt(p.views)}</td>
                        <td style={{ padding: '13px 12px 13px 0', textAlign: 'right',
                          color: G.gray }}>{fmt(p.sessions)}</td>
                        <td style={{ padding: '13px 0 13px 0', textAlign: 'right',
                          color: p.bounceRate > 60 ? G.red : p.bounceRate < 40 ? G.green : G.gray }}>
                          {p.bounceRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          <Section title="Traffic Sources">
            {loading ? <Spinner /> : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sources} layout="vertical"
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="channel" tick={{ fill: G.gray, fontSize: 12 }}
                      tickLine={false} axisLine={false} width={110} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sessions" name="Sessions" radius={4}>
                      {sources.map((_, i) => (
                        <Cell key={i} fill={SOURCE_COLORS[i] ?? G.goldBrd} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sources.map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                      fontSize: 13, color: G.gray }}>
                      <span style={{ color: G.white }}>{s.channel}</span>
                      <span>{totalSessions > 0 ? Math.round((s.sessions / totalSessions) * 100) : 0}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Section>
        </div>

        {/* Third row: Devices */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>

          <Section title="Devices">
            {loading ? <Spinner /> : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={devices} dataKey="sessions" nameKey="device"
                      cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      strokeWidth={0}>
                      {devices.map((_, i) => (
                        <Cell key={i} fill={DEVICE_COLORS[i] ?? G.goldBrd} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [fmt(v), 'Sessions']} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                  {devices.map((d, i) => {
                    const total = devices.reduce((a, x) => a + x.sessions, 0)
                    const pct = total > 0 ? Math.round((d.sessions / total) * 100) : 0
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, flexShrink: 0,
                          background: DEVICE_COLORS[i] ?? G.goldBrd }} />
                        <span style={{ fontSize: 13, color: G.white, flex: 1, textTransform: 'capitalize' }}>
                          {d.device}
                        </span>
                        <span style={{ fontSize: 13, color: G.gold, fontWeight: 700 }}>{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </Section>

          <Section title="Conversions by Channel">
            {loading ? <Spinner /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sources} margin={{ top: 4, right: 8, bottom: 20, left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={G.border} vertical={false} />
                  <XAxis dataKey="channel" tick={{ fill: G.gray, fontSize: 11 }}
                    tickLine={false} axisLine={false} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fill: G.gray, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="conversions" name="Conversions" radius={4} fill={G.gold} />
                  <Bar dataKey="users" name="Users" radius={4} fill="rgba(212,175,55,0.25)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Section>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 3px; }
      `}</style>
    </div>
  )
}

// ── Root export ──────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('tfs_admin') === '1'
  )

  const logout = () => {
    sessionStorage.removeItem('tfs_admin')
    setAuthed(false)
  }

  return authed
    ? <Dashboard onLogout={logout} />
    : <LoginGate onAuth={() => setAuthed(true)} />
}
