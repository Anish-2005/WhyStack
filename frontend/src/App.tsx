import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  async function onExplain() {
    setIsAnalyzing(true)
    try {
      const parsed = JSON.parse(value)
      const data = await explainApi(parsed)
      setResult(data)
    } catch (err: any) {
      setResult({ summary: 'Error', explanation: err.message || String(err), trace: {} })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto w-full min-h-screen flex flex-col pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-8">
      {/* Liquid background orb animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-600/10 blur-[120px]"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full flex-1">
        <Header />

        <main className="flex-1 grid lg:grid-cols-2 gap-6 lg:gap-8 min-h-[700px]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full relative"
          >
            <EditorPanel
              value={value}
              onChange={setValue}
              onExplain={onExplain}
              onLoadExample={() => setValue(generateRandomExample())}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full relative"
          >
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="liquid-glass h-full flex flex-col items-center justify-center p-8 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 border-brand-500/20 border-t-brand-400"
                  >
                    <div className="w-12 h-12 rounded-full border border-purple-500/30 border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-2 tracking-wide text-liquid-glow">Analyzing Telemetry...</h3>
                  <p className="text-slate-400">Synthesizing log patterns and traces</p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full flex flex-col"
                >
                  <ExplanationPanel result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </main>
      </div>
    </div>
  )
}


