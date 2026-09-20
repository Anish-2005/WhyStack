FROM node:24-alpine AS frontend-build

WORKDIR /workspace/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:24-alpine AS backend-dependencies

WORKDIR /workspace/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:24-alpine AS runtime

ENV NODE_ENV=production \
    PORT=3000 \
    TRUST_PROXY_HOPS=0

WORKDIR /app/backend
COPY --from=backend-dependencies --chown=node:node /workspace/backend/node_modules ./node_modules
COPY --chown=node:node backend/src ./src

WORKDIR /app
COPY --from=frontend-build --chown=node:node /workspace/frontend/dist ./frontend/dist

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:3000/healthz').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["node", "/app/backend/src/server.js"]
