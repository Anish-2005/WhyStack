const client = require('prom-client');

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
    httpRequestDuration.labels(req.method, req.route ? req.route.path : req.path, String(res.statusCode)).observe(seconds);
  });
  next();
}

function metricsEndpoint(req, res) {
  res.set('Content-Type', register.contentType);
  register.metrics().then(data => res.send(data)).catch(err => res.status(500).send(err.message));
}

module.exports = { metricsMiddleware, metricsEndpoint, register };
