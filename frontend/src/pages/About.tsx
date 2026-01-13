import React from 'react'
import Header from '../components/Header'

export default function About(){
  return (
    <div className="max-w-6xl mx-auto pb-8">
      <Header />
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-lg text-white shadow-md">
        <h1 className="text-3xl font-bold">About WhyStack</h1>
        <p className="mt-2 text-gray-200">WhyStack provides deterministic, explainable root-cause analysis for observability teams. It runs locally or as a service and produces concise, auditable explanations from JSON logs.</p>
      </div>

      <section className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="p-5 bg-slate-900 rounded-lg">
          <h2 className="text-xl font-semibold">Goals</h2>
          <ul className="mt-2 text-gray-300 list-disc ml-5">
            <li>Deterministic rules-based RCA</li>
            <li>Human-readable explanations</li>
            <li>Small, auditable rule set</li>
          </ul>
        </div>

        <div className="p-5 bg-slate-900 rounded-lg">
          <h2 className="text-xl font-semibold">Use Cases</h2>
          <p className="text-gray-300 mt-2">Incident triage, post-incident analysis, or as a lightweight assistant for SREs and developers to understand log patterns quickly.</p>
        </div>
      </section>

      <footer className="mt-6 text-sm text-gray-400">
        Built with transparency and reproducibility in mind.
      </footer>
    </div>
  )
}
