# Optional AI feature design

WhyStack’s core value is deterministic, inspectable incident analysis. No LLM is called by the current app. AI should be added only as a separate, user-triggered capability after users opt in to sending the selected telemetry to a provider.

## Useful candidate features

1. **Evidence-linked incident summary:** Turn the deterministic result into a concise handoff summary while linking every factual claim to signal IDs, rule IDs, or event timestamps.
2. **Postmortem draft:** Produce a first draft with impact, timeline, contributing signals, and unanswered questions. Require a human to review it before export or sharing.
3. **Natural-language telemetry filters:** Convert a request such as “show payment timeouts during the last five minutes” into a typed, previewable filter. The user confirms the filter before it runs.
4. **Triage questions:** Let a user ask follow-up questions about the current result and return answers that cite only the supplied evidence. Do not allow the model to trigger remediation actions.

## Proposed implementation boundary

- Add an optional backend AIProvider interface; keep provider SDKs, credentials, and model selection out of the browser. Version prompts in source and include the prompt version in responses and telemetry-free metrics.
- Keep the feature behind an explicit server feature flag and a per-request user opt-in. Show which data leaves the service and provide a no-AI path that returns the existing deterministic result.
- Minimize data before submission: omit fields not needed for the selected task, redact configured secrets, and do not retain prompts or provider responses by default.
- Treat log and trace text as untrusted quoted data, never as instructions. Do not give the model tools that execute commands or mutate infrastructure.
- Validate structured output with the existing schema-validation approach. Reject malformed output and fall back to the deterministic explanation with a clear message.
- Stream only the optional narrative response. Apply strict request, token, timeout, and per-IP rate limits; cap provider spend and use a short-lived cache keyed by normalized input hash plus prompt version.
- Add fixed evaluation cases for evidence citation, unsupported claims, prompt injection in logs, privacy redaction, and failure fallback before enabling a provider.

These features require a product decision about provider, retention, user authentication, and data residency. Until those are defined, the deterministic engine remains the complete analysis path.
