import { Link } from 'react-router-dom'
import React, { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="mb-6 site-header header" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap'}}>
      <Link to="/" className="flex items-center gap-4" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setOpen(false)}>
        <div style={{width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', borderRadius:8, border:'1px solid rgba(255,255,255,0.04)'}}>
          <img src="/favicon.svg" alt="WhyStack logo" style={{width:28, height:28, display:'block'}} />
        </div>
        <div>
          <div className="h1">WhyStack <span style={{fontSize:12, marginLeft:8, color:'rgba(230,238,248,0.6)'}}>v0.1</span></div>
          <div className="muted">Explain My System Like I'm 5 | Deterministic Root‑Cause Analysis</div>
        </div>
      </Link>

      <nav className="nav-links text-sm" style={{display:'flex', gap:12}}>
        <Link className="muted" to="/docs">Docs</Link>
        <Link className="muted" to="/rules">Rules</Link>
        <Link className="muted" to="/about">About</Link>
      </nav>

      <button aria-label="Toggle menu" className="hamburger btn" onClick={() => setOpen(o => !o)} style={{border:'1px solid rgba(255,255,255,0.04)'}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>
      </button>

      <div className={`mobile-nav ${open ? 'open' : ''}`} role="menu" aria-hidden={!open}>
        <Link to="/docs" onClick={() => setOpen(false)}>Docs</Link>
        <Link to="/rules" onClick={() => setOpen(false)}>Rules</Link>
        <Link to="/about" onClick={() => setOpen(false)}>About</Link>
      </div>
    </header>
  )
}
