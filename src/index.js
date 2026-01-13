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
// If a built frontend exists, serve it at root so asset paths like /assets/* work
const frontendDist = path.join(__dirname, '..', 'public', 'frontend');
app.use(express.static(frontendDist));

// Fallback to serving other public files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve the SPA build at /frontend
app.get('/frontend', (req, res) => {
  res.redirect('/frontend/');
});
app.get('/frontend/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'frontend', 'index.html'));
});

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
app.listen(port, () => console.log(`whystack listening on http://localhost:${port}`));
