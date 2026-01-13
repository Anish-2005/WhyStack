import React from 'react'
import Header from '../components/Header'

export default function Docs(){
  return (
    <div className="max-w-6xl mx-auto pb-8">
      <Header />
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">WhyStack: Documentation</h1>
        <p className="text-gray-300 mt-2">Deterministic, explainable RCA for JSON logs. Learn how the engine works, payload shape, and integration tips.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">How it Works</h2>
          <p className="text-gray-300">WhyStack normalizes event timelines by service, extracts heuristic signals (latency, errors, CPU/memory pressure), then matches combinations of signals against a rule set to produce ranked causes and human-readable explanations.</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Integration</h2>
          <p className="text-gray-300">POST a JSON payload to <code className="bg-slate-700 px-1 rounded">/explain</code> with a top-level <code>logs</code> array. See the example payload and response below.</p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Example Request</h3>
        <pre className="bg-slate-900 p-4 rounded text-sm overflow-auto">
{`{
  "logs": [
    { "timestamp": "2026-01-13T16:12:00Z", "service": "api-gateway", "latency_ms": 920, "cpu_percent": 85, "status": 502, "error": "Bad Gateway" }
  ]
}`}
        </pre>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Example Response</h3>
        <pre className="bg-slate-900 p-4 rounded text-sm overflow-auto">
{`{
  "summary": "Downstream dependency failure",
  "explanation": "The api-gateway likely misbehaved because Downstream dependency failure. This started around 2026-01-13T16:12:00Z when signals such as error_event, dependency_failure were observed.",
  "signals_detected": ["error_event","dependency_failure"],
  "confidence": "High"
}`}
        </pre>
      </section>

      <footer className="mt-8 text-sm text-gray-400">
        <strong>Tips:</strong> Keep logs timestamped and include service names; include metrics (cpu_percent, memory_percent, latency_ms) for richer signals.
      </footer>
    </div>
  )
}
