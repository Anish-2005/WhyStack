import type { ExplainResponse, RuleSummary, TelemetryEvent, ValidationDetail } from '../types/api'

const backendBaseUrl = import.meta.env.VITE_BACKEND_URL?.trim().replace(/\/$/, '') ?? ''
const requestTimeoutMs = 30_000

export class ApiRequestError extends Error {
  readonly status?: number
  readonly details?: ValidationDetail[]

  constructor(message: string, options: { status?: number; details?: ValidationDetail[] } = {}) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = options.status
    this.details = options.details
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidationDetail(value: unknown): value is ValidationDetail {
  return isRecord(value)
    && (value.instancePath === undefined || typeof value.instancePath === 'string')
    && (value.message === undefined || typeof value.message === 'string')
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs)

  try {
    const response = await fetch(`${backendBaseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { 'content-type': 'application/json', ...init?.headers },
    })
    const body: unknown = await response.json().catch(() => null)

    if (!response.ok) {
      const payload = isRecord(body) ? body : null
      const message = typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : `The server returned ${response.status}.`
      throw new ApiRequestError(message, {
        status: response.status,
        details: Array.isArray(payload?.details) ? payload.details.filter(isValidationDetail) : undefined,
      })
    }

    return body as T
  } catch (error) {
    if (error instanceof ApiRequestError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiRequestError('The analysis took too long. Reduce the input size and try again.')
    }
    throw new ApiRequestError('Could not reach the WhyStack service. Check your connection and try again.')
  } finally {
    window.clearTimeout(timeout)
  }
}

export function explain(logs: TelemetryEvent[]): Promise<ExplainResponse> {
  return requestJson<ExplainResponse>('/explain', {
    method: 'POST',
    body: JSON.stringify({ logs }),
  })
}

export function fetchRules(): Promise<{ rules: RuleSummary[] }> {
  return requestJson<{ rules: RuleSummary[] }>('/api/rules', { method: 'GET' })
}
