import { useState } from 'react'
import { Activity, AlertTriangle, BrainCircuit, Code2, Copy, FileSearch, Info, ShieldAlert } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../context/useTheme'
import type { ApiError, ExplainResponse, Signal } from '../types/api'

function getSeverityDetails(severity: Signal['severity']) {
  if (severity === 'high') return { color: 'bg-rose-500/20 border-rose-500/30', icon: ShieldAlert, text: 'text-rose-400' }
  if (severity === 'medium') return { color: 'bg-amber-400/20 border-amber-400/30', icon: AlertTriangle, text: 'text-amber-400' }
  return { color: 'bg-blue-400/20 border-blue-400/30', icon: Info, text: 'text-blue-400' }
}

export default function ExplanationPanel({ result, error }: { result: ExplainResponse | null; error: ApiError | null }) {
  const [showTrace, setShowTrace] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const { theme } = useTheme()

  if (error) {
    return (
      <div className="liquid-glass border-rose-500/30 bg-rose-500/5 p-6 h-full flex flex-col" role="alert" aria-live="assertive">
        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 shadow-inner">
          <AlertTriangle className="w-6 h-6 text-rose-400" aria-hidden="true" />
          <h2 id="result-heading" className="text-xl font-bold text-rose-400 tracking-wide font-sans">Analysis failed</h2>
        </div>
        <p className="text-sm text-rose-100/90">{error.message || error.error}</p>
        {error.details && error.details.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-rose-200/80">
            {error.details.map((detail, index) => (
              <li key={`${detail.instancePath || 'request'}-${index}`}>
                {[detail.instancePath, detail.message].filter(Boolean).join(': ')}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (!result) {
    return (
      <div className="liquid-glass h-full w-full flex flex-col items-center justify-center p-8 text-center">
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center" aria-hidden="true">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl"
          />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 flex items-center justify-center border border-white/10 shadow-lg">
            <BrainCircuit className="w-8 h-8 text-brand-400/80" />
          </div>
        </div>
        <h2 id="result-heading" className={`text-2xl font-bold mb-2 tracking-wide font-sans text-liquid-glow ${theme === 'light' ? '!text-black' : 'text-white'}`}>Awaiting telemetry</h2>
        <p className="text-[15px] text-slate-400 max-w-[300px] leading-relaxed">Analyze the input to see matched rules and supporting signals.</p>
      </div>
    )
  }

  const signals = result.trace.signals
  const causes = result.trace.causes
  const tracePayload = { signals, causes }

  async function copyTrace() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(tracePayload, null, 2))
      setCopyMessage('Trace copied.')
    } catch {
      setCopyMessage('Copy is unavailable in this browser.')
    }
  }

  function humanTime(time: string | null) {
    if (!time) return ''
    const parsedTime = Date.parse(time)
    return Number.isFinite(parsedTime) ? new Date(parsedTime).toLocaleString() : 'Unknown time'
  }

  return (
    <div className="liquid-glass flex flex-col h-full overflow-hidden w-full">
      <div className="p-5 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/10 rounded-xl border border-white/5 shadow-inner" aria-hidden="true">
            <BrainCircuit className="h-5 w-5 text-brand-400" />
          </div>
          <h2 id="result-heading" className="text-xl font-bold text-white tracking-wide font-sans">Analysis result</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#010103]/60 border border-white/5 shadow-inner">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Heuristic match: <span className="text-white ml-1">{result.confidence}</span></span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 lg:p-8 scrollbar-thin">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-10">
          <h3 className="text-3xl font-bold text-white mb-4 text-liquid-glow leading-tight tracking-tight font-sans">{result.summary}</h3>
          <p className="text-[16px] leading-relaxed text-slate-300 font-medium">{result.explanation}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.section initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4" aria-labelledby="causes-heading">
            <div className="flex items-center gap-2 mb-2">
              <FileSearch className="w-4 h-4 text-brand-300" aria-hidden="true" />
              <h3 id="causes-heading" className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Matched rules</h3>
            </div>

            {causes.length === 0 ? (
              <div className="text-[13px] text-slate-500 italic p-6 text-center border border-white/5 border-dashed rounded-2xl bg-[#010103]/30">No ranked causes identified.</div>
            ) : causes.map((cause, index) => {
              const scorePercent = Math.round(cause.score * 100)
              return (
                <motion.article
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  key={`${cause.ruleId}-${cause.service}-${index}`}
                  className="liquid-glass-interactive p-5 bg-white/[0.01]"
                >
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="pr-2 min-w-0">
                      <div className="font-semibold text-slate-100 text-[15px] leading-snug mb-1">{cause.cause}</div>
                      <div className="text-[11px] text-slate-400 font-mono tracking-wider break-all">{cause.ruleId} · {cause.service}</div>
                    </div>
                    <div className="text-brand-300 font-black text-xl bg-surface/60 px-2 py-1 rounded-lg border border-white/5 shadow-inner" aria-label={`Heuristic match score ${scorePercent} percent`}>
                      {scorePercent}%
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[#010103]/80 rounded-full overflow-hidden border border-white/5 p-[1px]" aria-hidden="true">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercent}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-brand-600 via-purple-500 to-brand-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-400">Rule weight: {cause.confidence.toFixed(2)} · Evidence: {cause.evidence.length} signals</p>
                </motion.article>
              )
            })}
          </motion.section>

          <motion.section initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4" aria-labelledby="signals-heading">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-brand-300" aria-hidden="true" />
              <h3 id="signals-heading" className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Signals extracted</h3>
            </div>

            {signals.length === 0 ? (
              <div className="text-[13px] text-slate-500 italic p-6 text-center border border-white/5 border-dashed rounded-2xl bg-[#010103]/30">No signals detected.</div>
            ) : signals.map((signal, index) => {
              const severity = getSeverityDetails(signal.severity)
              const Icon = severity.icon
              return (
                <motion.article
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: Math.min(0.1 * (index + 1), 0.5) }}
                  key={`${signal.signal}-${signal.service}-${signal.startTime || index}`}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex gap-4 backdrop-blur-md shadow-inner"
                >
                  <div className="mt-0.5 p-1.5 rounded-xl bg-[#010103]/60 shadow-inner border border-white/5" aria-hidden="true">
                    <Icon className={`w-4 h-4 ${severity.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="font-semibold text-slate-200 text-sm truncate">{signal.signal}</div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg border ${severity.color} text-white/90 tracking-wider shadow-inner`}>
                        {signal.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-2 font-medium tracking-wide">
                      {signal.service}{signal.startTime ? ` · ${humanTime(signal.startTime)}` : ''}
                    </div>
                    {signal.info && Object.keys(signal.info).length > 0 && (
                      <div className="text-[11px] text-slate-400/80 font-mono truncate bg-surface/40 p-1.5 rounded border border-white/5">
                        {Object.entries(signal.info).map(([key, value]) => `${key}: ${String(value)}`).join(', ')}
                      </div>
                    )}
                  </div>
                </motion.article>
              )
            })}
          </motion.section>
        </div>

        <motion.section initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mt-auto pt-8 border-t border-white/5" aria-labelledby="trace-heading">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <h3 id="trace-heading" className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Engine trace</h3>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline py-1.5 px-4 text-xs font-semibold" onClick={() => setShowTrace((isVisible) => !isVisible)} aria-expanded={showTrace} aria-controls="trace-payload">
                {showTrace ? 'Hide' : 'View'} payload
              </button>
              <button className="btn btn-ghost py-1.5 px-3 text-xs bg-[#010103]/40 hover:bg-white/10" onClick={copyTrace} aria-label="Copy analysis trace">
                <Copy className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">{copyMessage}</p>

          <AnimatePresence>
            {showTrace ? (
              <motion.div
                id="trace-payload"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="rounded-2xl overflow-hidden border border-white/[0.05] shadow-inner bg-[#010103]/80"
              >
                <pre className="text-[13px] text-slate-300 p-6 max-h-[300px] overflow-auto scrollbar-thin font-mono leading-relaxed selection:bg-brand-500/30">
                  {JSON.stringify(tracePayload, null, 2)}
                </pre>
              </motion.div>
            ) : (
              <p className="text-[13px] text-slate-500 font-medium">
                {signals.length > 0 ? 'View the payload to inspect matched rules and supporting evidence.' : 'No trace output for this dataset.'}
              </p>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  )
}
