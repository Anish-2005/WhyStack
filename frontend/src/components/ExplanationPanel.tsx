import React, { useState } from 'react'
import { FileSearch, Activity, BrainCircuit, Code2, Copy, AlertTriangle, Info, ShieldAlert } from 'lucide-react'

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
  if (s === 'high' || s === 'critical') return { color: 'bg-rose-500', icon: ShieldAlert, text: 'text-rose-400' }
  if (s === 'medium') return { color: 'bg-amber-400', icon: AlertTriangle, text: 'text-amber-400' }
  return { color: 'bg-blue-400', icon: Info, text: 'text-blue-400' }
}

export default function ExplanationPanel({ result }: { result: ExplainResponse | null }) {
  const [showTrace, setShowTrace] = useState(false)

  if (!result) {
    return (
      <div className="glass-panel h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mb-4 border border-brand-500/20">
          <BrainCircuit className="w-8 h-8 text-brand-400 opacity-80" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2 tracking-wide">Awaiting Telemetry</h3>
        <p className="text-sm text-slate-400 max-w-[280px]">Run the analysis to get explanations, signals, and root cause attribution.</p>
      </div>
    )
  }

  if ((result as any).error) {
    return (
      <div className="glass-panel border-rose-500/30 bg-rose-500/5 p-6 h-full flex flex-col animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-rose-400">Analysis Failed</h3>
        </div>
        <div className="text-sm text-slate-300 font-mono bg-black/40 p-4 rounded-lg overflow-auto border border-rose-500/20 text-rose-200">
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
    <div className="glass-panel flex flex-col h-full overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-brand-400" />
          <h2 className="text-lg font-semibold text-white tracking-wide">Analysis Result</h2>
        </div>
        {result.confidence && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5">
            <div className={`w-2 h-2 rounded-full ${result.confidence.toLowerCase() === 'high' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-xs font-medium text-slate-300">Confidence: <span className="text-white">{result.confidence}</span></span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-5 scrollbar-thin">
        {result.summary && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-3 text-glow leading-tight">{result.summary}</h3>
            <p className="text-[15px] leading-relaxed text-slate-300">{result.explanation}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Causes Column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <FileSearch className="w-4 h-4 text-brand-400" />
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Root Causes</h4>
            </div>

            {causes.length === 0 ? (
              <div className="text-sm text-slate-500 italic py-2">No ranked causes identified.</div>
            ) : (
              causes.map((c: any, i: number) => {
                const pct = Math.round((c.confidence || 0) * 100)
                return (
                  <div key={i} className="glass-panel-interactive p-4 bg-white/[0.01]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="pr-4">
                        <div className="font-semibold text-white leading-tight mb-1">{c.cause || c}</div>
                        {c.score !== undefined && <div className="text-xs text-slate-400 font-mono">score: {c.score.toFixed(2)}</div>}
                      </div>
                      <div className="text-brand-300 font-bold text-lg">{pct}%</div>
                    </div>
                    <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Signals Column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-brand-400" />
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Signals</h4>
            </div>

            {normalizedSignals.length === 0 ? (
              <div className="text-sm text-slate-500 italic py-2">No signals detected.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {normalizedSignals.map((s: any, i: number) => {
                  const severity = getSeverityDetails(s.severity)
                  const Icon = severity.icon
                  return (
                    <div key={i} className="p-3 rounded-lg bg-black/30 border border-white/5 flex gap-3">
                      <div className="mt-0.5"><Icon className={`w-4 h-4 ${severity.text}`} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="font-semibold text-white text-sm truncate">{s.signal}</div>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${severity.color} text-white/90`}>
                            {s.severity || 'low'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mb-1">
                          {(s.service || '')}{(s.service && (s.startTime || s.timestamp || s.time)) ? ' • ' : ''}{humanTime(s.startTime || s.timestamp || s.time || '')}
                        </div>
                        {s.info && Object.keys(s.info).length > 0 && (
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            {Object.entries(s.info).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Trace Section */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-400" />
              <h4 className="text-sm font-semibold text-slate-400 tracking-wide">Raw Trace</h4>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline py-1 px-3 text-xs" onClick={() => setShowTrace(!showTrace)}>
                {showTrace ? 'Hide' : 'Show'} JSON
              </button>
              <button className="btn btn-ghost py-1 px-2 text-xs" onClick={copyTrace} title="Copy Trace">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showTrace ? (
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <pre className="text-xs bg-[#05050A] text-slate-300 p-4 max-h-[250px] overflow-auto scrollbar-thin font-mono leading-relaxed">
                {JSON.stringify(tracePayload, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              {normalizedSignals.length > 0 ? 'Engine generated signals and causes. Expand to view the JSON payload.' : 'No trace output for this dataset.'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
