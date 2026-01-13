<!-- prettier-ignore -->
## 🎯 WhyStack — Deterministic Explainable RCA Engine

	____  _  _  _   _   _           _            _
 |  _ \| || || | | | | | __ _  __| | ___  _ __| | __
 | |_) | || || |_| | | |/ _` |/ _` |/ _ \| '__| |/ /
 |  __/|__   _|  _  | | (_| | (_| | (_) | |  |   <
 |_|       |_| |_| |_|_|\__,_|\__,_|\___/|_|  |_|\_\

WhyStack ingests structured logs, metrics and traces and produces human-friendly, deterministic explanations of incidents — no ML, no randomness.

Badges
 - Tech: Node · Express · Vite · React · TypeScript
 - Live backend: https://whystack.onrender.com

What the app does (big-picture)
 - Accepts structured event streams (JSON logs, metrics, traces).
 - Normalizes and extracts signals from the payload.
 - Applies a deterministic rule engine to match patterns and infer causal chains.
 - Ranks candidate root causes and generates concise, traceable explanations.
 - Returns an explanation object and an audit trail showing which rules fired.

Visual flow (text diagram)

 Client Editor  --->  Backend /explain  --->  Parser  --->  Signal Extractor
			|                                         |              |
			v                                         v              v
	(JSON input)  <---  Explanation <- Rule Engine <- Ranking <- Trace & Evidence

Key outputs you will see in the UI
 - Summary: one-sentence root-cause statement.
 - Causes: ranked list with confidence-like scores (deterministic ranking).
 - Evidence: snippets from logs/metrics that matched rules.
 - Audit: which rules matched and why (traceable rule IDs).

Why it's useful
 - Fast incident triage without opaque models.
 - Fully auditable reasoning for postmortems and compliance.
 - Lightweight enough to run locally or as a small hosted service.

Quick start (developer)
 1. Backend: open `backend/` and run:

```powershell
cd backend
npm install
npm run dev
```

2. Frontend (dev): open `frontend/` and run:

```powershell
cd frontend
npm install
npm run dev
```

3. Use the UI: open http://localhost:5173 (Vite) or your backend preview and paste JSON, then click Explain.

Project layout (current)
 - `backend/` — Express server, rule engine (`engine/*`), routes
 - `frontend/` — Vite + React SPA, editor + explanation panels
 - `.env` — frontend env (optional `VITE_BACKEND_URL`)

Deployment notes
 - Backend is deployed at: https://whystack.onrender.com
 - Frontend can be deployed to Vercel; `frontend/vercel.json` includes rewrites so `/explain` is proxied to the Render backend and SPA routes fallback to `index.html`.

Guiding principles
 - Deterministic: same input ⇒ same explanation every time.
 - Explainable: include evidence and rule IDs for every conclusion.
 - Minimal: small dependency surface, easy to audit.

Contribute
 - Add rules under `backend/src/engine/rules` (follow existing rule format).
 - Add parser adapters if you have new log formats.

License & contact
 - MIT
 - Questions / PRs: open an issue in this repo.

---

For more details about source layout and engine internals, see the `backend/src/engine` folder and the `frontend/src` UI components.
