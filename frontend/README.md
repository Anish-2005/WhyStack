<!-- prettier-ignore -->
## 🚀 WhyStack Frontend — Vite + React


What this part does
 - Provides an interactive editor to paste structured JSON (logs, metrics, traces).
 - Calls the backend `/explain` endpoint and visualizes the returned explanation.
 - Shows Summary, Ranked Causes, Evidence snippets, and the Audit trail of fired rules.

Key files
 - `src/main.tsx` — SPA entry and routing (`/`, `/docs`, `/rules`, `/about`).
 - `src/components/EditorPanel.tsx` — JSON editor and explain button.
 - `src/components/ExplanationPanel.tsx` — UI rendering of results, evidence and audit.
 - `src/utils/api.ts` — API helper using `VITE_BACKEND_URL` or `/explain` fallback.
 - `vercel.json` — optional Vercel rewrites for SPA and API proxy.

Quick start (dev)
```powershell
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

Build (static)
```powershell
cd frontend
npm run build
# `dist/` will contain the static site to deploy
```

Environment
 - `VITE_BACKEND_URL` (optional): full URL to the deployed backend (e.g. https://whystack.onrender.com). If omitted, the app uses `/explain`.

Deployment notes
 - Deploy the `dist/` folder to Vercel, Netlify, or any static host.
 - If using Vercel, `frontend/vercel.json` contains recommended `rewrites` to proxy `/explain` to the live backend and to fallback SPA routes to `index.html`.

Developer tips
 - The editor falls back to a simple textarea if Monaco fails to load.
 - To test end-to-end locally, run the backend (see `../backend/README.md`) and set `VITE_BACKEND_URL` to `http://localhost:3000` before starting dev server.

Contributing UI changes
 - Add components under `src/components` and update routes in `src/main.tsx`.
 - Keep UI behavior deterministic: avoid client-side heuristics that hide audit details.

---

For more backend internals, see `../backend/README.md`.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
