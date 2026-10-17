const CORRELATION_WINDOW_MS = 5 * 60 * 1000;
const MAX_CAUSES = 20;

const rules = [
  { id: 'cpu-saturation-latency', conditions: ['latency_spike', 'cpu_saturation'], cause: 'High CPU load', confidence: 0.8 },
  { id: 'memory-pressure-latency', conditions: ['latency_spike', 'memory_pressure'], cause: 'Memory pressure causing GC pauses', confidence: 0.7 },
  { id: 'gateway-dependency-failure', conditions: ['error_event', 'dependency_failure'], cause: 'Downstream dependency failure', confidence: 0.9 },
  { id: 'application-5xx', conditions: ['error_event'], cause: 'Application errors (5xx)', confidence: 0.6 },
];

function getRules() {
  return rules.map(({ id, conditions, cause, confidence }) => ({
    id,
    conditions: [...conditions],
    cause,
    confidence,
  }));
}

function groupSignals(detectedSignals) {
  const byService = new Map();

  detectedSignals.forEach((signal, index) => {
    const service = signal.service || 'unknown';
    const serviceSignals = byService.get(service) || [];
    serviceSignals.push({ signal, index, timestamp: Date.parse(signal.startTime || '') });
    byService.set(service, serviceSignals);
  });

  const windows = [];
  for (const [service, entries] of byService) {
    const timed = entries
      .filter((entry) => Number.isFinite(entry.timestamp))
      .sort((left, right) => left.timestamp - right.timestamp || left.index - right.index);
    const untimed = entries.filter((entry) => !Number.isFinite(entry.timestamp));

    let current = null;
    for (const entry of timed) {
      if (!current || entry.timestamp - current.start > CORRELATION_WINDOW_MS) {
        if (current) windows.push(current);
        current = { service, start: entry.timestamp, entries: [] };
      }
      current.entries.push(entry);
    }
    if (current) windows.push(current);

    // Without timestamps, do not infer that separate observations were concurrent.
    for (const entry of untimed) {
      windows.push({ service, start: Number.POSITIVE_INFINITY, entries: [entry] });
    }
  }

  return windows;
}

function compareEvidence(left, right) {
  const severity = { high: 3, medium: 2, low: 1 };
  const severityDelta = (severity[right.severity] || 0) - (severity[left.severity] || 0);
  if (severityDelta !== 0) return severityDelta;
  return String(left.startTime || '').localeCompare(String(right.startTime || ''));
}

function buildCause(rule, service, evidence) {
  const highSeverityCount = evidence.filter((signal) => signal.severity === 'high').length;
  const score = Math.min(0.99, rule.confidence + highSeverityCount * 0.05);
  const confidenceLabel = score >= 0.85 ? 'High' : score >= 0.65 ? 'Medium' : 'Low';

  return {
    ruleId: rule.id,
    cause: rule.cause,
    confidence: rule.confidence,
    score,
    confidenceLabel,
    conditions: [...rule.conditions],
    service,
    evidence,
  };
}

function matchAndRank(detectedSignals) {
  if (!Array.isArray(detectedSignals) || detectedSignals.length === 0) return [];

  const matches = [];
  for (const window of groupSignals(detectedSignals)) {
    const signals = window.entries.map((entry) => entry.signal);
    const matchesForWindow = [];

    for (const rule of rules) {
      const evidence = rule.conditions.map((condition) => (
        signals
          .filter((signal) => signal.signal === condition)
          .sort(compareEvidence)[0]
      ));
      if (evidence.every(Boolean)) {
        matchesForWindow.push(buildCause(rule, window.service, evidence));
      }
    }

    if (matchesForWindow.length > 0) {
      matches.push(...matchesForWindow);
      continue;
    }

    for (const signal of signals) {
      const fallbackRule = {
        id: `observed-${signal.signal}`,
        cause: `Observed ${signal.signal} on ${window.service}`,
        confidence: 0.5,
        conditions: [signal.signal],
      };
      matches.push(buildCause(fallbackRule, window.service, [signal]));
    }
  }

  return matches
    .sort((left, right) => right.score - left.score
      || left.ruleId.localeCompare(right.ruleId)
      || left.service.localeCompare(right.service)
      || left.evidence[0].startTime?.localeCompare(right.evidence[0].startTime || '') || 0)
    .slice(0, MAX_CAUSES);
}

module.exports = { matchAndRank, getRules, CORRELATION_WINDOW_MS };
