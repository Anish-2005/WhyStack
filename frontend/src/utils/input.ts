import type { TelemetryEvent } from '../types/api'

function isTelemetryEvent(value: unknown): value is TelemetryEvent {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseTelemetryInput(value: string): TelemetryEvent[] {
  const parsed: unknown = JSON.parse(value)
  let candidate: unknown = parsed

  if (!Array.isArray(candidate) && typeof candidate === 'object' && candidate !== null) {
    candidate = (candidate as { logs?: unknown }).logs
  }

  if (!Array.isArray(candidate) || !candidate.every(isTelemetryEvent)) {
    throw new Error('Enter a JSON array of telemetry events, or an object with a logs array.')
  }
  if (candidate.length === 0) throw new Error('Add at least one telemetry event before analyzing.')
  if (candidate.length > 5000) throw new Error('The maximum is 5,000 events per analysis.')

  return candidate
}
