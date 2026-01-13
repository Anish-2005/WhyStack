<!-- prettier-ignore -->
## 🧠 WhyStack Backend — Express Rule Engine


What this part does
 - Exposes POST `/explain` which accepts structured JSON and returns a deterministic explanation.
 - Components:
   - Parser: normalizes inputs and extracts structured fields.
   - Signal Extractor: computes signals from logs/metrics/traces.
   - Rule Engine: matches signals against rules and produces candidate causes.
   - Ranker & Explainer: ranks candidates and formulates human-readable explanations plus an audit trail.

Key files
 - `src/server.js` — server bootstrap, static serving and graceful shutdown.
 - `src/app.js` — Express app with middleware (helmet, rate-limit, metrics).
 - `src/routes/explain.js` — request validation, cache handling, and main explain flow.
 - `src/engine/` — `parser.js`, `signals.js`, `ruleEngine.js`, `explainer.js` and the `rules` folder.
 - `src/cache.js` — small in-memory cache used for repeated requests.

Quick start (dev)
```powershell
cd backend
npm install
npm run dev   # starts server on configured PORT (default 3000)
```

Call the API
```powershell
curl -X POST http://localhost:3000/explain \
  -H "Content-Type: application/json" \
  -d @sample-input.json
```

Environment
 - `PORT`: server port (default: 3000)
 - `NODE_ENV`: `development` or `production`

Deployment
 - The backend is small and suitable for Render, Heroku, or container-based deploys.
 - Live example: https://whystack.onrender.com

Extending rules
 - Rules live under `src/engine/rules`. Each rule includes:
   - `id`, `description`, `match` conditions and a `consequence` template.
 - Add new rules conservatively and include test JSON examples.

Testing & validation
 - Use `curl` or the frontend to exercise `/explain`.
 - The engine is deterministic — repeat the same payload to verify identical results.

Troubleshooting
 - If the server fails to start, check logs for missing environment variables or port conflicts.
 - The in-memory cache is per-process; restart clears cache.

Contributing
 - Add parser adapters for new log formats under `src/engine`.
 - Keep rule descriptions explicit and include sample inputs with PRs.

License
 - MIT
