const rules = [
  { conditions: ['latency_spike', 'cpu_saturation'], cause: 'High CPU load', confidence: 0.8 },
  { conditions: ['latency_spike', 'memory_pressure'], cause: 'Memory pressure causing GC pauses', confidence: 0.7 },
  { conditions: ['error_event', 'dependency_failure'], cause: 'Downstream dependency failure', confidence: 0.9 },
  { conditions: ['error_event'], cause: 'Application errors (5xx)', confidence: 0.6 }
];

function matchAndRank(detectedSignals) {
  // Build a lookup of signals by type
  const types = new Set(detectedSignals.map(s => s.signal));

  const matches = [];
  for (const r of rules) {
    const matched = r.conditions.every(c => types.has(c));
    if (matched) {
      // basic score: confidence * number of conditions + severity boost
      let severityBoost = 0;
      for (const cond of r.conditions) {
        const s = detectedSignals.find(x => x.signal === cond);
        if (s && s.severity === 'high') severityBoost += 0.15;
      }
      const score = r.confidence + severityBoost;
      matches.push({ cause: r.cause, confidence: r.confidence, score, conditions: r.conditions });
    }
  }

  // fallback: single-signal matches
  if (matches.length === 0 && detectedSignals.length > 0) {
    for (const s of detectedSignals) {
      matches.push({ cause: `Observed ${s.signal} on ${s.service}`, confidence: 0.5, score: 0.5, conditions: [s.signal] });
    }
  }

  matches.sort((a, b) => b.score - a.score);

  // attach human label for confidence
  for (const m of matches) {
    if (m.score >= 0.85) m.confidenceLabel = 'High';
    else if (m.score >= 0.65) m.confidenceLabel = 'Medium';
    else m.confidenceLabel = 'Low';
  }

  return matches;
}

module.exports = { matchAndRank };
