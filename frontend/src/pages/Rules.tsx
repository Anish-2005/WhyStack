import React from 'react'
import Header from '../components/Header'

const rules = [
  { conditions: ['latency_spike', 'cpu_saturation'], cause: 'High CPU load', confidence: 0.8 },
  { conditions: ['latency_spike', 'memory_pressure'], cause: 'Memory pressure causing GC pauses', confidence: 0.7 },
  { conditions: ['error_event', 'dependency_failure'], cause: 'Downstream dependency failure', confidence: 0.9 },
  { conditions: ['error_event'], cause: 'Application errors (5xx)', confidence: 0.6 }
]

export default function Rules(){
  return (
    <div className="max-w-6xl mx-auto pb-8">
      <Header />
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Rule Set</h1>
        <p className="text-gray-300 mt-2">The engine uses human-readable rules to map observed signals into ranked causes. Rules are intentionally concise and auditable.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        {rules.map((r, i) => (
          <article key={i} className="p-5 bg-slate-900 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{r.cause}</h3>
            <p className="text-gray-400 mt-2">Confidence: <strong>{Math.round(r.confidence * 100)}%</strong></p>
            <div className="mt-3">
              <h4 className="text-sm text-gray-300 font-medium">Conditions</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {r.conditions.map((c) => (
                  <span key={c} className="px-2 py-1 bg-slate-700 rounded text-sm">{c}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <footer className="mt-8 text-sm text-gray-400">
        Want to customize rules? Edit the backend `ruleEngine` module and keep rules small and testable.
      </footer>
    </div>
  )
}
