export default function Header() {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div style={{width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', background:'#081225', borderRadius:8, border:'1px solid rgba(255,255,255,0.04)'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="1" y="1" width="22" height="22" rx="5" fill="#4f46e5"/>
            <path d="M7 13h10M7 9h10M7 17h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="h1">WhyStack <span style={{fontSize:12, marginLeft:8, color:'rgba(230,238,248,0.6)'}}>v0.1</span></div>
          <div className="muted">Explain My System Like I'm 5 | Deterministic Root‑Cause Analysis</div>
        </div>
      </div>

      <nav className="text-sm">
        <a className="muted mr-4" href="#">Docs</a>
        <a className="muted mr-4" href="#">Rules</a>
        <a className="muted" href="#">About</a>
      </nav>
    </header>
  )
}
