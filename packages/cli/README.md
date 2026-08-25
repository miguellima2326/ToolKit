# @toolkit/cli

CLI oficial do Toolkit — busca, instala e gerencia apps direto do terminal, consumindo a API pública `/api/v1` (a mesma que o site usa).

## Rodando localmente (sem publicar)

```bash
pnpm --filter @toolkit/cli build
node packages/cli/dist/index.js --help

# ou em modo dev, sem build:
pnpm --filter @toolkit/cli dev -- --help
```

## Configuração (opcional)

- `TOOLKIT_API_URL` — default `https://toolkit-is5v.onrender.com`. Aponte para `http://localhost:4000` em dev ou para uma instância self-hosted.
- `TOOLKIT_SITE_URL` — default `https://tool-kit-web-liart.vercel.app`. Usado só para montar o link do `toolkit save`.

## Comandos

```
toolkit search <termo>            Busca apps, categorias e coleções
toolkit info <slug>               Detalhes de um app (descrição, licença, métodos de instalação)
toolkit install <slugs...>        Gera o script de instalação, mostra e pede confirmação antes de executar
  -f, --format <ps1|bat|sh>       formato do script (default: conforme o SO detectado)
  -y, --yes                       pula a confirmação
  --dry-run                       só mostra o script, nunca executa
toolkit save <slugs...>           Salva uma lista de apps e gera código/link compartilhável
  -t, --title <titulo>
toolkit profile <code>            Mostra um toolkit salvo e oferece instalar tudo
toolkit doctor                    Diagnóstico local: SO, gerenciadores de pacote, conectividade com a API
```

`toolkit install` sempre mostra o script completo e o resumo (automático/manual/indisponível) antes de perguntar se deve executar — a CLI nunca roda nada sem confirmação, a menos que `--yes` seja passado explicitamente.

## Fora do escopo desta versão

- `toolkit upgrade` e `toolkit driver scan` (roadmap futuro).
- Publicação no npm — hoje o pacote é `private`, só roda via workspace (`pnpm --filter @toolkit/cli`).
