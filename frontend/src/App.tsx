import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import './App.css'

ChartJS.register(BarElement, CategoryScale, LinearScale)

type ExplainResponse = {
  summary: string
  explanation: string
  signals_detected: string[]
  confidence: string
}

const example = `[
  { "timestamp": "2026-01-13T16:12:00", "service": "api-gateway", "latency_ms": 920, "cpu_percent": 85, "status": 502, "error": "Bad Gateway" }
]`

export default function App() {
  const [value, setValue] = useState(example)
  const [result, setResult] = useState<ExplainResponse | null>(null)
  const [loading, setLoading] = useState(false)

  async function explain() {
    setLoading(true)
    try {
      const res = await fetch('/explain', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ logs: JSON.parse(value) }) })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ summary: 'Error', explanation: String(e), signals_detected: [], confidence: 'Low' })
    } finally {
      setLoading(false)
    }
  }

  const chartData = {
    labels: result ? result.signals_detected : [],
    datasets: [
      { label: 'Signals', data: result ? result.signals_detected.map(() => 1) : [], backgroundColor: 'rgba(99,102,241,0.7)' }
    ]
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">whystack — Explain My System Like I'm 5</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="panel">
          <h2 className="font-medium mb-2">Input (JSON logs)</h2>
          <div className="editor-container mb-2">
            <Editor height="100%" defaultLanguage="json" value={value} onChange={(v) => setValue(v || '')} />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={explain} disabled={loading}>Explain</button>
            <button className="px-4 py-2 border rounded" onClick={() => setValue(example)}>Load example</button>
          </div>
        </div>

        <div className="panel">
          <h2 className="font-medium mb-2">Explanation</h2>
          {loading && <div>Thinking...</div>}
          {!loading && result && (
            <div>
              <h3 className="text-lg font-semibold">{result.summary}</h3>
              <p className="mt-2">{result.explanation}</p>
              <p className="mt-2 text-sm text-gray-600">Confidence: {result.confidence}</p>

              <div className="mt-4">
                <Bar data={chartData} />
              </div>
            </div>
          )}

          {!loading && !result && <div>No explanation yet.</div>}
        </div>
      </div>
    </div>
  )
}
