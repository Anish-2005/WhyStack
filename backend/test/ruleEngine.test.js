const test = require('node:test');
const assert = require('node:assert/strict');

const { matchAndRank, getRules, CORRELATION_WINDOW_MS } = require('../src/engine/ruleEngine');
const { explain } = require('../src/engine/explainer');

function signal(type, service, startTime, severity = 'high') {
  return { signal: type, service, startTime, severity };
}

test('returns stable rule identifiers and bounded scores for correlated signals', () => {
  const causes = matchAndRank([
    signal('latency_spike', 'api', '2026-10-17T12:00:00Z'),
    signal('cpu_saturation', 'api', '2026-10-17T12:01:00Z'),
  ]);

  assert.equal(causes[0].ruleId, 'cpu-saturation-latency');
  assert.equal(causes[0].service, 'api');
  assert.deepEqual(causes[0].conditions, ['latency_spike', 'cpu_saturation']);
  assert.ok(causes[0].score <= 0.99);
  assert.equal(causes[0].evidence.length, 2);
});

test('does not combine signals from different services or distant time windows', () => {
  const crossService = matchAndRank([
    signal('latency_spike', 'api', '2026-10-17T12:00:00Z'),
    signal('cpu_saturation', 'worker', '2026-10-17T12:01:00Z'),
  ]);
  const distant = matchAndRank([
    signal('latency_spike', 'api', '2026-10-17T12:00:00Z'),
    signal('cpu_saturation', 'api', new Date(Date.parse('2026-10-17T12:00:00Z') + CORRELATION_WINDOW_MS + 1).toISOString()),
  ]);

  assert.ok(crossService.every(({ ruleId }) => ruleId !== 'cpu-saturation-latency'));
  assert.ok(distant.every(({ ruleId }) => ruleId !== 'cpu-saturation-latency'));
});

test('does not infer multi-signal causes when timestamps are missing', () => {
  const causes = matchAndRank([
    signal('latency_spike', 'api', null),
    signal('cpu_saturation', 'api', null),
  ]);

  assert.ok(causes.every(({ ruleId }) => ruleId !== 'cpu-saturation-latency'));
});

test('explains the selected cause using its own service and evidence', () => {
  const causes = matchAndRank([
    signal('error_event', 'billing', '2026-10-17T12:01:00Z'),
    signal('latency_spike', 'catalog', '2026-10-17T12:00:00Z'),
    signal('dependency_failure', 'billing', '2026-10-17T12:02:00Z'),
  ]);
  const result = explain(causes, []);

  assert.match(result.text, /billing/);
  assert.match(result.text, /Downstream dependency failure/);
  assert.doesNotMatch(result.text, /catalog/);
  assert.match(result.text, /error_event, dependency_failure/);
});

test('exposes immutable rule summaries for the documentation route', () => {
  const first = getRules();
  first[0].conditions.push('mutated');
  assert.ok(!getRules()[0].conditions.includes('mutated'));
});
