import React from 'react'
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
}

export default function ExplanationPanel({ result }: { result: ExplainResponse | null }) {
  if (!result) return <div className="panel"><div className="text-sm text-gray-500">No explanation yet.</div></div>

  const signals = result.trace?.signals || []
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
        <h3 className="text-base font-semibold">{result.summary}</h3>
        <p className="mt-2 text-sm text-gray-700">{result.explanation}</p>
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
        <h4 className="text-sm font-medium mb-2">Trace</h4>
        <pre className="text-xs bg-gray-50 p-2 rounded max-h-48 overflow-auto">{JSON.stringify(result.trace || {}, null, 2)}</pre>
      </div>
    </div>
  )
}
