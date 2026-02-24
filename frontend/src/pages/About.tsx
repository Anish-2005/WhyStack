import React from 'react'
import Header from '../components/Header'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="max-w-[1600px] mx-auto w-full min-h-screen flex flex-col pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <Header />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="liquid-glass p-8 sm:p-12 text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-liquid-glow mb-6 font-sans">About WhyStack</h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">WhyStack provides deterministic, explainable root-cause analysis for observability teams. It runs locally or as a service and produces concise, auditable explanations from JSON logs.</p>
        </motion.div>

        <section className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="liquid-glass p-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Goals</h2>
            <ul className="text-slate-300 space-y-3 font-medium">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" /> Deterministic rules-based RCA</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" /> Human-readable explanations</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" /> Small, auditable rule sets</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="liquid-glass p-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Use Cases</h2>
            <p className="text-slate-300 leading-relaxed font-medium">Incident triage, post-incident analysis, or as a lightweight assistant for SREs and developers to better understand application logic and log patterns quickly.</p>
          </motion.div>
        </section>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-16 text-sm text-slate-500 text-center font-medium tracking-wide">
          Built with transparency and reproducibility in mind.
        </motion.footer>
      </div>
    </div>
  )
}
