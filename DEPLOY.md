# Deploy em produção — Vercel (web) + Railway (API/DB)

Arquitetura recomendada:

```
Usuário ──▶ Vercel (apps/web, Next.js) ──RSC──▶ PostgreSQL (Railway)
                    │
                    └─fetch──▶ Railway (apps/api, Fastify Docker) ──▶ PostgreSQL
```

## 0. Pré-requisitos

- Repo publicado no GitHub
- Contas em vercel.com e railway.app (free tier resolve para começar)

## 1. Railway — banco + API

### 1.1 Criar projeto e Postgres
1. New Project → **Deploy from GitHub repo** → selecione o repo
2. No projeto: **+ New → Database → PostgreSQL**
3. No serviço do Postgres → aba **Settings → Networking → Generate Domain** (TCP proxy pública). Copie como `DATABASE_URL_PUBLIC`.
4. A connection string interna (para a API) aparece em **Variables** do Postgres (`DATABASE_URL`).

### 1.2 Serviço da API (Docker)
1. **+ New → GitHub Repo** de novo → mesmo repo
2. Settings → **Source**: aponte Root Directory = `/` e **Builder = Dockerfile**, Dockerfile path = `apps/api/Dockerfile`
3. Aba **Variables**, adicione:

| Variável | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (referência interna) |
| `WEB_ORIGIN` | `https://SEU-WEB.vercel.app` |
| `SESSION_SECRET` | `openssl rand -hex 24` |
| `ADMIN_TOKEN` | `openssl rand -hex 16` |
| `CROSS_SITE_COOKIES` | `true` |
| `LOG_LEVEL` | `info` |

4. Settings → Networking → **Generate Domain** (pública). Essa é a `NEXT_PUBLIC_API_URL` do passo 2.

### 1.3 Migrar + popular

**Via GitHub Actions (recomendado):**

1. Adicione o secret `PROD_DATABASE_URL` no repo (**Settings → Secrets and variables → Actions → New repository secret**) com a `DATABASE_URL_PUBLIC` do Postgres.
2. Rode **Actions → Seed produção → Run workflow**. O workflow aplica migrations e roda o seed (upsert idempotente) contra o banco de produção.

**Manual (alternativa)** — na sua máquina, contra a URL **pública** do Postgres:

```bash
export DATABASE_URL="<DATABASE_URL_PUBLIC>"
pnpm db:migrate && pnpm db:seed
```

> ⚠️ Guarde `ADMIN_TOKEN` — é o login do painel `/admin`.

## 2. Vercel — web

1. vercel.com → Add New → Project → importe o repo
2. **Root Directory**: `apps/web`
   - Framework Preset: Next.js (detectado)
   - Build/Install: deixar padrão (o monorepo pnpm é detectado; `postinstall` do database roda `prisma generate`)
3. Environment Variables (Production):

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `DATABASE_URL_PUBLIC` (com `?sslmode=require`) |
| `NEXT_PUBLIC_API_URL` | `https://SEU-API.up.railway.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://SEU-WEB.vercel.app` |
| `NEXT_PUBLIC_GITHUB_URL` | URL do seu repo |

4. Deploy. Depois, volte ao Railway e confirme que `WEB_ORIGIN` bate com o domínio final da Vercel (se mudar, atualize e redeploy da API).

## 3. Alternativa: tudo na Railway

Se preferir um único provedor: crie também um serviço web com Builder=Dockerfile path `apps/web/Dockerfile`, variáveis `NEXT_PUBLIC_*` + `SITE_URL`, domínio público — descartando a Vercel. Simples, porém sem edge network/ISR otimizada.

## 4. Pós-deploy (checklist)

```bash
curl https://SEU-API.up.railway.app/health/detailed     # database: up
curl -s https://SEU-WEB.vercel.app/api/v1/stats          # contadores reais
open https://SEU-WEB.vercel.app/admin                    # login com ADMIN_TOKEN
```

- [ ] Gerar instalação funciona no navegador público
- [ ] Compartilhar kit gera link `/s/<code>` acessível
- [ ] Admin autentica (cookie cross-site exige `CROSS_SITE_COOKIES=true`)
- [ ] Rate limits ativos (opcional: adicione Redis na Railway + `REDIS_URL`)

## 5. Custos estimados (início)

| Item | Free tier cobre? |
|---|---|
| Vercel Hobby | ✅ (uso não comercial) |
| Railway Trial/$5 | Postgres + API cabem no trial inicial |
| Domínio próprio | ~R$40/ano (registrar) + apontar CNAME |

## 6. Segurança em produção

- `SESSION_SECRET`/`ADMIN_TOKEN` fortes e únicos (nunca os do `.env.example`)
- `WEB_ORIGIN` restrito ao domínio real (CORS)
- Backups: Railway Postgres → enable daily backups (Settings → Backups)
- Ative Redis quando o tráfego crescer (rate limit distribuído)
