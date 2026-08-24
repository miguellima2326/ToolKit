# Política de Segurança

## Reportando uma vulnerabilidade

Envie um advisory privado via GitHub Security Advisories ou escreva para **security@toolkit.dev**. Comprometemo-nos a responder em até 72 horas. Pedimos que não divulgue publicamente até a correção.

## Escopo

- apps/api: geração de scripts, admin, rate limits
- apps/web: SSR, middleware, cookies
- packages/install-generator: templates de shell

## Garantias do produto

1. Scripts são gerados **apenas** a partir de registros internos validados; entrada de usuário nunca interpola comandos.
2. Package IDs passam por allowlist regex por método antes de qualquer uso em shell.
3. Apps sem método automático seguro tornam-se instruções manuais com link oficial.
4. O Toolkit não hospeda binários de terceiros; drivers apontam somente para fabricantes oficiais.
5. Selos como “Fonte oficial” aparecem exclusivamente quando há verificação real registrada (`Verification.lastCheckedAt`).

## Práticas do repositório

- Dependabot/Renovate, `pnpm audit` e gitleaks no CI.
- Lockfile commitado; builds reprodutíveis.
- Secret scanning obrigatório; nenhum segredo no frontend.
