import { useState } from 'react'
import Header from './components/Header'
import EditorPanel from './components/EditorPanel'
import ExplanationPanel from './components/ExplanationPanel'
import './App.css'
import { explain as explainApi } from './utils/api'

const example = `[
  { "timestamp": "2026-01-13T16:12:00", "service": "api-gateway", "latency_ms": 920, "cpu_percent": 85, "status": 502, "error": "Bad Gateway" }
]`

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomExample() {
  const services = ['api-gateway', 'auth', 'payments', 'orders', 'inventory']
  const entries = [] as any[]
  const now = Date.now()
  const count = randomInt(1, 3)
  for (let i = 0; i < count; i++) {
    const service = services[randomInt(0, services.length - 1)]
    const latency = randomInt(20, 1200)
    const cpu = randomInt(5, 95)
    const memory = randomInt(20, 92)
    const isError = Math.random() < 0.35
    const status = isError ? (Math.random() < 0.6 ? 502 : 500) : 200
    const error = isError ? (status === 502 ? 'Bad Gateway' : 'Internal Server Error') : undefined
    const ts = new Date(now - randomInt(0, 60 * 60 * 1000)).toISOString()
    const entry: any = { timestamp: ts, service, latency_ms: latency, cpu_percent: cpu, memory_percent: memory, status }
    if (error) entry.error = error
    entries.push(entry)
  }
  return JSON.stringify(entries, null, 2)
}

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
        <EditorPanel value={value} onChange={setValue} onExplain={onExplain} onLoadExample={() => setValue(generateRandomExample())} />
        <div>
          <ExplanationPanel result={result} />
        </div>
      </div>
    </div>
  )
}
