import { describe, expect, it } from 'vitest'
import { parseTelemetryInput } from './input'

describe('parseTelemetryInput', () => {
  it('accepts a JSON array of telemetry events', () => {
    const logs = [{ service: 'payments', status: 502 }]

    expect(parseTelemetryInput(JSON.stringify(logs))).toEqual(logs)
  })

  it('accepts the documented object wrapper', () => {
    const logs = [{ service: 'api-gateway', latency_ms: 920 }]

    expect(parseTelemetryInput(JSON.stringify({ logs }))).toEqual(logs)
  })

  it('rejects malformed event containers with a readable error', () => {
    expect(() => parseTelemetryInput('{')).toThrow(SyntaxError)
    expect(() => parseTelemetryInput('{"events":[]}')).toThrow(
      'Enter a JSON array of telemetry events, or an object with a logs array.',
    )
    expect(() => parseTelemetryInput('[null]')).toThrow(
      'Enter a JSON array of telemetry events, or an object with a logs array.',
    )
  })

  it('rejects empty and oversized submissions before the network request', () => {
    expect(() => parseTelemetryInput('[]')).toThrow('Add at least one telemetry event before analyzing.')
    expect(() => parseTelemetryInput(JSON.stringify(Array.from({ length: 5001 }, () => ({}))))).toThrow(
      'The maximum is 5,000 events per analysis.',
    )
  })
})
