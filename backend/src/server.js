const fs = require('fs');
const path = require('path');

const { createApp } = require('./app');
const logger = require('./logger');

const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
const app = createApp({ staticDir: fs.existsSync(frontendDist) ? frontendDist : undefined });
const configuredPort = Number(process.env.PORT || 3000);

if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const server = app.listen(configuredPort, () => {
  logger.info({ port: configuredPort, environment: process.env.NODE_ENV || 'development' }, 'WhyStack API listening');
});

server.on('error', (err) => {
  logger.fatal({ err }, 'WhyStack API failed to start');
  process.exitCode = 1;
});

let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'Graceful shutdown started');

  const forceExit = setTimeout(() => {
    logger.error({ signal }, 'Graceful shutdown timed out');
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close((err) => {
    clearTimeout(forceExit);
    if (err) {
      logger.error({ err, signal }, 'Server shutdown failed');
      process.exitCode = 1;
      return;
    }
    logger.info({ signal }, 'Server shutdown complete');
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
