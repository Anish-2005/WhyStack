# ADR 0001: Keep root-cause ranking deterministic

- **Status:** Accepted
- **Date:** 2026-09-20

## Context

WhyStack helps on-call engineers inspect telemetry during incident triage. Users need to see which rules, signals, services, and event evidence produced each explanation. Sending operational telemetry to an external model would add cost, latency, privacy concerns, and outputs that are harder to reproduce.

## Decision

The current /explain path uses a deterministic parser, signal extractor, and rule engine. A multi-signal rule only combines signals from the same service within five minutes. The response includes stable rule identifiers and evidence. Scores are ranking weights and are described as such; they are not presented as calibrated probabilities.

## Consequences

- The same valid input produces the same rule matches and explanation.
- Users can inspect the evidence behind each result without a network model call.
- Rule changes can be checked with fixed regression tests.
- The engine has less language flexibility than a generative assistant; optional AI features must remain separate, transparent, and unable to change deterministic ranking.
