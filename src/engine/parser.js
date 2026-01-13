function parseAndNormalize(logs) {
  // Basic validation, timestamp parsing, sort, and group by service
  const normalized = logs
    .map((e, idx) => {
      const ts = new Date(e.timestamp || e.time || null);
      return Object.assign({}, e, { _originalIndex: idx, timestamp: isNaN(ts) ? null : ts.toISOString() });
    })
    .sort((a, b) => {
      if (!a.timestamp && !b.timestamp) return 0;
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

  const byService = {};
  for (const ev of normalized) {
    const svc = ev.service || 'unknown';
    byService[svc] = byService[svc] || { service: svc, timeline: [] };
    byService[svc].timeline.push(ev);
  }

  return Object.values(byService);
}

module.exports = { parseAndNormalize };
