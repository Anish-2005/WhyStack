Explain My System Like I'm 5 — whystack

`whystack` is a deterministic reasoning engine that converts structured logs and metrics (JSON) into plain-English explanations of system failures.

Quick start:

- Install dependencies: `npm install`
- Run: `npm start`
- Open: http://localhost:3000 and paste your JSON dataset into the editor, then click Explain.

This workspace contains a minimal, explainable backend (Node + Express) and a small static frontend for interactive testing.

See the `src/` folder for the rule engine and `public/` for the UI.

Project layout:

- `src/` — backend code and engine modules
- `public/` — static frontend (index.html + app.js)
- `package.json` — Node scripts and dependencies

Purpose:

This project is intentionally small and deterministic. No ML, no black boxes — just rule-based causal inference and clear explanations.
# WhyStack