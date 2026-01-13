export default function Header() {
  return (
    <header className="mb-6" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap'}}>
      <div className="flex items-center gap-4">
        <div style={{width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', borderRadius:8, border:'1px solid rgba(255,255,255,0.04)'}}>
          <img src="/favicon.svg" alt="WhyStack logo" style={{width:28, height:28, display:'block'}} />
        </div>
        <div>
          <div className="h1">WhyStack <span style={{fontSize:12, marginLeft:8, color:'rgba(230,238,248,0.6)'}}>v0.1</span></div>
          <div className="muted">Explain My System Like I'm 5 | Deterministic Root‑Cause Analysis</div>
        </div>
      </div>

      <nav className="text-sm" style={{display:'flex', gap:12}}>
        <a className="muted" href="#">Docs</a>
        <a className="muted" href="#">Rules</a>
        <a className="muted" href="#">About</a>
      </nav>
    </header>
  )
}
