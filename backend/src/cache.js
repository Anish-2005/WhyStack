const { LRUCache } = require('lru-cache');

module.exports = new LRUCache({
  max: 500,
  ttl: 5 * 60 * 1000,
});
