# WhyStack frontend

The frontend is a React and TypeScript single-page app. It provides a JSON editor, submits telemetry to the backend, and displays deterministic causes with signal evidence.

## Run locally

Use Node.js 24, then:

~~~powershell
npm ci
npm run dev
~~~

Open http://localhost:5173. Vite proxies /explain and /rules to http://localhost:3000; start the backend separately. Set VITE_BACKEND_URL only when you want requests to use a different API origin directly.

## Checks

~~~powershell
npm test
npm run lint
npm run build
~~~

The build writes static assets to dist/. Monaco is loaded lazily and falls back to a textarea while loading. The editor accepts an event array or {"logs": [...]}, with 1–5,000 events.

## Deployment

Deploy from this directory to Vercel. The rewrites in vercel.json proxy /explain and /rules to the hosted API and route app paths to index.html. If the backend rejects the proxied origin, add the frontend’s exact origin to its CORS_ORIGINS setting. For a one-container deployment, use docker compose from the repository root.

## Source map

- src/App.tsx — analysis flow and loading/error state.
- src/components/ — editor, navigation, and result views.
- src/pages/ — documentation, rules, about, and not-found routes.
- src/utils/api.ts — typed HTTP client and user-facing API errors.
- src/utils/input.ts — input parsing and client-side event-count checks.
- src/utils/*.test.ts — input and API tests.
