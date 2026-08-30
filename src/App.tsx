import { useEffect, useState } from 'react'
import { API_URL, getHealth } from './lib/api'

type Health = {
  status: string
  system: string
  version: string
  region: string
  uptime: number
  supabase: string
  paydunya: string
  timestamp: string
  env: string
}

export default function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = () => {
      getHealth()
        .then(setHealth)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
    load()
    const id = setInterval(load, 15000)
    return () => clearInterval(id)
  }, [])

  const uptimeH = health ? (health.uptime / 3600).toFixed(2) + 'h' : '-'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#0f172a', color: 'white', padding: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>KOS</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 32 }}>RegTech Enterprise Hub</div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
          <div style={{ padding: '10px 12px', background: '#1e293b', borderRadius: 8, fontWeight: 600 }}>● Dashboard</div>
          <a href={`${API_URL}/api`} style={{ padding: '10px 12px', opacity: 0.7, textDecoration: 'none', color: 'white' }}>Transactions</a>
          <a href={`${API_URL}/api/status`} style={{ padding: '10px 12px', opacity: 0.7, textDecoration: 'none', color: 'white' }}>Compliance</a>
          <a href={`${API_URL}/health`} style={{ padding: '10px 12px', opacity: 0.7, textDecoration: 'none', color: 'white' }}>System Health</a>
        </nav>

        <div style={{ marginTop: 'auto', fontSize: 12, opacity: 0.5 }}>
          <div>Frontend: {window.location.host}</div>
          <div>API: api-khepraexperts.fly.dev</div>
          <div style={{ marginTop: 8, padding: '6px 8px', background: '#14532d', color: '#4ade80', borderRadius: 6, display: 'inline-block' }}>PROD • cdg</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#0f172a' }}>Enterprise Dashboard</h1>
          <div style={{ fontSize: 13, color: '#64748b' }}>{health?.timestamp || ''}</div>
        </div>

        {/* Status bar */}
        <div style={{ background: health?.status === 'ONLINE' ? '#dcfce7' : '#fee2e2', border: `1px solid ${health?.status === 'ONLINE' ? '#86efac' : '#fca5a5'}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: health?.status === 'ONLINE' ? '#16a34a' : '#dc2626', animation: 'pulse 2s infinite' }} />
          <div style={{ fontWeight: 700, color: health?.status === 'ONLINE' ? '#14532d' : '#7f1d1d' }}>
            {loading ? 'Checking API...' : error ? `❌ ${error}` : `✅ ${health?.status} - ${health?.version}`}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#475569' }}>auto-refresh 15s</div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Supabase', value: health?.supabase || '-', color: health?.supabase === 'connected' ? '#16a34a' : '#dc2626' },
            { label: 'PayDunya', value: health?.paydunya || '-', color: health?.paydunya === 'ready' ? '#16a34a' : '#d97706' },
            { label: 'Region', value: health?.region?.toUpperCase() || '-', color: '#0f172a' },
            { label: 'Uptime', value: uptimeH, color: '#0f172a' },
          ].map((c) => (
            <div key={c.label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* JSON */}
        <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Live /health payload</h3>
            <a href={`${API_URL}/health`} target="_blank" style={{ color: '#7dd3fc', fontSize: 13 }}>open raw ↗</a>
          </div>
          <pre style={{ background: '#1e293b', padding: 16, borderRadius: 12, overflow: 'auto', margin: 0, fontSize: 13, lineHeight: 1.5 }}>
            {health ? JSON.stringify(health, null, 2) : loading ? 'Loading...' : error}
          </pre>
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <a href={`${API_URL}/health`} target="_blank" style={{ background: 'white', color: '#0f172a', padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>/health</a>
            <a href={`${API_URL}/api`} target="_blank" style={{ background: '#1e293b', color: 'white', padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>/api</a>
            <a href={`${API_URL}/api/status`} target="_blank" style={{ background: '#1e293b', color: 'white', padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>/api/status</a>
          </div>
        </div>
      </main>
    </div>
  )
}
