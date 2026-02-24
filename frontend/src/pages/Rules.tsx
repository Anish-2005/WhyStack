import React from 'react'
import Header from '../components/Header'
import { motion } from 'framer-motion'

const rules = [
  { conditions: ['latency_spike', 'cpu_saturation'], cause: 'High CPU load', confidence: 0.8 },
  { conditions: ['latency_spike', 'memory_pressure'], cause: 'Memory pressure causing GC pauses', confidence: 0.7 },
  { conditions: ['error_event', 'dependency_failure'], cause: 'Downstream dependency failure', confidence: 0.9 },
  { conditions: ['error_event'], cause: 'Application errors (5xx)', confidence: 0.6 }
]

export default function Rules() {
  return (
    <div className="max-w-[1600px] mx-auto w-full min-h-screen flex flex-col pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-brand-600/10 blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10">
        <Header />
        <motion.header
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-10 text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-extrabold text-liquid-glow mb-4 font-sans">Rule Engine</h1>
          <p className="text-lg text-slate-300">The engine uses human-readable rules to map observed signals into ranked causes. Rules are intentionally concise and auditable.</p>
        </motion.header>

        <section className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {rules.map((r, i) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }}
              key={i}
              className="liquid-glass p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">{r.cause}</h3>
                <span className="px-3 py-1 bg-brand-500/20 text-brand-300 text-xs font-bold rounded-full border border-brand-500/30">
                  {Math.round(r.confidence * 100)}% Match
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Conditions Triggered</h4>
                <div className="flex flex-wrap gap-2">
                  {r.conditions.map((c) => (
                    <span key={c} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 shadow-inner">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 text-sm text-slate-400 text-center">
          Want to customize rules? Edit the backend <code className="text-brand-300 font-mono">ruleEngine</code> module and keep rules small and testable.
        </motion.footer>
      </div>
    </div>
  )
}
