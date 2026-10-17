const test = require('node:test');
const assert = require('node:assert/strict');

const { parseAndNormalize } = require('../src/engine/parser');

test('groups events by service and sorts valid timestamps', () => {
  const result = parseAndNormalize([
    { service: 'payments', timestamp: '2026-10-17T12:00:00Z' },
    { service: 'payments', timestamp: '2026-10-17T11:00:00Z' },
    { service: 'orders', timestamp: 'invalid' },
  ]);

  assert.deepEqual(result.map(({ service }) => service), ['payments', 'orders']);
  assert.deepEqual(
    result[0].timeline.map(({ timestamp }) => timestamp),
    ['2026-10-17T11:00:00.000Z', '2026-10-17T12:00:00.000Z'],
  );
  assert.equal(result[1].timeline[0].timestamp, null);
});

test('accepts service names that collide with inherited object properties', () => {
  const serviceNames = ['__proto__', 'constructor', 'toString'];
  const result = parseAndNormalize(
    serviceNames.map((service) => ({ service, timestamp: '2026-10-17T12:00:00Z' })),
  );

  assert.deepEqual(result.map(({ service }) => service), serviceNames);
  assert.ok(result.every(({ timeline }) => timeline.length === 1));
});
