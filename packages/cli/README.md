# @migueltoolkitdev/toolkit-cli

CLI oficial do Toolkit — busca, instala e gerencia apps direto do terminal, consumindo a API pública `/api/v1` (a mesma que o site usa).

## Instalação

```bash
npm install -g @migueltoolkitdev/toolkit-cli
# ou sem instalar:
npx @migueltoolkitdev/toolkit-cli --help
```

(o nome "toolkit-cli" sem escopo foi recusado pelo registro do npm por ser parecido demais com um pacote já existente — "tool-kit-cli")

O binário instalado se chama `toolkit`.

## Desenvolvendo no monorepo

```bash
pnpm --filter @migueltoolkitdev/toolkit-cli build
node packages/cli/dist/index.js --help

# ou em modo dev, sem build:
pnpm --filter @migueltoolkitdev/toolkit-cli dev -- --help
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

## Build

O pacote publicado é um único arquivo (`dist/index.js`, bundle CJS via tsup) sem dependências de runtime — todas as libs (commander, @clack/prompts, picocolors, @toolkit/shared) são embutidas no build.

## Fora do escopo desta versão

- `toolkit upgrade` e `toolkit driver scan` (roadmap futuro).
