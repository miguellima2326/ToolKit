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

      <Section id="cli" title="CLI — toolkit (em breve)">
        <p>
          A CLI open source acompanhará o site para uso em terminal:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-bg-subtle p-4 font-mono text-xs leading-relaxed"><code>{`toolkit search chrome
toolkit install chrome discord vscode git
toolkit profile developer
toolkit upgrade          # delega para winget/apt/dnf/pacman/brew
toolkit doctor           # diagnostica SO, gerenciadores e rede
toolkit driver scan      # hardware local (opt-in)`}</code></pre>
        <p className="mt-3 rounded-lg border border-border bg-card p-3 text-xs text-muted">
          Status: <strong className="text-fg">Fase 2 do roadmap</strong>. Esta página será atualizada com
          instruções de instalação quando o primeiro binário assinado for publicado.
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
