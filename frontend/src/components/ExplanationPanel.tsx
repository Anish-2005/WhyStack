import SignalList from './SignalList'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type ExplainResponse = {
  summary?: string
  explanation?: string
  signals_detected?: string[]
  confidence?: string
  trace?: any
  causes?: any[]
}

export default function ExplanationPanel({ result }: { result: ExplainResponse | null }) {
  if (!result) return <div className="panel"><div className="text-sm muted">No explanation yet.</div></div>

  // Support multiple possible shapes from backend or error states
  const signals = result.trace?.signals || result.signals_detected || []
  const causes = result.trace?.causes || result.causes || []
  const chartData = { labels: signals.map((s: any) => s.signal), datasets: [{ label: 'Signals', data: signals.map(() => 1), backgroundColor: 'rgba(99,102,241,0.9)' }] }
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e6eef8' } }
    },
    scales: {
      x: { ticks: { color: '#e6eef8' }, grid: { color: 'rgba(255,255,255,0.03)' } },
      y: { ticks: { color: '#e6eef8' }, grid: { color: 'rgba(255,255,255,0.03)' } }
    }
  }

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Explanation</h2>
        <div className="text-sm text-gray-600">Confidence: <strong>{result.confidence || 'Unknown'}</strong></div>
      </div>

      <div className="mb-3">
        <h3 style={{fontSize:18, fontWeight:700}}>{result.summary}</h3>
        <p className="mt-2 muted" style={{fontSize:14}}>{result.explanation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Detected Signals</h4>
          <SignalList signals={signals} />
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Signal Overview</h4>
            <div style={{ height: 160 }}>
              <Bar data={chartData} options={chartOptions as any} />
            </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Causes</h4>
        {causes && causes.length > 0 ? (
          <ul className="text-sm space-y-2 mb-3">
            {causes.map((c: any, i: number) => (
              <li key={i} className="text-sm">
                <strong>{c.cause || c}</strong>
                {c.confidence ? <span className="ml-2 text-xs text-gray-400">({Math.round((c.confidence||0)*100)}%)</span> : null}
                {c.score ? <span className="ml-2 text-xs text-gray-400">score: {c.score.toFixed(2)}</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500 mb-3">No ranked causes available.</div>
        )}

        <h4 className="text-sm font-medium mb-2">Trace</h4>
        { (signals && signals.length > 0) || (causes && causes.length > 0) ? (
          <pre className="text-xs bg-gray-900 text-gray-100 p-2 rounded max-h-48 overflow-auto">{JSON.stringify({ signals, causes }, null, 2)}</pre>
        ) : (
          <div className="text-sm text-gray-500">Trace is empty — the engine returned no signals or causes for this dataset.</div>
        )}
      </div>
    </div>
  )
}
