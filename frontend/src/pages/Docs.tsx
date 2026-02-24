import React from 'react'
import Header from '../components/Header'
import { motion } from 'framer-motion'

export default function Docs() {
  return (
    <div className="max-w-[1600px] mx-auto w-full min-h-screen flex flex-col pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto w-full">
        <Header />

        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-liquid-glow mb-4 font-sans">Documentation</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">Deterministic, explainable RCA for JSON logs. Learn how the engine works, payload shapes, and integration tips.</p>
        </motion.header>

        <section className="grid md:grid-cols-2 gap-8 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="liquid-glass p-8">
            <h2 className="text-2xl font-bold mb-4 text-white">How it Works</h2>
            <p className="text-slate-300 leading-relaxed font-medium">WhyStack normalizes event timelines by service, extracts heuristic signals (latency, errors, CPU/memory pressure), then matches combinations of signals against a rule set to produce ranked causes and human-readable explanations.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="liquid-glass p-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Integration</h2>
            <p className="text-slate-300 leading-relaxed font-medium">POST a JSON payload to <code className="bg-white/10 px-2 py-1 rounded text-brand-300 font-mono shadow-inner border border-white/5">/explain</code> with a top-level <code>logs</code> array. See the example payload and response below.</p>
          </motion.div>
        </section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass p-8 mb-8">
          <h3 className="text-xl font-bold mb-4 text-white">Example Request</h3>
          <pre className="bg-surface/80 p-6 rounded-2xl text-sm overflow-auto font-mono text-slate-300 shadow-inner border border-white/5">
            {`{
  "logs": [
    { "timestamp": "2026-01-13T16:12:00Z", "service": "api-gateway", "latency_ms": 920, "cpu_percent": 85, "status": 502, "error": "Bad Gateway" }
  ]
}`}
          </pre>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="liquid-glass p-8">
          <h3 className="text-xl font-bold mb-4 text-white">Example Response</h3>
          <pre className="bg-surface/80 p-6 rounded-2xl text-sm overflow-auto font-mono text-slate-300 shadow-inner border border-white/5">
            {`{
  "summary": "Downstream dependency failure",
  "explanation": "The api-gateway likely misbehaved because Downstream dependency failure. This started around 2026-01-13T16:12:00Z when signals such as error_event, dependency_failure were observed.",
  "signals_detected": ["error_event","dependency_failure"],
  "confidence": "High"
}`}
          </pre>
        </motion.section>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 text-sm text-slate-400 text-center">
          <span className="text-brand-400 font-semibold px-2">Tips:</span> Keep logs timestamped and include service names; include metrics (cpu_percent, memory_percent, latency_ms) for richer signals.
        </motion.footer>
      </div>
    </div>
  )
}
