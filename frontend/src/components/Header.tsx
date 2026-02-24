import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { Menu, X, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 mb-8"
    >
      <div className="liquid-glass flex items-center justify-between p-3 sm:px-5">
        <Link to="/" className="flex items-center gap-4 transition-transform hover:scale-[1.02] group" onClick={() => setOpen(false)}>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-shadow duration-500">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border border-white/5 border-t-white/20"
            />
            <Activity className="h-6 w-6 text-brand-300" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans text-liquid-glow">WhyStack</h1>
              <span className="rounded-full border border-brand-400/30 bg-brand-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-300">v0.1</span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Deterministic Root Cause Analysis</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-8">
            <Link className="text-sm font-semibold text-slate-300 hover:text-white hover:text-liquid-glow transition-all" to="/docs">Docs</Link>
            <Link className="text-sm font-semibold text-slate-300 hover:text-white hover:text-liquid-glow transition-all" to="/rules">Rules</Link>
            <Link className="text-sm font-semibold text-slate-300 hover:text-white hover:text-liquid-glow transition-all" to="/about">About</Link>
          </nav>

          <ThemeToggle />

          {/* Mobile Hamburger */}
          <button
            className="sm:hidden btn btn-outline p-2.5 rounded-xl border-white/10"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {open ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="h-5 w-5" /></motion.div> :
                <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu className="h-5 w-5" /></motion.div>}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full mt-3 liquid-glass p-3 flex flex-col gap-1 sm:hidden"
          >
            <Link className="rounded-xl px-5 py-4 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors" to="/docs" onClick={() => setOpen(false)}>Docs</Link>
            <Link className="rounded-xl px-5 py-4 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors" to="/rules" onClick={() => setOpen(false)}>Rules</Link>
            <Link className="rounded-xl px-5 py-4 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-colors" to="/about" onClick={() => setOpen(false)}>About</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
