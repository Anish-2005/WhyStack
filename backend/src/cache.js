const LRU = require('lru-cache');

const cache = new LRU({
  max: 500,
  ttl: 1000 * 60 * 5 // 5 minutes
});

module.exports = cache;
