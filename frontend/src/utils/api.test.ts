import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiRequestError, explain, fetchRules } from './api'

const sampleLog = { service: 'payments', status: 502 }

describe('analysis API client', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { setTimeout, clearTimeout })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts telemetry in the backend request shape', async () => {
    const result = { summary: 'Elevated errors', explanation: 'A gateway timeout was detected.' }
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(result), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(explain([sampleLog])).resolves.toEqual(result)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/explain$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ logs: [sampleLog] }),
      }),
    )
  })

  it('preserves validation details from backend errors', async () => {
    const payload = {
      error: 'invalid request',
      message: 'logs must contain at least one event',
      details: [{ instancePath: '/logs', message: 'must NOT have fewer than 1 items' }],
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 400 })))

    await expect(explain([])).rejects.toMatchObject<ApiRequestError>({
      name: 'ApiRequestError',
      message: payload.message,
      status: 400,
      details: payload.details,
    })
  })

  it('shows a human-readable message when the service is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network unavailable')))

    await expect(fetchRules()).rejects.toMatchObject<ApiRequestError>({
      name: 'ApiRequestError',
      message: 'Could not reach the WhyStack service. Check your connection and try again.',
    })
  })
})
