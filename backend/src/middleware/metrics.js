const client = require('prom-client');
const crypto = require('crypto');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});
register.registerMetric(httpRequestDuration);

function metricsMiddleware(req, res, next) {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const seconds = diff[0] + diff[1] / 1e9;
    const route = req.route ? `${req.baseUrl}${req.route.path}` : 'unmatched';
    httpRequestDuration.labels(req.method, route || '/', String(res.statusCode)).observe(seconds);
  });
  next();
}

function metricsEndpoint(req, res) {
  const expectedToken = process.env.METRICS_TOKEN;
  if (process.env.NODE_ENV === 'production' && !expectedToken) return res.sendStatus(404);
  if (expectedToken) {
    const providedToken = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
    const expected = Buffer.from(expectedToken);
    const provided = Buffer.from(providedToken);
    if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
      return res.sendStatus(401);
    }
  }
  res.set('Content-Type', register.contentType);
  register.metrics().then(data => res.send(data)).catch(() => res.status(500).json({ error: 'metrics unavailable' }));
}

module.exports = { metricsMiddleware, metricsEndpoint, register };
