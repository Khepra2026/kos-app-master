import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getHealth } from './lib/api'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function App(){
  const [health, setHealth] = useState<any>(null)
  useEffect(()=>{ getHealth().then(setHealth); const i=setInterval(()=>getHealth().then(setHealth),15000); return ()=>clearInterval(i) },[])
  const [_user,setUser] = useState<any>(null)
  useEffect(()=>{ supabase.auth.getSession().then(({data})=>setUser(data.session?.user)) },[])

  return (
    <div style={{minHeight:'100vh', background:'#08080a', color:'white', fontFamily:'Inter, system-ui'}}>
      <nav style={{display:'flex', justifyContent:'space-between', padding:'16px 40px', borderBottom:'1px solid #1f1f22', position:'sticky', top:0, background:'#08080ae6', backdropFilter:'blur(12px)', zIndex:10}}>
        <div style={{display:'flex', gap:12, alignItems:'center'}}><div style={{width:32, height:32, background:'white', borderRadius:8, display:'grid', placeItems:'center', color:'black', fontWeight:900}}>K</div><b>KOS</b><span style={{fontSize:10, opacity:0.5, background:'#1f1f22', padding:'3px 8px', borderRadius:999}}>REGTECH • BIG FOUR</span><span style={{fontSize:10, background:'#dcfce7', color:'#14532d', padding:'3px 8px', borderRadius:999, fontWeight:700}}>ONLINE • CDG</span></div>
        <div style={{display:'flex', gap:20, fontSize:13, opacity:0.6, alignItems:'center'}}><a href="#product" style={{color:'white', textDecoration:'none'}}>Product</a><a href="#pricing" style={{color:'white', textDecoration:'none'}}>Pricing</a><a href="https://api-khepraexperts.fly.dev/health" style={{color:'white', textDecoration:'none'}}>API ↗</a><button style={{background:'white', color:'black', border:0, padding:'8px 16px', borderRadius:999, fontWeight:700}}>Start building</button></div>
      </nav>

      <section id="product" style={{padding:'100px 40px 60px', maxWidth:1280, margin:'0 auto'}}>
        <div style={{display:'inline-flex', background:'#111113', border:'1px solid #222', padding:'6px 12px', borderRadius:999, fontSize:11, gap:8}}><span style={{width:6, height:6, background:'#22c55e', borderRadius:999, display:'inline-block', marginTop:4}}/> v{health?.version} • Supabase connected • PayDunya ready • Paris CDG</div>
        <h1 style={{fontSize:'clamp(40px,7vw,84px)', fontWeight:900, lineHeight:0.9, letterSpacing:-4, margin:'20px 0'}}>RegTech<br/>infrastructure<br/><span style={{color:'#52525b'}}>for African</span><br/>fintechs.</h1>
        <p style={{fontSize:18, opacity:0.6, maxWidth:600, lineHeight:1.6}}>KOS par Khepra Experts. KYC, AML, transactions XOF PayDunya, audit logs Supabase. Déployé sur Fly.io edge. Conformité Big Four, vitesse startup.</p>
        <div style={{display:'flex', gap:12, marginTop:28}}><button style={{background:'white', color:'black', padding:'14px 22px', borderRadius:999, fontWeight:700, border:0, cursor:'pointer'}}>Deploy in 2 min →</button><button style={{background:'#1a1a1e', color:'white', padding:'14px 22px', borderRadius:999, fontWeight:600, border:'1px solid #2a2a2e'}}>View docs</button></div>
      </section>

      <section style={{padding:'0 40px', maxWidth:1280, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:16}}>
          <div style={{background:'linear-gradient(180deg,#141416,#0a0a0b)', border:'1px solid #1f1f22', borderRadius:24, padding:24}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:12, opacity:0.5, marginBottom:12}}><span>Live production status</span><span>{health?.timestamp}</span></div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
              {[
                {l:'API', v:health?.status, c:'#22c55e'},
                {l:'DB', v:health?.supabase, c:'#22c55e'},
                {l:'PAY', v:health?.paydunya, c:'#22c55e'},
                {l:'REGION', v:health?.region, c:'white'},
                {l:'UPTIME', v: health ? (health.uptime/3600).toFixed(2)+'h' : '-', c:'white'},
                {l:'ENV', v:health?.env, c:'white'},
              ].map(x=>(
                <div key={x.l} style={{background:'#0a0a0b', border:'1px solid #1f1f22', borderRadius:12, padding:14}}><div style={{fontSize:10, opacity:0.5}}>{x.l}</div><div style={{fontWeight:800, color:x.c, marginTop:4, textTransform:'uppercase', fontSize:13}}>{x.v || '-'}</div></div>
              ))}
            </div>
            <pre style={{marginTop:16, background:'#08080a', border:'1px solid #1f1f22', borderRadius:12, padding:12, fontSize:11, overflow:'auto'}}>{JSON.stringify(health, null, 2)}</pre>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            <div style={{background:'#111113', border:'1px solid #1f1f22', borderRadius:24, padding:20}}><h3 style={{margin:0, fontSize:16}}>KYC Engine</h3><p style={{opacity:0.5, fontSize:13, marginTop:6}}>Supabase Auth • RLS • Audit logs • CNSS • Verification ID Togo</p><div style={{marginTop:12, fontSize:11, background:'#22c55e20', color:'#4ade80', display:'inline-block', padding:'4px 8px', borderRadius:999}}>✓ Production ready</div></div>
            <div style={{background:'#111113', border:'1px solid #1f1f22', borderRadius:24, padding:20}}><h3 style={{margin:0, fontSize:16}}>PayDunya XOF</h3><p style={{opacity:0.5, fontSize:13, marginTop:6}}>Mobile Money, Wave, Orange, MTN • Webhooks • Reconciliation auto</p><div style={{marginTop:12, fontSize:11, background:'#22c55e20', color:'#4ade80', display:'inline-block', padding:'4px 8px', borderRadius:999}}>✓ Ready</div></div>
            <div style={{background:'white', color:'black', borderRadius:24, padding:20}}><h3 style={{margin:0, fontSize:16}}>Big Four Grade</h3><p style={{opacity:0.6, fontSize:13, marginTop:6}}>Documentation, traçabilité, contrôles SOC2-like. Prix startup africaine.</p><div style={{marginTop:12, fontSize:12, fontWeight:700}}>khepraexperts.com →</div></div>
          </div>
        </div>
      </section>

      <section id="pricing" style={{padding:'80px 40px', maxWidth:1280, margin:'0 auto'}}>
        <h2 style={{fontSize:36, fontWeight:800, letterSpacing:-1}}>Simple pricing. Enterprise power.</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginTop:24}}>
          {[
            {name:'Starter', price:'0 XOF', feat:['100 KYC / mois','PayDunya sandbox','Supabase included']},
            {name:'Growth', price:'50k XOF', feat:['5k KYC / mois','AML scoring','Support Slack','Webhooks prod'], pop:true},
            {name:'Big Four', price:'Contact', feat:['Illimité','On-premise option','Audit KPMG-style','SLA 99.9%']},
          ].map(p=>(
            <div key={p.name} style={{background: p.pop ? 'white' : '#111113', color: p.pop ? 'black' : 'white', border: p.pop ? '0' : '1px solid #1f1f22', borderRadius:24, padding:24}}>
              <div style={{fontWeight:700}}>{p.name}</div><div style={{fontSize:28, fontWeight:900, marginTop:8}}>{p.price}</div>
              <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:8, fontSize:13, opacity:p.pop?0.7:0.6}}>{p.feat.map(f=><div key={f}>• {f}</div>)}</div>
              <button style={{marginTop:20, width:'100%', padding:'12px', borderRadius:999, border:0, fontWeight:700, background: p.pop ? 'black' : 'white', color: p.pop ? 'white' : 'black', cursor:'pointer'}}>Choose {p.name}</button>
            </div>
          ))}
        </div>
      </section>

      <footer style={{borderTop:'1px solid #1f1f22', padding:'24px 40px', display:'flex', justifyContent:'space-between', fontSize:12, opacity:0.5}}>
        <div>© 2026 Khepra Experts • KOS RegTech Enterprise Hub • v{health?.version} • CDG</div>
        <div>api-khepraexperts.fly.dev • supabase connected • paydunya ready</div>
      </footer>
    </div>
  )
}

