# Contribuindo com o Toolkit

Obrigado por querer ajudar! O objetivo é manter o catálogo **pequeno e confiável** — qualidade acima de quantidade.

## Como sugerir um aplicativo

1. Use o botão **“Sugerir aplicativo”** no site (cria uma entrada `pending` para curadoria) ou abra uma issue com o template.
2. Informe sempre o **site oficial** e, se souber, os IDs: winget, Homebrew, Flatpak.
3. Nunca abra PR adicionando apps direto ao seed sem validação dos IDs.

## Validando IDs de pacote (curadoria)

```bash
winget search --id <ID>            # Windows
brew info <cask|formula>           # macOS
flatpak search <id>                # Linux
```

Regras:
- ID confirmado → `status: verified`
- ID provável mas não confirmado → `pending_review` + note explicando
- App descontinuado → `deprecated`; malicioso/quebrado → `blocked`

## Desenvolvimento

```bash
pnpm install
docker compose up -d
pnpm db:migrate && pnpm db:seed
turbo dev
```

Checklist de PR:
- [ ] `turbo lint` e `turbo typecheck` passando
- [ ] Testes novos/atualizados (`packages/*` e `apps/api`)
- [ ] Sem comentários desnecessários, sem logs com dados sensíveis
- [ ] Mudanças de schema via migration (`prisma migrate dev`), nunca `db push` em produção
