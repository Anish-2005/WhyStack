export interface TelemetryEvent {
  timestamp?: string
  time?: string
  service?: string
  message?: string
  error?: string
  level?: string
  status?: number
  latency_ms?: number
  cpu_percent?: number
  memory_percent?: number
  trace_id?: string
  [key: string]: unknown
}

export interface Signal {
  signal: string
  severity: 'high' | 'medium' | 'low'
  startTime: string | null
  service: string
  info?: Record<string, unknown>
}

export interface Cause {
  ruleId: string
  cause: string
  confidence: number
  score: number
  confidenceLabel: 'High' | 'Medium' | 'Low'
  conditions: string[]
  service: string
  evidence: Signal[]
}

export interface ExplainResponse {
  summary: string
  explanation: string
  signals_detected: string[]
  confidence: 'High' | 'Medium' | 'Low'
  trace: {
    signals: Signal[]
    causes: Cause[]
  }
}

export interface ValidationDetail {
  instancePath?: string
  message?: string
}

export interface ApiError {
  error: string
  message?: string
  details?: ValidationDetail[]
}

export interface RuleSummary {
  id: string
  conditions: string[]
  cause: string
  confidence: number
}
