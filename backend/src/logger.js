const pino = require('pino');

// Use simple pino logger without transport to avoid extra dependency on pino-pretty
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

module.exports = logger;
