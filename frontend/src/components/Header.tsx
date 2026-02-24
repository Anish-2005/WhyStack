import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { Menu, X, Activity } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-30 mb-8 animate-fade-in">
      <div className="glass-panel flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]" onClick={() => setOpen(false)}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 shadow-lg shadow-brand-500/10">
            <Activity className="h-6 w-6 text-brand-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">WhyStack</h1>
              <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 text-xs font-semibold text-brand-300">v0.1</span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Explain My System Like I'm 5 | Deterministic RCA</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" to="/docs">Docs</Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" to="/rules">Rules</Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" to="/about">About</Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden btn btn-outline p-2"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 glass-panel p-2 flex flex-col gap-1 sm:hidden animate-slide-up">
          <Link className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors" to="/docs" onClick={() => setOpen(false)}>Docs</Link>
          <Link className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors" to="/rules" onClick={() => setOpen(false)}>Rules</Link>
          <Link className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors" to="/about" onClick={() => setOpen(false)}>About</Link>
        </div>
      )}
    </header>
  )
}
