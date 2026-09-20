import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import EditorPanel from './components/EditorPanel'
import ExplanationPanel from './components/ExplanationPanel'
import { explain as explainApi, ApiRequestError } from './utils/api'
import { parseTelemetryInput } from './utils/input'
import type { ApiError, ExplainResponse, TelemetryEvent } from './types/api'

const example = `[
  { "timestamp": "2026-10-17T16:12:00Z", "service": "api-gateway", "latency_ms": 920, "cpu_percent": 85, "status": 502, "error": "Bad Gateway" }
]`

const services = ['api-gateway', 'auth', 'payments', 'orders', 'inventory']

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomExample() {
  const now = Date.now()
  const entries: TelemetryEvent[] = Array.from({ length: randomInt(1, 3) }, () => {
    const service = services[randomInt(0, services.length - 1)]
    const latency = randomInt(20, 1200)
    const cpu = randomInt(5, 95)
    const memory = randomInt(20, 92)
    const isError = Math.random() < 0.35
    const status = isError ? (Math.random() < 0.6 ? 502 : 500) : 200
    const error = isError ? (status === 502 ? 'Bad Gateway' : 'Internal Server Error') : undefined
    const timestamp = new Date(now - randomInt(0, 60 * 60 * 1000)).toISOString()

    return {
      timestamp,
      service,
      latency_ms: latency,
      cpu_percent: cpu,
      memory_percent: memory,
      status,
      ...(error ? { error } : {}),
    }
  })

  return JSON.stringify(entries, null, 2)
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}

export default function App() {
  const [value, setValue] = useState(example)
  const [result, setResult] = useState<ExplainResponse | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  async function onExplain() {
    if (isAnalyzing) return

    setIsAnalyzing(true)
    setResult(null)
    setError(null)
    try {
      const logs = parseTelemetryInput(value)
      setResult(await explainApi(logs))
    } catch (caught: unknown) {
      const message = getErrorMessage(caught)
      setError(caught instanceof ApiRequestError
        ? { error: 'analysis failed', message, details: caught.details }
        : { error: 'invalid input', message })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto w-full min-h-screen flex flex-col pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <motion.div
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-600/10 blur-[120px]"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full flex-1">
        <Header />

        <main className="flex-1 grid lg:grid-cols-2 gap-6 lg:gap-8 min-h-[700px]" aria-busy={isAnalyzing}>
          <h1 className="sr-only">WhyStack deterministic incident analysis</h1>
          <motion.section
            aria-labelledby="input-heading"
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
              isAnalyzing={isAnalyzing}
            />
          </motion.section>

          <motion.section
            aria-labelledby="result-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full relative"
          >
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="liquid-glass h-full flex flex-col items-center justify-center p-8 text-center"
                >
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 border-brand-500/20 border-t-brand-400"
                  >
                    <div className="w-12 h-12 rounded-full border border-purple-500/30 border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
                  </motion.div>
                  <h2 id="result-heading" className="text-2xl font-semibold text-white mb-2 tracking-wide text-liquid-glow">Analyzing telemetry</h2>
                  <p className="text-slate-400">Checking signals and matching deterministic rules.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full flex flex-col"
                >
                  <ExplanationPanel result={result} error={error} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </main>
      </div>
    </div>
  )
}
