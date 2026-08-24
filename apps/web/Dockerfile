FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY packages/database/package.json packages/database/
COPY packages/catalog/package.json packages/catalog/
COPY packages/install-generator/package.json packages/install-generator/
COPY packages/tsconfig/package.json packages/tsconfig/
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter @toolkit/database exec prisma generate && pnpm --filter web build

FROM node:22-alpine AS runtime
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S toolkit && adduser -S toolkit -G toolkit
COPY --from=build --chown=toolkit:toolkit /app/apps/web/.next/standalone ./
COPY --from=build --chown=toolkit:toolkit /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=toolkit:toolkit /app/apps/web/public ./apps/web/public
USER toolkit
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
