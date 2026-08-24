# Arquitetura

## Visão geral

```
┌─────────────┐     ┌──────────────────┐
│  apps/web   │────▶│  apps/api (v1)   │──▶ PostgreSQL (Prisma)
│  Next.js RSC│     │  Fastify + Zod   │──▶ Redis (opcional)
└─────────────┘     └──────────────────┘
       │                    ▲
       │  leitura direta    │ resolve slugs → registros validados
       └── Postgres ────────┴── packages/install-generator
```

**Decisão-chave:** o web lê o catálogo diretamente do Postgres via Server Components (uma consulta, zero hop HTTP) enquanto **toda operação sensível** — geração de scripts, criação de kits compartilhados, admin — passa pela API, que concentra validação Zod, allowlist de pacotes, rate limiting e auditoria.

## Geração de scripts

1. Cliente envia `{ slugs[], os, distro?, format? }` — **nunca comandos**.
2. API resolve os slugs contra `AppPackage` (fonte da verdade).
3. `selectPackages()` aplica preferências por distro (apt→flatpak→snap etc.), filtra `status=verified`, valida IDs com allowlist regex e separa itens automáticos/manuais/indisponíveis.
4. Geradores produzem PS1/BAT/sh determinísticos; falhas individuais não abortam o script.
5. Resposta inclui `steps[]` (preview), `manual[]` (links oficiais) e métricas — exibidas antes de copiar/baixar.

## Modelo de dados (Prisma)

- `App` → `AppPackage[]` (método+ID+repositório+fonte+status+lastCheckedAt)
- `Verification` (histórico de checagens: sha256, assinatura, resultado)
- `Category`, `Vendor`, `Driver`, `HardwareVendor`
- `Collection`/`CollectionItem` (perfis prontos)
- `SharedToolkit` (code nanoid + slugs jsonb — funciona sem login)
- `Contribution` (fila de curadoria), `AuditLog`, `ScriptStat`

Índices: slug únicos, `[status,popularity]`, trigram GIN em `name`/tags, FTS em `name||tagline`.

## Segurança em camadas

| Camada | Controle |
|---|---|
| Entrada | Zod em toda borda; slugs regex; limite de 50 itens |
| Shell | Allowlist por método (`shared/allowlist.ts`) |
| HTTP | Helmet/HSTS, CORS restrito por origem, rate limit global+por rota |
| Admin | Token comparado em tempo constante → cookie HttpOnly HMAC, TTL 30min |
| Logs | Pino com redação de authorization/cookie/token; request IDs |
| Web | CSP (produção), headers anti-fingerprinting, sem hotlink externo |

## Atualização do catálogo (roadmap fase 2)

Workers BullMQ consultam winget/homebrew/flathub/github-releases periodicamente, gravam `Verification` e propõem novas versões. Mudanças suspeitas movem o pacote para `pending_review`; nada substitui automaticamente um pacote verificado.

## Disponibilidade

Redis é opcional: rate limit cai para memória local e `/health/detailed` reporta `degraded` em vez de derrubar o serviço. Falhas de busca retornam sugestões "did you mean" via trigram mesmo sem índice ideal.
