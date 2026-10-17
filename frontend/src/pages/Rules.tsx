import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import { fetchRules } from '../utils/api'
import type { RuleSummary } from '../types/api'

export default function Rules() {
  const [rules, setRules] = useState<RuleSummary[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetchRules()
      .then(({ rules: currentRules }) => {
        if (active) setRules(currentRules)
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : 'Could not load rules.')
      })

    return () => { active = false }
  }, [])

  return (
    <div className="max-w-[1600px] mx-auto w-full min-h-screen flex flex-col pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <motion.div
          className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-brand-600/10 blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10">
        <Header />
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-extrabold text-liquid-glow mb-4 font-sans">Rule engine</h1>
          <p className="text-lg text-slate-300">These server rules are the single source of truth for how telemetry signals map to explanations.</p>
          <p className="mt-3 text-sm text-slate-400">Rule weights are deterministic ranking inputs, not statistical probabilities. Multi-signal rules require the same service and a five-minute window.</p>
        </motion.header>

        {error ? (
          <p className="liquid-glass p-6 text-rose-300 text-center" role="alert">{error}</p>
        ) : rules === null ? (
          <p className="liquid-glass p-6 text-slate-300 text-center" role="status" aria-live="polite">Loading active rules…</p>
        ) : (
          <section className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto" aria-label="Active analysis rules">
            {rules.map((rule, index) => (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
                key={rule.id}
                className="liquid-glass p-6"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">{rule.cause}</h2>
                    <p className="mt-1 text-xs text-slate-400 font-mono break-all">{rule.id}</p>
                  </div>
                  <span className="shrink-0 px-3 py-1 bg-brand-500/20 text-brand-300 text-xs font-bold rounded-full border border-brand-500/30">
                    Weight {Math.round(rule.confidence * 100)}%
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Required signals</h3>
                  <ul className="flex flex-wrap gap-2" aria-label="Required signal conditions">
                    {rule.conditions.map((condition) => (
                      <li key={condition} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 shadow-inner">
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </section>
        )}

        <footer className="mt-12 text-sm text-slate-400 text-center">
          Rule changes require regression examples in the backend test suite.
        </footer>
      </div>
    </div>
  )
}
