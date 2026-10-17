const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const { metricsMiddleware, metricsEndpoint } = require('./middleware/metrics');
const logger = require('./logger');
const explainRouter = require('./routes/explain');
const rulesRouter = require('./routes/rules');
const openApiSpec = require('./openapi.json');

const DEFAULT_BODY_LIMIT = '2mb';
const DEFAULT_REQUEST_LIMIT = 60;
const DEFAULT_RATE_WINDOW_MS = 60 * 1000;

function getAllowedOrigins() {
  return new Set([
    'http://localhost:5173',
    'http://localhost:4173',
    ...(process.env.CORS_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ]);
}

function createApp({ staticDir } = {}) {
  const app = express();
  const allowedOrigins = getAllowedOrigins();
  const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? (process.env.NODE_ENV === 'production' ? 1 : 0));

  if (!Number.isInteger(trustProxyHops) || trustProxyHops < 0 || trustProxyHops > 5) {
    throw new Error('TRUST_PROXY_HOPS must be an integer between 0 and 5');
  }

  app.disable('x-powered-by');
  app.set('trust proxy', trustProxyHops);
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.has(origin));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  }));
  app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || DEFAULT_BODY_LIMIT }));
  app.use(metricsMiddleware);

  const explainLimiter = rateLimit({
    windowMs: DEFAULT_RATE_WINDOW_MS,
    max: Number(process.env.EXPLAIN_RATE_LIMIT || DEFAULT_REQUEST_LIMIT),
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, res) {
      res.status(429).json({ error: 'rate limit exceeded', message: 'Please wait before submitting another analysis.' });
    },
  });

  app.get('/healthz', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/readyz', (_req, res) => res.status(200).json({ status: 'ready' }));
  app.use('/explain', explainLimiter, explainRouter);
  app.use('/rules', rulesRouter);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, { customSiteTitle: 'WhyStack API' }));
  app.get('/metrics', metricsEndpoint);

  if (staticDir) {
    app.use(express.static(staticDir, { fallthrough: true, maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0 }));
    app.get('*', (req, res, next) => {
      if (!req.accepts('html')) return next();
      res.sendFile(require('path').join(staticDir, 'index.html'));
    });
  }

  app.use((req, res) => {
    res.status(404).json({ error: 'not found', path: req.path });
  });

  app.use((err, _req, res, _next) => {
    if (err?.type === 'entity.too.large') {
      return res.status(413).json({ error: 'request too large', message: 'Reduce the JSON body size and try again.' });
    }
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ error: 'invalid JSON', message: 'Request body must contain valid JSON.' });
    }

    logger.error({ err }, 'Unhandled request error');
    return res.status(500).json({ error: 'internal error', message: 'The request could not be completed.' });
  });

  return app;
}

module.exports = { createApp };
