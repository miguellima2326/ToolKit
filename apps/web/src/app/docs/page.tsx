import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentação',
  description: 'Documentação da API v1, CLI Toolkit e guias de contribuição.'
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Documentação</h1>

      <Section id="api" title="API v1">
        <p>Todos os endpoints ficam sob <code>/api/v1</code> e retornam JSON. Rate limits se aplicam por IP.</p>
        <Endpoint method="GET" path="/api/v1/apps?q=&os=&category=&license=&method=&sort=&page=" desc="Lista paginada do catálogo." />
        <Endpoint method="GET" path="/api/v1/apps/:slug" desc="Detalhe completo, incluindo métodos de instalação." />
        <Endpoint method="GET" path="/api/v1/search?q=chrome" desc="Busca universal (apps, categorias, coleções) com fuzzy matching." />
        <Endpoint method="GET" path="/api/v1/categories · /collections · /drivers · /stats" desc="Taxonomia e métricas públicas." />
        <Endpoint method="POST" path="/api/v1/toolkits" desc="Cria kit compartilhável. Body: { slugs: string[], title? }. Retorna code." />
        <Endpoint method="GET" path="/api/v1/toolkits/:code" desc="Resolve um kit compartilhado." />
        <Endpoint method="POST" path="/api/v1/install-script" desc='Gera script de instalação. Body: { slugs, os, distro?, format? } → { script, steps, manual[] }.' />
        <Endpoint method="POST" path="/api/v1/suggestions" desc="Sugestão de app para curadoria (revisão obrigatória)." />
        <Endpoint method="GET" path="/health · /health/detailed" desc="Liveness e readiness." />
      </Section>

      <Section id="cli" title="CLI — toolkit">
        <p>
          Tudo que dá pra fazer no site também dá pra fazer no terminal: buscar apps, ver detalhes e gerar/rodar
          o script de instalação sem abrir o navegador. Útil pra automatizar a preparação de várias máquinas ou
          pra quem já vive no terminal.
        </p>
        <p>Requer Node.js 20.17 ou mais recente instalado (<code>node -v</code> pra conferir).</p>

        <h3 className="pt-2 text-sm font-semibold text-fg">Instalação</h3>
        <pre className="overflow-x-auto rounded-lg bg-bg-subtle p-4 font-mono text-xs leading-relaxed"><code>{`npm install -g @migueltoolkitdev/toolkit-cli
# ou, sem instalar nada:
npx @migueltoolkitdev/toolkit-cli --help`}</code></pre>
        <p>O binário instalado se chama <code>toolkit</code>.</p>

        <h3 className="pt-2 text-sm font-semibold text-fg">Comandos</h3>
        <Command cmd="toolkit search <termo>" desc="Busca apps, categorias e coleções que batem com o termo — a mesma busca do ⌘K do site." />
        <Command cmd="toolkit info <slug>" desc="Mostra descrição completa, licença, site oficial e todos os métodos de instalação disponíveis (winget, apt, brew etc.) para um app." />
        <Command
          cmd="toolkit install <slugs...>"
          desc="Gera o script de instalação para os apps informados, detectando automaticamente seu SO (e distro, no Linux). Mostra o resumo (quantos automáticos, quantos manuais) e o script inteiro antes de perguntar se deve rodar."
          flags={[
            { flag: '-f, --format <ps1|bat|sh>', desc: 'força um formato específico (default: conforme o SO detectado)' },
            { flag: '-y, --yes', desc: 'pula a confirmação e executa direto' },
            { flag: '--dry-run', desc: 'só mostra o script, nunca executa' }
          ]}
        />
        <Command
          cmd="toolkit save <slugs...>"
          desc="Salva uma lista de apps no servidor e devolve um código curto + link, pra compartilhar ou reinstalar em outra máquina depois."
          flags={[{ flag: '-t, --title <titulo>', desc: 'dá um nome ao toolkit salvo' }]}
        />
        <Command cmd="toolkit profile <code>" desc="Recupera um toolkit salvo pelo código (seu ou de outra pessoa) e oferece instalar tudo de uma vez." />
        <Command cmd="toolkit doctor" desc="Diagnóstico local: qual SO foi detectado, quais gerenciadores de pacote (winget, apt, dnf, pacman, flatpak, snap, brew) estão disponíveis no PATH, e se a API do Toolkit está acessível." />

        <h3 className="pt-2 text-sm font-semibold text-fg">Exemplo de uso</h3>
        <pre className="overflow-x-auto rounded-lg bg-bg-subtle p-4 font-mono text-xs leading-relaxed"><code>{`$ toolkit search chrome
Apps
  - google-chrome — Google Chrome — Navegador rápido e amplamente compatível.

$ toolkit install google-chrome discord vscode
3 automático(s) · 0 manual(is) · 0 indisponível(is)

Script (toolkit-instalar-linux.sh)
#!/usr/bin/env bash
...

Executar 3 passo(s) automaticamente agora? (Y/n) y`}</code></pre>

        <p className="rounded-lg border border-border bg-card p-3 text-xs text-muted">
          Status: <strong className="text-fg">v1 publicada</strong>. <code>toolkit upgrade</code> (delega para
          winget/apt/dnf/pacman/brew) e <code>toolkit driver scan</code> (hardware local, opt-in) ainda estão no
          roadmap.
        </p>
      </Section>

      <Section id="security" title="Segurança">
        <p>
          Política de divulgação, modelo de ameaças dos scripts gerados e processo de verificação de pacotes
          estão documentados na{' '}
          <a href="/security" className="text-primary hover:underline">
            página de segurança
          </a>{' '}
          e no SECURITY.md do repositório.
        </p>
      </Section>

      <Section id="contributing" title="Contribuir">
        <p>
          Sugira aplicativos pelo botão <a href="/suggest" className="text-primary hover:underline">“Sugerir aplicativo”</a>.
          Contribuições de código seguem CONTRIBUTING.md no repositório: pnpm + Turborepo, migrations Prisma,
          testes Vitest e CI com checks obrigatórios.
        </p>
      </Section>
    </div>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-20">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-muted [&_strong]:text-fg">{children}</div>
    </section>
  );
}

function Command({
  cmd,
  desc,
  flags
}: {
  cmd: string;
  desc: string;
  flags?: { flag: string; desc: string }[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <code className="font-mono text-xs font-bold text-fg">{cmd}</code>
      <p className="mt-1 text-xs">{desc}</p>
      {flags && flags.length > 0 && (
        <ul className="mt-2 space-y-1 border-t border-border pt-2">
          {flags.map((f) => (
            <li key={f.flag} className="text-xs">
              <code className="text-primary">{f.flag}</code> — {f.desc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="rounded border border-primary/40 bg-primary-soft px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
          {method}
        </span>
        <code className="font-mono text-xs text-fg">{path}</code>
      </div>
      <p className="mt-1 text-xs">{desc}</p>
    </div>
  );
}
