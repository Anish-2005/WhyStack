// Lightweight in-memory cache with TTL and max size
class SimpleCache {
  constructor({ max = 500, ttl = 1000 * 60 * 5 } = {}) {
    this.max = max;
    this.ttl = ttl;
    this.map = new Map();
  }

  _isExpired(entry) {
    return entry.expireAt && Date.now() > entry.expireAt;
  }

  has(key) {
    const e = this.map.get(key);
    if (!e) return false;
    if (this._isExpired(e)) { this.map.delete(key); return false; }
    return true;
  }

  get(key) {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (this._isExpired(e)) { this.map.delete(key); return undefined; }
    // refresh LRU order
    this.map.delete(key);
    this.map.set(key, e);
    return e.value;
  }

  set(key, value) {
    if (this.map.size >= this.max) {
      // drop oldest
      const firstKey = this.map.keys().next().value;
      if (firstKey) this.map.delete(firstKey);
    }
    this.map.set(key, { value, expireAt: Date.now() + this.ttl });
  }
}

module.exports = new SimpleCache({ max: 500, ttl: 1000 * 60 * 5 });
