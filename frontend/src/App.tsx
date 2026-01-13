import { useState } from 'react'
import Header from './components/Header'
import EditorPanel from './components/EditorPanel'
import ExplanationPanel from './components/ExplanationPanel'
import './App.css'
import { explain as explainApi } from './utils/api'

const example = `[
  { "timestamp": "2026-01-13T16:12:00", "service": "api-gateway", "latency_ms": 920, "cpu_percent": 85, "status": 502, "error": "Bad Gateway" }
]`

export default function App() {
  const [value, setValue] = useState(example)
  const [result, setResult] = useState<any | null>(null)

  async function onExplain() {
    try {
      const parsed = JSON.parse(value)
      const data = await explainApi(parsed)
      setResult(data)
    } catch (err: any) {
      setResult({ summary: 'Error', explanation: err.message || String(err), trace: {} })
    } finally {
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Header />

      <div className="grid md:grid-cols-2 gap-6">
        <EditorPanel value={value} onChange={setValue} onExplain={onExplain} onLoadExample={() => setValue(example)} />
        <div>
          <ExplanationPanel result={result} />
        </div>
      </div>
    </div>
  )
}
