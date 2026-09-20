# Architecture and operations

## Request path

~~~mermaid
flowchart LR
  User[On-call engineer] --> UI[React SPA]
  UI -->|POST /explain| Proxy[Vercel rewrite or same-origin host]
  UI -->|GET /api/rules| Proxy
  Proxy --> API[Express app]
  API --> Guard[Helmet, CORS, JSON limit, rate limit, schema validation]
  Guard --> Cache[Process-local LRU cache]
  Cache --> Parser[Parser]
  Parser --> Signals[Signal extraction]
  Signals --> Rules[Deterministic rule matcher]
  Rules --> Explain[Evidence-based explanation]
  Explain --> API
  API --> UI
  API --> Metrics[Health and Prometheus routes]
~~~

The application has no persistent data store. The cache is per process and is cleared on restart. The frontend uses same-origin API paths by default; Vite proxies /explain and /api/rules during local development and Vercel rewrites them in the hosted frontend. The backend’s /rules endpoint remains directly available to API clients, while the frontend /rules route remains reloadable.

## Runtime boundaries

- **Frontend:** frontend/src/App.tsx owns input and analysis state. utils/input.ts parses pasted JSON. utils/api.ts handles HTTP timeouts and maps service errors into readable messages. Pages and components render the API result.
- **Backend:** backend/src/app.js builds the Express application. Routes validate input and call the engine modules. engine/parser.js, signals.js, ruleEngine.js, and explainer.js each handle one analysis stage.
- **Observability:** /healthz and /readyz return process status; /metrics exports Prometheus metrics. Metrics are hidden in production unless protected by METRICS_TOKEN.
- **Security boundary:** The API is public and has no user authentication. CORS is an origin policy, not authentication. The request schema limits event count and field sizes; request-size and per-IP rate limits apply before analysis.

## Local development

Run the backend on port 3000 and frontend on port 5173. Vite proxies /explain and /api/rules to the backend. Use npm ci in each package directory to install from its lockfile.

## Hosted deployment

Vercel serves the static frontend and rewrites API paths to Render. Add the frontend origin to backend CORS_ORIGINS if the proxy forwards the browser Origin header. Set the backend NODE_ENV, TRUST_PROXY_HOPS, rate/body limits, and metrics secret in the host configuration. Docker runs the built SPA and API together on port 3000.

## Engineering decisions

See ADR 0001: deterministic rule engine. Optional LLM-assisted features are discussed in the AI roadmap; the current analysis path remains deterministic and offline.
