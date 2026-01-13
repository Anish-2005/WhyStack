const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const { metricsMiddleware, metricsEndpoint } = require('./middleware/metrics');
const logger = require('./logger');

const app = express();

// security and basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(metricsMiddleware);

// simple rate limiter
const limiter = rateLimit({ windowMs: 1000 * 10, max: 200 });
app.use(limiter);

// swagger UI (basic placeholder openapi)
try {
	const spec = require(path.join(__dirname, 'openapi.json'));
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
} catch (e) {
	logger.debug('No openapi.json found for swagger UI');
}

// metrics endpoint
app.get('/metrics', metricsEndpoint);

module.exports = app;
