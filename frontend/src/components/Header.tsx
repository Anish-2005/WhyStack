import { Link, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Menu, X, Activity, Book, Shield, Info, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: 'Docs', path: '/docs', icon: Book },
    { name: 'Rules', path: '/rules', icon: Shield },
    { name: 'About', path: '/about', icon: Info },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-50 mb-6 sm:mb-8"
    >
      <div className="liquid-glass flex items-center justify-between p-2.5 sm:p-3 sm:px-5">
        <Link to="/" className="flex items-center gap-3 sm:gap-4 transition-transform hover:scale-[1.02] group shrink-0" onClick={() => setOpen(false)}>
          <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-shadow duration-500 shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-xl sm:rounded-2xl border border-white/5 border-t-white/20"
            />
            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-brand-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white font-sans text-liquid-glow">WhyStack</h1>
              <span className="rounded-full border border-brand-400/30 bg-brand-500/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-300 flex-shrink-0">v0.1</span>
            </div>
            <p className="hidden md:block text-xs text-slate-400 font-medium tracking-wide">Deterministic Root Cause Analysis</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  className={`text-sm font-semibold transition-all px-3 py-2 rounded-xl flex items-center gap-2 ${isActive ? 'text-white bg-white/10 shadow-inner border border-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                  to={link.path}
                >
                  <link.icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span className={isActive ? 'text-liquid-glow' : ''}>{link.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Mobile Hamburger */}
            <button
              className="md:hidden relative p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center shrink-0"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="h-5 w-5 text-slate-200" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="h-5 w-5 text-slate-200" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[110%] w-full liquid-glass flex flex-col p-2 md:hidden origin-top shadow-2xl z-50 border border-white/10"
          >
            <div className="flex flex-col gap-1 w-full">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={link.path}
                  >
                    <Link
                      className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${isActive ? 'bg-brand-500/10 text-brand-300 border-white/10 shadow-inner' : 'text-slate-200 hover:bg-white/5 border-transparent'} border`}
                      to={link.path}
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'bg-white/5 text-slate-400 group-hover:text-slate-200 border border-white/5'} transition-all`}>
                          <link.icon className="w-4 h-4" />
                        </div>
                        <span className={isActive ? 'text-brand-300' : ''}>{link.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
            <div className="mt-2 pt-3 border-t border-white/5 pb-2 px-4 text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">WhyStack v0.1</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
