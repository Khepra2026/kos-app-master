import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getHealth } from './lib/api'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function App(){
  const [health, setHealth] = useState<any>(null)
  const [page, setPage] = useState<'home'|'dashboard'|'tx'|'compliance'>('home')
  const [user, setUser] = useState<any>(null)

  useEffect(()=>{ getHealth().then(setHealth); const i=setInterval(()=>getHealth().then(setHealth),15000); return ()=>clearInterval(i) },[])
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>setUser(data.session?.user)) },[])

  return (
    <div style={{minHeight:'100vh', background:'#0a0a0b', color:'white', fontFamily:'Inter, system-ui'}}>
      {/* NAV Big Four */}
      <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 40px', borderBottom:'1px solid #1f1f22', position:'sticky', top:0, background:'#0a0a0b', zIndex:10}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:36, height:36, background:'linear-gradient(135deg,#fff,#a1a1aa)', borderRadius:10, display:'grid', placeItems:'center', color:'#000', fontWeight:900}}>K</div>
          <div><div style={{fontWeight:800, letterSpacing:-0.5}}>KOS</div><div style={{fontSize:10, opacity:0.5, letterSpacing:1}}>REGTECH • BIG FOUR</div></div>
          <span style={{marginLeft:16, fontSize:11, padding:'4px 8px', background:'#dcfce7', color:'#14532d', borderRadius:999, fontWeight:700}}>{health?.status || 'ONLINE'} • {health?.region?.toUpperCase()}</span>
        </div>
        <div style={{display:'flex', gap:24, fontSize:13, opacity:0.7}}>
          <span onClick={()=>setPage('home')} style={{cursor:'pointer', fontWeight:page==='home'?700:400, opacity:page==='home'?1:0.6}}>Product</span>
          <span onClick={()=>setPage('dashboard')} style={{cursor:'pointer', fontWeight:page==='dashboard'?700:400, opacity:page==='dashboard'?1:0.6}}>Dashboard</span>
          <span onClick={()=>setPage('tx')} style={{cursor:'pointer', fontWeight:page==='tx'?700:400, opacity:page==='tx'?1:0.6}}>Transactions</span>
          <span onClick={()=>setPage('compliance')} style={{cursor:'pointer', fontWeight:page==='compliance'?700:400, opacity:page==='compliance'?1:0.6}}>Compliance</span>
        </div>
        <button style={{background:'white', color:'black', border:0, padding:'8px 16px', borderRadius:999, fontWeight:700, fontSize:13, cursor:'pointer'}}>{user? user.email.slice(0,12)+'...' : 'Login'}</button>
      </nav>

      {page==='home' && (
        <>
          {/* HERO Big Four Readdy */}
          <section style={{padding:'80px 40px', maxWidth:1200, margin:'0 auto'}}>
            <div style={{display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:40, alignItems:'center'}}>
              <div>
                <div style={{display:'inline-flex', gap:8, alignItems:'center', background:'#1f1f22', border:'1px solid #2a2a2e', padding:'6px 12px', borderRadius:999, fontSize:11, marginBottom:20}}>
                  <span style={{width:6, height:6, background:'#22c55e', borderRadius:999}}/> v{health?.version || '3.0.0-bigfour'} • Production • Paris CDG
                </div>
                <h1 style={{fontSize:64, fontWeight:900, lineHeight:0.95, letterSpacing:-3, margin:0}}>
                  The RegTech<br/>platform built<br/>for <span style={{color:'#a1a1aa'}}>scale.</span>
                </h1>
                <p style={{marginTop:20, fontSize:18, opacity:0.6, lineHeight:1.5, maxWidth:500}}>
                  KOS unifies KYC, AML, PayDunya and Supabase in one Big Four-grade enterprise hub. 
                  Deployed on Fly.io • Supabase connected • PayDunya ready.
                </p>
                <div style={{display:'flex', gap:12, marginTop:32}}>
                  <button onClick={()=>setPage('dashboard')} style={{background:'white', color:'black', border:0, padding:'14px 24px', borderRadius:999, fontWeight:700, cursor:'pointer'}}>Open Dashboard →</button>
                  <a href="https://api-khepraexperts.fly.dev/health" target="_blank" style={{background:'#1f1f22', color:'white', border:'1px solid #2a2a2e', padding:'14px 24px', borderRadius:999, fontWeight:600, textDecoration:'none'}}>API Health ↗</a>
                </div>
                <div style={{display:'flex', gap:32, marginTop:48}}>
                  {[
                    {k:'99.9%', l:'Uptime'},
                    {k:'CDG', l:'Region'},
                    {k:'23MB', l:'Image'},
                  ].map(s=>(
                    <div key={s.l}><div style={{fontSize:22, fontWeight:800}}>{s.k}</div><div style={{fontSize:11, opacity:0.5, textTransform:'uppercase'}}>{s.l}</div></div>
                  ))}
                </div>
              </div>
              <div style={{background:'#111113', border:'1px solid #1f1f22', borderRadius:24, padding:24}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:16, fontSize:12, opacity:0.5}}><span>Live /health</span><span>{health?.timestamp}</span></div>
                <pre style={{margin:0, background:'#0a0a0b', padding:16, borderRadius:16, fontSize:12, lineHeight:1.6, border:'1px solid #1f1f22', overflow:'auto'}}>{JSON.stringify(health || {status:'LOADING'}, null, 2)}</pre>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:16}}>
                  <div style={{background:'#0a0a0b', border:'1px solid #1f1f22', borderRadius:12, padding:12}}><div style={{fontSize:10, opacity:0.5}}>SUPABASE</div><div style={{fontWeight:800, color:'#22c55e'}}>{health?.supabase}</div></div>
                  <div style={{background:'#0a0a0b', border:'1px solid #1f1f22', borderRadius:12, padding:12}}><div style={{fontSize:10, opacity:0.5}}>PAYDUNYA</div><div style={{fontWeight:800, color:'#22c55e'}}>{health?.paydunya}</div></div>
                </div>
              </div>
            </div>
          </section>
          <section style={{borderTop:'1px solid #1f1f22', padding:'40px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, maxWidth:1200, margin:'0 auto'}}>
            {[
              {t:'KYC Engine', d:'Supabase Auth + RLS + audit logs'},
              {t:'AML Monitor', d:'Real-time scoring & compliance'},
              {t:'PayDunya Hub', d:'XOF payments • Webhooks ready'},
              {t:'Fly.io Edge', d:'Paris CDG • 23MB • <100ms'},
            ].map(f=>(
              <div key={f.t} style={{background:'#111113', border:'1px solid #1f1f22', borderRadius:16, padding:20}}>
                <div style={{fontWeight:700}}>{f.t}</div><div style={{fontSize:13, opacity:0.5, marginTop:6}}>{f.d}</div>
              </div>
            ))}
          </section>
        </>
      )}

      {page!=='home' && (
        <div style={{padding:40, maxWidth:1200, margin:'0 auto'}}>
          <h2 style={{fontSize:32, fontWeight:800, letterSpacing:-1, textTransform:'capitalize'}}>{page}</h2>
          <p style={{opacity:0.6}}>Module {page} Big Four - intégré à Supabase + API KhepraExperts</p>
          <div style={{marginTop:24, background:'#111113', border:'1px solid #1f1f22', borderRadius:16, padding:24}}>
            <pre style={{margin:0, fontSize:13}}>{JSON.stringify(health, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
