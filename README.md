# WhyStack

WhyStack analyzes structured telemetry and returns deterministic, evidence-backed incident explanations. It is designed for developers and on-call engineers who need to understand which signals and rules support a likely cause. The engine does not use machine learning; its ranking scores are heuristics, not calibrated probabilities.

## Stack

- Frontend: React 18, TypeScript, Vite 8, React Router 7, Monaco Editor, Tailwind CSS 4.
- Backend: Node.js 24, Express 4, Ajv validation, an in-memory LRU response cache, and Prometheus metrics.
- Storage: none. Requests and cache entries remain in process memory.
- Deployment: Vercel static frontend and Render backend, or the bundled Docker image described below.

## Run locally

Use Node.js 24 (Vite 8 requires Node.js 20.19+ or 22.12+).

~~~powershell
# Terminal 1
cd backend
npm ci
npm run dev

# Terminal 2
cd frontend
npm ci
npm run dev
~~~

Open http://localhost:5173. The Vite development server proxies /explain and /api/rules to the backend on port 3000. The backend’s public rule endpoint remains /rules; using /api/rules in the frontend leaves /rules available for the app’s rules page and direct links. Paste either a JSON event array or an object containing a logs array. Each event must be an object; a request accepts 1–5,000 events and is limited to 2 MB by default.

Set VITE_BACKEND_URL in the frontend environment only when the browser should call a different backend origin directly. Otherwise, requests use the same origin and the configured host proxy.

## Checks

~~~powershell
cd backend
npm test
npm audit --audit-level=moderate

cd ../frontend
npm test
npm run test:e2e
npm run lint
npm run build
npm audit --audit-level=moderate
~~~

GitHub Actions runs these checks on pushes to main and on pull requests.

## API

- POST /explain — analyze {"logs": [...]} and return a summary, ranked causes, signals, rule IDs, and evidence.
- GET /rules — list the active rules.
- GET /healthz and /readyz — liveness and readiness checks.
- GET /docs — interactive OpenAPI documentation.
- GET /metrics — Prometheus metrics; hidden in production unless METRICS_TOKEN is configured, then requires a bearer token.

The API has no user authentication. The hosted demo is public and should only receive telemetry that is safe to share. Production deployments should set CORS_ORIGINS, TRUST_PROXY_HOPS, JSON_BODY_LIMIT, and EXPLAIN_RATE_LIMIT to match their network and traffic. See backend/README.md.

## Deploy

The frontend can be deployed from frontend/ to Vercel; frontend/vercel.json proxies the API paths. Configure CORS_ORIGINS on the backend for the deployed frontend origin if its proxy forwards an Origin header. To run the combined frontend and API in one container:

~~~powershell
docker compose up --build
~~~

Open http://localhost:3000. Compose defaults to TRUST_PROXY_HOPS=0; set it to the exact number of trusted proxy hops when deploying behind a reverse proxy. See docs/architecture.md and docs/ai-roadmap.md.

## Repository map

- backend/src/app.js — HTTP middleware, routes, and error handling.
- backend/src/engine/ — telemetry parsing, signal extraction, rule matching, and explanation.
- backend/src/routes/ — analysis and rule-list endpoints.
- backend/test/ — backend API and engine tests.
- frontend/src/ — app shell, routes, editor, result components, and API client.
- docs/ — architecture, decisions, and the optional AI feature design.
