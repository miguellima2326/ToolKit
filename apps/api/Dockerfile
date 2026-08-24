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
# postinstall de @toolkit/database roda `prisma generate`, que precisa do schema
# já presente neste estágio (só os package.json foram copiados até aqui).
COPY packages/database/prisma packages/database/prisma
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter @toolkit/database exec prisma generate \
  && pnpm -r typecheck

FROM node:22-alpine AS runtime
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages ./packages
COPY apps/api/package.json apps/api/tsconfig.json ./apps/api/
COPY apps/api/src ./apps/api/src
# A API roda TypeScript direto via tsx (sem dist compilado), então os pacotes do
# workspace que ela importa em runtime precisam do código-fonte, não só do
# package.json (que é tudo que o estágio deps copiou).
COPY packages/shared/src ./packages/shared/src
COPY packages/database/src ./packages/database/src
COPY packages/database/prisma ./packages/database/prisma
COPY packages/catalog/src ./packages/catalog/src
COPY packages/install-generator/src ./packages/install-generator/src
EXPOSE 4000
WORKDIR /app/apps/api
# Roda o tsx direto (não "pnpm start"): o estágio runtime não tem
# pnpm-workspace.yaml/package.json raiz, então "pnpm start" tentava
# resolver o workspace a partir daqui e falhava (@toolkit/tsconfig
# não encontrado). "start" só faz "tsx src/server.ts" mesmo.
CMD ["node_modules/.bin/tsx", "src/server.ts"]
