function explain(causes, signals) {
  if (!causes || causes.length === 0) {
    return { text: "I don't know why — not enough signals.", details: {} };
  }

  const top = causes[0];
  const time = signals && signals[0] ? signals[0].startTime : 'unknown time';
  const service = signals && signals[0] ? signals[0].service : 'unknown service';

  const text = `The ${service} likely misbehaved because ${top.cause}. This started around ${time} when signals such as ${signals.map(s => s.signal).join(', ')} were observed.`;

  return { text, details: { topCause: top, signals } };
}

module.exports = { explain };
