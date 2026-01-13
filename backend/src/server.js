const path = require('path');
const fs = require('fs');
const express = require('express');

const app = require('./app');
const explainRouter = require('./routes/explain');

// Mount API routes
app.use('/explain', explainRouter);

// Serve built frontend if present
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.get('*', (req, res, next) => {
    const url = req.url || '';
    if (url.startsWith('/explain') || url.startsWith('/.well-known') || url.startsWith('/favicon.svg')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // optional: serve a minimal health page or other public files if provided
  const publicDir = path.join(__dirname, '..', '..', 'public');
  if (fs.existsSync(publicDir)) app.use(require('express').static(publicDir));
}

// favicon route (attempt to serve from frontend/dist then fallback to public)
app.get('/favicon.svg', (req, res) => {
  const candidates = [
    path.join(frontendDist, 'favicon.svg'),
    path.join(__dirname, '..', '..', 'public', 'favicon.svg')
  ];
  for (const p of candidates) if (fs.existsSync(p)) return res.sendFile(p);
  res.status(404).end();
});

// well-known probe
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ installed: false }));
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`whystack backend listening on http://localhost:${port}`));

// graceful shutdown
function shutdown(signal) {
  console.log(`Received ${signal}, shutting down`);
  server.close(err => {
    if (err) {
      console.error('Error during server close', err);
      process.exit(1);
    }
    console.log('Server closed');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
