# syntax=docker/dockerfile:1

# target: common

FROM node:22-bookworm AS common

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/api/package.json ./packages/api/
COPY packages/agent/package.json ./packages/agent/
COPY packages/dashboard/package.json ./packages/dashboard/

RUN npm ci

# target: api (builder)

FROM common AS api-builder

COPY packages/api ./packages/api

RUN npm -w @pinguin/api run build

# target: dashboard (builder)

FROM common AS dashboard-builder

COPY packages/dashboard ./packages/dashboard

COPY --link --from=api-builder /app/packages/api/dist/main.d.ts ./packages/api/dist/

RUN npm -w @pinguin/dashboard run build

# target: api (runtime)

FROM node:22-bookworm-slim AS api

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/api/package.json ./packages/api/

RUN <<EOF
set -eux
npm -w @pinguin/api ci --omit=dev
rm -rf /root/.cache
rm -rf /root/.npm
EOF

COPY --link --from=api-builder /app/packages/api/dist/main.js ./packages/api/dist/
COPY --link --from=dashboard-builder /app/packages/dashboard/dist ./packages/dashboard/dist

ENV NODE_ENV=production \
    PORT=80

EXPOSE 80

CMD [ "/usr/bin/env", "node", "/app/packages/api" ]

# target: agent (builder)

FROM common AS agent-builder

COPY packages/agent ./packages/agent

COPY --link --from=api-builder /app/packages/api/dist/main.d.ts ./packages/api/dist/

RUN npm -w @pinguin/agent run build

# target: agent (runtime)

FROM node:22-bookworm-slim AS agent

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/agent/package.json ./packages/agent/

RUN <<EOF
set -eux
apt-get update
apt-get install --no-install-recommends -y \
        iputils-ping
rm -rf /var/lib/apt/lists/*
npm -w @pinguin/agent ci --omit=dev
rm -rf /root/.cache
rm -rf /root/.npm
EOF

COPY --link --from=agent-builder /app/packages/agent/dist/main.js ./packages/agent/dist/

CMD [ "/usr/bin/env", "node", "/app/packages/agent" ]
