
  import React, { useState } from 'react'

  type ExplainResponse = {
    summary?: string
    explanation?: string
    signals_detected?: string[]
    confidence?: string
    trace?: any
    causes?: any[]
  }

  function badgeColor(sev: string) {
    if (!sev) return 'bg-gray-600'
    const s = sev.toLowerCase()
    if (s === 'high') return 'bg-red-500'
    if (s === 'medium') return 'bg-amber-500'
    return 'bg-gray-500'
  }

  export default function ExplanationPanel({ result }: { result: ExplainResponse | null }) {
    const [showTrace, setShowTrace] = useState(false)

    // Keep simple handling from the top component: show a minimal panel when no result
    if (!result) return <div className="panel p-4"><div className="text-sm text-gray-300">No explanation yet.</div></div>

    if ((result as any).error) return <div className="panel p-4 bg-red-900 rounded">Error: {String((result as any).error)}</div>

    // Compose signals/causes from the trace or top-level fields (be resilient)
    const signals: any[] = (result.trace && result.trace.signals) || (result as any).signals || (result as any).signals_detected || []
    const causes: any[] = (result.trace && result.trace.causes) || (result as any).causes || []

    // If the backend returned simple arrays of signal names in signals_detected, normalize
    const normalizedSignals = signals.map(s => (typeof s === 'string' ? { signal: s, severity: 'low' } : s))

    const tracePayload = { signals: normalizedSignals, causes }

    const copyTrace = async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(tracePayload, null, 2))
      } catch (e) {
        // ignore
      }
    }

    const humanTime = (t: string) => {
      try { return t ? new Date(t).toLocaleString() : '' } catch { return t }
    }

    return (
      <div className="panel">
        <div className="flex items-center justify-between mb-3" style={{gap:8}}>
          <h2 className="text-lg font-medium">Explanation</h2>
          <div className="text-sm text-gray-400">Confidence: <strong>{result.confidence || 'Unknown'}</strong></div>
        </div>

        <div className="mb-3">
          <h3 style={{fontSize:20, fontWeight:800}}>{result.summary}</h3>
          <p className="mt-2 text-gray-300" style={{fontSize:14, lineHeight:1.45}}>{result.explanation}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Detected Signals</h4>
            <div className="space-y-2">
              {normalizedSignals.length === 0 && <div className="text-sm text-gray-500">No signals detected.</div>}
              {normalizedSignals.map((s: any, i: number) => (
                <div key={i} className="panel" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div style={{width:10,height:10,borderRadius:6}} className={badgeColor(s.severity || 'low')} />
                    <div>
                      <div style={{fontWeight:700}}>{s.signal}</div>
                      <div className="text-xs text-gray-400" style={{fontSize:12}}>{(s.service || '') + (s.service ? ' • ' : '')}{humanTime(s.startTime || s.timestamp || s.time || '')}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="text-sm" style={{fontWeight:700}}>{(s.severity||'').toUpperCase()}</div>
                    <div className="text-xs text-gray-400">{Object.keys(s.info||{}).map(k=>`${k}: ${s.info[k]}`).join(' • ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Causes</h4>
            <div className="space-y-3">
              {causes.length === 0 && <div className="text-sm text-gray-500">No ranked causes available.</div>}
              {causes.map((c: any, i: number) => {
                const pct = Math.round((c.confidence || 0) * 100)
                return (
                  <div key={i} className="panel">
                    <div className="flex items-center justify-between">
                      <div>
                        <div style={{fontWeight:800}}>{c.cause || c}</div>
                        <div className="text-xs text-gray-400">score: {c.score?.toFixed ? c.score.toFixed(2) : (c.score || '—')}</div>
                      </div>
                      <div style={{width:90,textAlign:'right'}}><strong>{pct}%</strong></div>
                    </div>
                    <div className="mt-2" style={{height:8,background:'rgba(255,255,255,0.04)',borderRadius:6,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#6366f1,#4f46e5)'}} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2" style={{gap:8}}>
            <h4 className="text-sm font-medium">Trace</h4>
            <div style={{display:'flex', gap:8}}>
              <button className="btn btn-outline" onClick={() => { setShowTrace(s => !s) }} aria-expanded={showTrace}>{showTrace ? 'Hide' : 'Show'} JSON</button>
              <button className="btn" onClick={copyTrace}>Copy</button>
            </div>
          </div>

          { showTrace ? (
            <pre className="text-xs bg-gray-900 text-gray-100 p-2 rounded max-h-64 overflow-auto">{JSON.stringify(tracePayload, null, 2)}</pre>
          ) : (
            <div className="text-sm text-gray-500">{normalizedSignals.length > 0 ? 'Signals and causes available. Expand to view raw trace.' : 'Trace is empty — the engine returned no signals or causes for this dataset.'}</div>
          )}
        </div>
      </div>
    )
  }
