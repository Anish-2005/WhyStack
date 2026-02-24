import React, { useState } from 'react'
import { FileSearch, Activity, BrainCircuit, Code2, Copy, AlertTriangle, Info, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

type ExplainResponse = {
  summary?: string
  explanation?: string
  signals_detected?: string[]
  confidence?: string
  trace?: any
  causes?: any[]
}

function getSeverityDetails(sev: string) {
  const s = (sev || '').toLowerCase()
  if (s === 'high' || s === 'critical') return { color: 'bg-rose-500/20 border-rose-500/30', icon: ShieldAlert, text: 'text-rose-400' }
  if (s === 'medium') return { color: 'bg-amber-400/20 border-amber-400/30', icon: AlertTriangle, text: 'text-amber-400' }
  return { color: 'bg-blue-400/20 border-blue-400/30', icon: Info, text: 'text-blue-400' }
}

export default function ExplanationPanel({ result }: { result: ExplainResponse | null }) {
  const [showTrace, setShowTrace] = useState(false)
  const { theme } = useTheme()

  if (!result) {
    return (
      <div className="liquid-glass h-full w-full flex flex-col items-center justify-center p-8 text-center" style={{ animationDelay: '0.2s' }}>
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl"
          />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 flex items-center justify-center border border-white/10 shadow-lg">
            <BrainCircuit className="w-8 h-8 text-brand-400/80" />
          </div>
        </div>
        <h3 className={`text-2xl font-bold mb-2 tracking-wide font-sans text-liquid-glow ${theme === 'light' ? '!text-black' : 'text-white'}`}>Awaiting Telemetry</h3>
        <p className="text-[15px] text-slate-400 max-w-[300px] leading-relaxed">Run the analysis to synthesize root cause attributions and signals.</p>
      </div>
    )
  }

  if ((result as any).error) {
    return (
      <div className="liquid-glass border-rose-500/30 bg-rose-500/5 p-6 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 shadow-inner">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-rose-400 tracking-wide font-sans">Analysis Failed</h3>
        </div>
        <div className="flex-1 text-sm text-rose-200/80 font-mono bg-[#010103]/60 p-5 rounded-2xl overflow-auto border border-rose-500/10 shadow-inner">
          {String((result as any).error)}
        </div>
      </div>
    )
  }

  const signals: any[] = (result.trace && result.trace.signals) || (result as any).signals || (result as any).signals_detected || []
  const causes: any[] = (result.trace && result.trace.causes) || (result as any).causes || []
  const normalizedSignals = signals.map(s => (typeof s === 'string' ? { signal: s, severity: 'low' } : s))
  const tracePayload = { signals: normalizedSignals, causes }

  const copyTrace = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(tracePayload, null, 2))
    } catch {
      // ignore
    }
  }

  const humanTime = (t: string) => {
    try { return t ? new Date(t).toLocaleString() : '' } catch { return t }
  }

  return (
    <div className="liquid-glass flex flex-col h-full overflow-hidden w-full">
      <div className="p-5 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/10 rounded-xl border border-white/5 shadow-inner">
            <BrainCircuit className="h-5 w-5 text-brand-400" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide font-sans">Analysis Result</h2>
        </div>
        {result.confidence && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#010103]/60 border border-white/5 shadow-inner">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${result.confidence.toLowerCase() === 'high' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'}`}
            />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Confidence: <span className="text-white ml-1">{result.confidence}</span></span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6 lg:p-8 scrollbar-thin">
        {result.summary && (
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-10">
            <h3 className="text-3xl font-bold text-white mb-4 text-liquid-glow leading-tight tracking-tight font-sans">{result.summary}</h3>
            <p className="text-[16px] leading-relaxed text-slate-300 font-medium">{result.explanation}</p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Causes Column */}
          <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-white/5"><FileSearch className="w-4 h-4 text-brand-300" /></div>
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Attributions</h4>
            </div>

            {causes.length === 0 ? (
              <div className="text-[13px] text-slate-500 italic p-6 text-center border border-white/5 border-dashed rounded-2xl bg-[#010103]/30">No ranked causes identified.</div>
            ) : (
              causes.map((c: any, i: number) => {
                const pct = Math.round((c.confidence || 0) * 100)
                return (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * (i + 1) }}
                    key={i}
                    className="liquid-glass-interactive p-5 bg-white/[0.01]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="pr-4">
                        <div className="font-semibold text-slate-100 text-[15px] leading-snug mb-1">{c.cause || c}</div>
                        {c.score !== undefined && <div className="text-[11px] text-slate-400 font-mono tracking-wider opacity-60">score: {c.score.toFixed(2)}</div>}
                      </div>
                      <div className="text-brand-300 font-black text-xl bg-surface/60 px-2 py-1 rounded-lg border border-white/5 shadow-inner">{pct}%</div>
                    </div>
                    <div className="h-2 w-full bg-[#010103]/80 rounded-full overflow-hidden border border-white/5 p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-brand-600 via-purple-500 to-brand-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      />
                    </div>
                  </motion.div>
                )
              })
            )}
          </motion.div>

          {/* Signals Column */}
          <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-white/5"><Activity className="w-4 h-4 text-brand-300" /></div>
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Signals Extracted</h4>
            </div>

            {normalizedSignals.length === 0 ? (
              <div className="text-[13px] text-slate-500 italic p-6 text-center border border-white/5 border-dashed rounded-2xl bg-[#010103]/30">No signals detected.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {normalizedSignals.map((s: any, i: number) => {
                  const severity = getSeverityDetails(s.severity)
                  const Icon = severity.icon
                  return (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * (i + 1) }}
                      key={i}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex gap-4 backdrop-blur-md shadow-inner hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="mt-0.5 p-1.5 rounded-xl bg-[#010103]/60 shadow-inner border border-white/5"><Icon className={`w-4 h-4 ${severity.text}`} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="font-semibold text-slate-200 text-sm truncate">{s.signal}</div>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg border ${severity.color} text-white/90 tracking-wider shadow-inner`}>
                            {s.severity || 'low'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mb-2 font-medium tracking-wide">
                          {(s.service || '')}{(s.service && (s.startTime || s.timestamp || s.time)) ? ' • ' : ''}{humanTime(s.startTime || s.timestamp || s.time || '')}
                        </div>
                        {s.info && Object.keys(s.info).length > 0 && (
                          <div className="text-[11px] text-slate-400/80 font-mono truncate bg-surface/40 p-1.5 rounded border border-white/5">
                            {Object.entries(s.info).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Trace Section */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mt-auto pt-8 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/5"><Code2 className="w-4 h-4 text-slate-400" /></div>
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Raw Engine Trace</h4>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline py-1.5 px-4 text-xs font-semibold" onClick={() => setShowTrace(!showTrace)}>
                {showTrace ? 'Hide' : 'View'} Payload
              </button>
              <button className="btn btn-ghost py-1.5 px-3 text-xs bg-[#010103]/40 hover:bg-white/10" onClick={copyTrace} title="Copy Trace">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showTrace ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="rounded-2xl overflow-hidden border border-white/[0.05] shadow-inner bg-[#010103]/80"
              >
                <pre className="text-[13px] text-slate-300 p-6 max-h-[300px] overflow-auto scrollbar-thin font-mono leading-relaxed selection:bg-brand-500/30">
                  {JSON.stringify(tracePayload, null, 2)}
                </pre>
              </motion.div>
            ) : (
              <div className="text-[13px] text-slate-500 font-medium">
                {normalizedSignals.length > 0 ? 'Engine generated signals and attributions. View payload to see raw data.' : 'No trace output for this dataset.'}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
