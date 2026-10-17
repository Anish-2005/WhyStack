const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const parser = require('../engine/parser');
const signals = require('../engine/signals');
const ruleEngine = require('../engine/ruleEngine');
const explainer = require('../engine/explainer');
const cache = require('../cache');
const logger = require('../logger');
const { validateSchema } = require('../middleware/validator');

// validate request body against schema
router.post('/', validateSchema('explain.schema.json'), (req, res) => {
  const start = Date.now();
  try {
    const { logs } = req.body;
    const key = crypto.createHash('sha256').update(JSON.stringify(logs)).digest('hex');

    if (cache.has(key)) {
      logger.info({ route: '/explain', cached: true });
      return res.json(cache.get(key));
    }

    const parsed = parser.parseAndNormalize(logs);
    const detectedSignals = signals.extractSignals(parsed);
    const causes = ruleEngine.matchAndRank(detectedSignals);
    const explanation = explainer.explain(causes, detectedSignals);

    const payload = {
      summary: causes[0] ? causes[0].cause : 'Unknown cause',
      explanation: explanation.text,
      signals_detected: detectedSignals.map(s => s.signal),
      confidence: causes[0] ? (causes[0].confidenceLabel || 'Low') : 'Low',
      trace: { signals: detectedSignals, causes }
    };

    cache.set(key, payload);
    logger.info({ route: '/explain', duration_ms: Date.now() - start, cached: false });
    res.json(payload);
  } catch (err) {
    logger.error({ msg: 'Error in /explain', err });
    const isProd = process.env.NODE_ENV === 'production';
    const payload = { error: 'internal error' };
    if (!isProd) { payload.message = err.message; payload.stack = err.stack; }
    res.status(500).json(payload);
  }
});

module.exports = router;
