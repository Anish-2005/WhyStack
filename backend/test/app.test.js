const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

const { createApp } = require('../src/app');

async function withServer(app, run) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

const correlatedLogs = [
  {
    timestamp: '2026-10-17T12:00:00Z',
    service: 'api-gateway',
    latency_ms: 920,
    cpu_percent: 85,
    status: 502,
    error: 'Bad Gateway',
  },
];

test('serves health, readiness, rules, and OpenAPI docs', async () => {
  await withServer(createApp(), async (baseUrl) => {
    const health = await fetch(`${baseUrl}/healthz`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: 'ok' });
    assert.equal(health.headers.get('x-powered-by'), null);

    const ready = await fetch(`${baseUrl}/readyz`);
    assert.deepEqual(await ready.json(), { status: 'ready' });

    const rules = await fetch(`${baseUrl}/rules`);
    const rulePayload = await rules.json();
    assert.equal(rules.status, 200);
    assert.ok(rulePayload.rules.some(({ id }) => id === 'gateway-dependency-failure'));

    const docs = await fetch(`${baseUrl}/docs`);
    assert.equal(docs.status, 200);
    assert.match(docs.headers.get('content-type'), /text\/html/);
  });
});

test('validates explain requests and returns rule evidence', async () => {
  await withServer(createApp(), async (baseUrl) => {
    const invalid = await fetch(`${baseUrl}/explain`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ logs: [] }),
    });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error, 'validation error');

    const valid = await fetch(`${baseUrl}/explain`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ logs: correlatedLogs }),
    });
    const result = await valid.json();
    assert.equal(valid.status, 200);
    assert.equal(result.summary, 'Downstream dependency failure');
    assert.equal(result.trace.causes[0].ruleId, 'gateway-dependency-failure');
    assert.equal(result.trace.causes[0].service, 'api-gateway');
    assert.ok(result.trace.causes[0].score <= 1);
  });
});

test('returns JSON errors for malformed and oversized requests', async () => {
  const previousLimit = process.env.JSON_BODY_LIMIT;
  process.env.JSON_BODY_LIMIT = '1kb';
  try {
    await withServer(createApp(), async (baseUrl) => {
      const malformed = await fetch(`${baseUrl}/explain`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{invalid',
      });
      assert.equal(malformed.status, 400);
      assert.equal((await malformed.json()).error, 'invalid JSON');

      const oversized = await fetch(`${baseUrl}/explain`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ logs: [{ message: 'x'.repeat(2000) }] }),
      });
      assert.equal(oversized.status, 413);
      assert.equal((await oversized.json()).error, 'request too large');
    });
  } finally {
    if (previousLimit === undefined) delete process.env.JSON_BODY_LIMIT;
    else process.env.JSON_BODY_LIMIT = previousLimit;
  }
});

test('applies configured CORS origins', async () => {
  await withServer(createApp(), async (baseUrl) => {
    const allowed = await fetch(`${baseUrl}/healthz`, { headers: { origin: 'http://localhost:5173' } });
    assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');

    const denied = await fetch(`${baseUrl}/healthz`, { headers: { origin: 'https://untrusted.example' } });
    assert.equal(denied.headers.get('access-control-allow-origin'), null);
  });
});

test('returns a JSON 429 after the configured explain request limit', async () => {
  const previousLimit = process.env.EXPLAIN_RATE_LIMIT;
  process.env.EXPLAIN_RATE_LIMIT = '1';
  try {
    await withServer(createApp(), async (baseUrl) => {
      const request = () => fetch(`${baseUrl}/explain`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ logs: correlatedLogs }),
      });
      assert.equal((await request()).status, 200);
      const limited = await request();
      assert.equal(limited.status, 429);
      assert.equal((await limited.json()).error, 'rate limit exceeded');
    });
  } finally {
    if (previousLimit === undefined) delete process.env.EXPLAIN_RATE_LIMIT;
    else process.env.EXPLAIN_RATE_LIMIT = previousLimit;
  }
});
