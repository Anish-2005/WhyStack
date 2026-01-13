type Signal = { signal: string; severity?: string; startTime?: string; service?: string }

export default function SignalList({ signals }: { signals: Signal[] }) {
  if (!signals || signals.length === 0) return <div className="text-sm muted">No signals detected</div>

  return (
    <ul style={{display:'grid', gap:8}}>
      {signals.map((s, i) => (
        <li key={i} style={{display:'flex', gap:10, alignItems:'flex-start'}}>
          <span style={{minWidth:64, display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'2px 8px', borderRadius:6, fontSize:12, fontWeight:600, color:'#071025', background: s.severity === 'high' ? '#fecaca' : s.severity === 'medium' ? '#fde68a' : '#d1fae5'}}>{(s.severity || 'info').toUpperCase()}</span>
          <div>
            <div style={{fontSize:14, fontWeight:600}}>{s.signal}</div>
            <div className="muted" style={{fontSize:12}}>{s.service || 'unknown'} • {s.startTime || 'time unknown'}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}
