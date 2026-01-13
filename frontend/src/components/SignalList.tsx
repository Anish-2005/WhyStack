import React from 'react'

type Signal = { signal: string; severity?: string; startTime?: string; service?: string }

export default function SignalList({ signals }: { signals: Signal[] }) {
  if (!signals || signals.length === 0) return <div className="text-sm text-gray-500">No signals detected</div>

  return (
    <ul className="space-y-2">
      {signals.map((s, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.severity === 'high' ? 'bg-red-100 text-red-800' : s.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{s.severity || 'info'}</span>
          <div>
            <div className="text-sm font-semibold">{s.signal}</div>
            <div className="text-xs text-gray-500">{s.service || 'unknown'} • {s.startTime || 'time unknown'}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}
