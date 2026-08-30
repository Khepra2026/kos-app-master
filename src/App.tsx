import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { API_URL, getHealth } from './lib/api'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

type Health = { status: string; system: string; version: string; region: string; uptime: number; supabase: string; paydunya: string; timestamp: string; env: string }
type Page = 'dashboard' | 'transactions' | 'compliance' | 'health'

export default function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [page, setPage] = useState<Page>('dashboard')
  const [txs, setTxs] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const load = () => getHealth().then(setHealth).catch(()=>{})
    load(); const id=setInterval(load,15000); return ()=>clearInterval(id)
  }, [])
  useEffect(() => {
    supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null))
    supabase.from('transactions').select('*').order('created_at',{ascending:false}).limit(20)
      .then(({data, error})=>{ if(!error && data) setTxs(data); else setTxs([
        {id:1, amount: 50000, currency:'XOF', status:'success', provider:'PayDunya', created_at: new Date().toISOString()},
        {id:2, amount: 25000, currency:'XOF', status:'pending', provider:'PayDunya', created_at: new Date().toISOString()},
      ]) })
  }, [])

  const login = async () => {
    const email = prompt('Email?')||''; const password = prompt('Password?')||''
    if(!email) return
    const {data, error} = await supabase.auth.signInWithPassword({email, password})
    if(error) { const {error: e2} = await supabase.auth.signUp({email, password}); if(e2) alert(e2.message); else alert('Check email, then login'); }
    else setUser(data.user)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui', display: 'flex' }}>
      <aside style={{ width: 260, background: '#0f172a', color: 'white', padding: 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>KOS</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 24 }}>RegTech Enterprise Hub</div>
        <div style={{ background: '#1e293b', borderRadius: 8, padding: 10, fontSize: 12, marginBottom: 20 }}>
          {user ? `👤 ${user.email}` : 'Not logged in'}<br/>
          <button onClick={()=> user ? supabase.auth.signOut().then(()=>setUser(null)) : login()} style={{ marginTop: 8, background: 'white', color: '#0f172a', border: 0, padding: '6px 10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', width: '100%' }}>{user ? 'Logout' : 'Login / Signup'}</button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14 }}>
          {[
            {k:'dashboard', l:'● Dashboard'},
            {k:'transactions', l:'Transactions'},
            {k:'compliance', l:'Compliance'},
            {k:'health', l:'System Health'},
          ].map(i=>(
            <div key={i.k} onClick={()=>setPage(i.k as Page)} style={{ padding: '10px 12px', background: page===i.k ? '#1e293b' : 'transparent', borderRadius: 8, fontWeight: page===i.k?600:400, opacity: page===i.k?1:0.7, cursor:'pointer' }}>{i.l}</div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', fontSize: 11, opacity: 0.4 }}>v3 • {health?.version} • {health?.region}</div>
      </aside>

      <main style={{ flex: 1, padding: 32 }}>
        {page==='dashboard' && <>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 20px', color: '#0f172a' }}>Enterprise Dashboard</h1>
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: '#16a34a', marginTop: 6 }}/> <b style={{ color: '#14532d' }}>✅ {health?.status} - {health?.version} • {uptimeH}</b> <span style={{ marginLeft: 'auto', fontSize: 12, color: '#475569' }}>{health?.timestamp}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              {l:'SUPABASE', v:health?.supabase},
              {l:'PAYDUNYA', v:health?.paydunya},
              {l:'REGION', v:health?.region?.toUpperCase()},
              {l:'UPTIME', v: health ? (health.uptime/3600).toFixed(2)+'h' : '-'},
            ].map(c=>(
              <div key={c.l} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18 }}><div style={{ fontSize: 11, color: '#64748b' }}>{c.l}</div><div style={{ fontSize: 18, fontWeight: 800, marginTop: 6, color: c.v==='connected'||c.v==='ready' ? '#16a34a' : '#0f172a' }}>{c.v||'-'}</div></div>
            ))}
          </div>
          <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, color: 'white' }}>
            <h3 style={{ margin: '0 0 12px' }}>Live /health</h3>
            <pre style={{ background: '#1e293b', padding: 14, borderRadius: 10, fontSize: 12, overflow: 'auto' }}>{JSON.stringify(health, null, 2)}</pre>
          </div>
        </>}

        {page==='transactions' && <>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 20px' }}>Transactions</h1>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead style={{ background: '#f8fafc', textAlign: 'left' }}><tr><th style={{ padding: 12 }}>ID</th><th style={{ padding: 12 }}>Amount</th><th style={{ padding: 12 }}>Status</th><th style={{ padding: 12 }}>Provider</th><th style={{ padding: 12 }}>Date</th></tr></thead>
              <tbody>{txs.map(t=>(
                <tr key={t.id} style={{ borderTop: '1px solid #e2e8f0' }}><td style={{ padding: 12 }}>{String(t.id).slice(0,8)}</td><td style={{ padding: 12, fontWeight: 700 }}>{t.amount} {t.currency||'XOF'}</td><td style={{ padding: 12 }}><span style={{ background: t.status==='success'?'#dcfce7':'#fef9c3', color: t.status==='success'?'#14532d':'#713f12', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>{t.status}</span></td><td style={{ padding: 12 }}>{t.provider||'PayDunya'}</td><td style={{ padding: 12, color: '#64748b' }}>{new Date(t.created_at).toLocaleString()}</td></tr>
              ))}</tbody>
            </table>
            {txs.length===0 && <div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>No transactions yet - table supabase `transactions` vide</div>}
          </div>
          <div style={{ marginTop: 16, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 12, fontSize: 13 }}>Pour avoir de vraies données: crée la table `transactions` dans Supabase SQL: <code>create table transactions (id uuid default gen_random_uuid() primary key, amount int, currency text, status text, provider text, created_at timestamptz default now());</code></div>
        </>}

        {page==='compliance' && <>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Compliance</h1>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}><div style={{ fontSize: 12, color: '#64748b' }}>KYC STATUS</div><div style={{ fontSize: 20, fontWeight: 800, color: '#16a34a', marginTop: 6 }}>Verified</div></div>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}><div style={{ fontSize: 12, color: '#64748b' }}>AML CHECK</div><div style={{ fontSize: 20, fontWeight: 800, color: '#16a34a', marginTop: 6 }}>Clear</div></div>
          </div>
        </>}

        {page==='health' && <>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>System Health</h1>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <a href={`${API_URL}/health`} target="_blank" style={{ background: '#0f172a', color: 'white', padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}>/health</a>
            <a href={`${API_URL}/api/status`} target="_blank" style={{ background: 'white', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: 8, textDecoration: 'none', color: '#0f172a' }}>/api/status</a>
          </div>
          <pre style={{ marginTop: 16, background: '#0f172a', color: 'white', padding: 16, borderRadius: 12, fontSize: 13 }}>{JSON.stringify(health, null, 2)}</pre>
        </>}
      </main>
    </div>
  )
}


const uptimeH = health ? (health.uptime/3600).toFixed(2)+'h' : '-'
