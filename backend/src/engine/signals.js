function extractSignals(services) {
  // services: [{service, timeline: [events]}]
  const signals = [];

  for (const svc of services) {
    const t = svc.timeline;
    if (!t || t.length === 0) continue;

    // simple window-based checks
    for (let i = 0; i < t.length; i++) {
      const e = t[i];
      if (e.latency_ms && e.latency_ms > 800) {
        signals.push({ signal: 'latency_spike', severity: 'high', startTime: e.timestamp, service: svc.service, info: { latency: e.latency_ms } });
      } else if (e.latency_ms && e.latency_ms > 300) {
        signals.push({ signal: 'latency_spike', severity: 'medium', startTime: e.timestamp, service: svc.service, info: { latency: e.latency_ms } });
      }

      if (e.status && e.status >= 500) {
        signals.push({ signal: 'error_event', severity: 'high', startTime: e.timestamp, service: svc.service, info: { status: e.status, error: e.error } });
      }

      if (e.cpu_percent && e.cpu_percent > 85) {
        signals.push({ signal: 'cpu_saturation', severity: 'high', startTime: e.timestamp, service: svc.service, info: { cpu: e.cpu_percent } });
      } else if (e.cpu_percent && e.cpu_percent > 70) {
        signals.push({ signal: 'cpu_saturation', severity: 'medium', startTime: e.timestamp, service: svc.service, info: { cpu: e.cpu_percent } });
      }

      if (e.memory_percent && e.memory_percent > 85) {
        signals.push({ signal: 'memory_pressure', severity: 'high', startTime: e.timestamp, service: svc.service, info: { memory: e.memory_percent } });
      }

      // dependency check - basic heuristic: status 502-504 on gateway
      if (svc.service && svc.service.toLowerCase().includes('gateway') && e.status >= 500 && e.status < 600) {
        signals.push({ signal: 'dependency_failure', severity: 'high', startTime: e.timestamp, service: svc.service, info: { status: e.status } });
      }
    }
  }

  // collapse duplicates by signal+service+startTime
  const key = s => `${s.signal}|${s.service}|${s.startTime}`;
  const unique = [];
  const seen = new Set();
  for (const s of signals) {
    const k = key(s);
    if (!seen.has(k)) {
      unique.push(s);
      seen.add(k);
    }
  }

  return unique;
}

module.exports = { extractSignals };
