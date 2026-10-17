function explain(causes, signals) {
  if (!causes || causes.length === 0) {
    return { text: "I don't know why — not enough signals.", details: {} };
  }

  const top = causes[0];
  const evidence = Array.isArray(top.evidence) && top.evidence.length > 0
    ? top.evidence
    : signals || [];
  const service = top.service || evidence[0]?.service || 'unknown service';
  const observedSignals = [...new Set(evidence.map((signal) => signal.signal))];
  const timestamps = evidence
    .map((signal) => Date.parse(signal.startTime || ''))
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
  const timeText = timestamps.length > 0
    ? ` around ${new Date(timestamps[0]).toISOString()}`
    : '';
  const signalText = observedSignals.length > 0
    ? ` Evidence: ${observedSignals.join(', ')}.`
    : '';
  const text = `The leading rule-based explanation for ${service} is ${top.cause}${timeText}.${signalText}`;

  return { text, details: { topCause: top, signals: evidence } };
}

module.exports = { explain };
