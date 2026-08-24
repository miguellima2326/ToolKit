# Toolkit

**Your apps. Your system. One place.**
*Tudo que seu computador precisa. Em um só lugar.*

Plataforma web para encontrar, selecionar e instalar **aplicativos, runtimes, utilitários e drivers** em Windows, Linux e macOS — pensada para quem acabou de formatar o PC ou prepara máquinas novas com frequência.

```
Selecionar apps  →  Toolkit identifica o sistema  →  Gerar instalação
                 →  Copiar comando                →  Executar
```

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router, RSC), React 19, Tailwind CSS v4, TanStack Query |
| API | Fastify 5 + Zod, REST versionada em `/api/v1` |
| Banco | PostgreSQL + Prisma (migrations + seed) |
| Cache/Rate limit | Redis opcional (degrada para memória) |
| Monorepo | pnpm workspaces + Turborepo |
| Testes | Vitest (unit + integração), Playwright (E2E) |
| CI | GitHub Actions: lint · typecheck · test · build · audit · secret scan |

## Estrutura

```
apps/
  web/                        # Next.js (SSR lê o Postgres direto p/ performance)
  api/                        # Fastify — geração de scripts, busca, share, admin
packages/
  shared/                     # Schemas Zod, tipos, allowlist de package IDs
  database/                   # Prisma schema, migrations, seed
  catalog/                    # Dataset curado (74 apps, drivers, coleções)
  install-generator/          # Geradores PS1/BAT/sh + seleção por distro
```

## Rodando localmente

Pré-requisitos: Node 22+, pnpm 9+, Docker.

```bash
cp .env.example .env                  # edite SESSION_SECRET e ADMIN_TOKEN
pnpm install

# infraestrutura
docker compose up -d                  # postgres :5432 + redis :6379

# banco
pnpm db:migrate                       # prisma migrate deploy
pnpm db:seed                          # catálogo inicial (idempotente)

# apps (terminais separados ou `turbo dev`)
pnpm --filter @toolkit/api dev        # http://localhost:4000
pnpm --filter web dev                 # http://localhost:3000
```

Produção/self-hosting:

```bash
SESSION_SECRET=... ADMIN_TOKEN=... docker compose -f docker-compose.prod.yml up --build
```

## Scripts gerados — modelo de segurança

- O servidor **nunca** recebe comandos do usuário: a entrada é uma lista de *slugs* que resolve contra registros validados no banco (`AppPackage`).
- IDs passam por allowlist regex por método antes de entrar no shell (`packages/shared/src/allowlist.ts`).
- Pacotes sem método automático seguro aparecem como **passo manual** com link oficial — nunca são forçados.
- Statuses de curadoria: `verified` · `pending_review` · `deprecated` · `blocked`.
- O script completo é exibido **antes** de copiar/baixar, com resumo de falhas e continuação por app.

## API v1 (resumo)

```
GET  /api/v1/apps?q=&os=&category=&license=&method=&sort=
GET  /api/v1/apps/:slug
GET  /api/v1/search?q=
GET  /api/v1/categories | /collections | /collections/:slug | /drivers | /stats
POST /api/v1/toolkits            → { code }
GET  /api/v1/toolkits/:code
POST /api/v1/install-script      → { script, steps[], manual[], autoCount }
POST /api/v1/suggestions         → curadoria pendente
GET  /health · /health/detailed
```

Rate limits: search 120/min · install-script 30/min · toolkits 10/min · suggestions 5/h · admin login 8/5min.
Admin: `POST /api/v1/admin/login { token }` emite cookie HttpOnly assinado (HMAC); rotas `/admin/*` exigem sessão válida server-side.

## Roadmap

- **MVP (este repositório):** homepage, catálogo+filtros, busca universal (⌘K), página de app, detecção de OS mutável, Meu Toolkit (localStorage), geradores Winget/Linux/Homebrew, compartilhamento por link+QR, dark/light, i18n pt-BR/en-US, admin básico, drivers oficiais, Docker, CI, testes.
- **Fase 2:** CLI `toolkit` (search/install/profile/upgrade/doctor/driver scan), workers BullMQ de atualização de versões (winget/homebrew/flathub/github releases), contas (Google/GitHub/magic link) com favoritos e histórico, hardware scanner opt-in, PWA offline, Meilisearch/Typesense.
- **Fase 3:** Toolkit Teams (onboarding empresarial), API pública, plugins.

## Testes

```bash
pnpm --filter @toolkit/shared test             # allowlist de pacotes
pnpm --filter @toolkit/install-generator test  # scripts gerados + injeção
pnpm --filter @toolkit/api test                # rotas críticas (inject)
cd apps/web && pnpm e2e                        # Playwright (requer stack rodando)
```

## Contribuindo / Segurança

Veja [DEPLOY.md](DEPLOY.md) · [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) e [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Sugira apps pelo botão **“Sugerir aplicativo”** — toda entrada passa por revisão humana.

MIT © Toolkit
