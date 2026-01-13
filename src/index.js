const express = require('express');
const path = require('path');
const cors = require('cors');

const parser = require('./engine/parser');
const signals = require('./engine/signals');
const ruleEngine = require('./engine/ruleEngine');
const explainer = require('./engine/explainer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
// Serve the built frontend (dist) at the site root so asset paths like /assets/* resolve
const frontendDist = path.join(__dirname, '..', 'public', 'frontend', 'dist');
if (require('fs').existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // SPA fallback: serve index.html for any unmatched route (client-side routing)
  app.get('*', (req, res, next) => {
    const url = req.url || '';
    // allow API and well-known routes to pass through
    if (url.startsWith('/explain') || url.startsWith('/.well-known') || url.startsWith('/favicon.svg')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Fallback to serving other public files when no built frontend present
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

app.post('/explain', (req, res) => {
  try {
    const { logs } = req.body;
    if (!Array.isArray(logs)) return res.status(400).json({ error: 'logs must be an array' });

    const parsed = parser.parseAndNormalize(logs);
    const detectedSignals = signals.extractSignals(parsed);
    const causes = ruleEngine.matchAndRank(detectedSignals);
    const explanation = explainer.explain(causes, detectedSignals);

    res.json({
      summary: causes[0] ? causes[0].cause : 'Unknown cause',
      explanation: explanation.text,
      signals_detected: detectedSignals.map(s => s.signal),
      confidence: causes[0] ? (causes[0].confidenceLabel || 'Low') : 'Low',
      trace: {
        signals: detectedSignals,
        causes: causes
      }
    });
  } catch (err) {
    console.error('Error in /explain:', err);
    const isProd = process.env.NODE_ENV === 'production';
    const payload = { error: 'internal error' };
    if (!isProd) {
      payload.message = err.message;
      payload.stack = err.stack;
    }
    res.status(500).json(payload);
  }
});

const port = process.env.PORT || 3000;
// serve favicon at root
app.get('/favicon.svg', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'favicon.svg'))
});

// Respond to DevTools appspecific lookup to avoid 404/CSP console noise
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // minimal response, allows DevTools extensions to probe without errors
  res.send(JSON.stringify({ installed: false }));
});

app.listen(port, () => console.log(`whystack listening on http://localhost:${port}`));
