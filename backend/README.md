# WhyStack backend

The backend validates telemetry, extracts signals, matches deterministic rules, and returns an explanation with rule IDs and evidence. It uses Node.js and Express and has no database or external model dependency.

## Run and test

~~~powershell
npm ci
npm run dev
npm test
~~~

The API listens on PORT (default 3000). Tests include parser edge cases, engine correlation rules, and HTTP integration coverage.

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| POST | /explain | Analyze {"logs": [...]}; accepts 1–5,000 event objects. |
| GET | /rules | Return active deterministic rules. |
| GET | /healthz | Process liveness. |
| GET | /readyz | Process readiness. |
| GET | /docs | Swagger UI for the OpenAPI document. |
| GET | /metrics | Prometheus metrics. |

The default body limit is 2 MB and the default analysis limit is 60 requests per minute per client IP. Responses are cached in process memory; restarts clear the cache. Multi-signal matches require the same service and timestamps within five minutes. Untimed signals are not combined. The displayed score is deterministic rule weight, not probability.

## Environment

| Variable | Default | Description |
| --- | --- | --- |
| PORT | 3000 | HTTP listen port, 1–65,535. |
| NODE_ENV | development | Set to production in deployments. |
| CORS_ORIGINS | empty | Comma-separated additional allowed origins; localhost development origins are built in. |
| JSON_BODY_LIMIT | 2mb | Express JSON body size limit. |
| EXPLAIN_RATE_LIMIT | 60 | Maximum analysis requests per IP in one minute. |
| TRUST_PROXY_HOPS | 0 locally, 1 in production | Number of trusted reverse-proxy hops. Set to the actual topology; do not trust client-supplied forwarded headers. |
| METRICS_TOKEN | unset | When set, /metrics requires Authorization: Bearer token. In production without a token, the endpoint returns 404. |

The API has no user authentication or per-customer isolation. Avoid sending telemetry containing secrets or personal data to the public demo. Keep any metrics token in the hosting provider’s secret manager.

## Deployment

Render can run npm ci --omit=dev followed by npm start; set NODE_ENV=production, a platform-provided PORT, and the environment above. When hosted behind a reverse proxy, configure TRUST_PROXY_HOPS to the exact number of trusted hops. The root Docker image bundles the static frontend with the API.

See src/openapi.json for the API contract and docs/architecture.md for the request flow.
