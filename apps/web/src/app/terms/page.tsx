import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos',
  description: 'Termos de uso do Toolkit.'
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Termos de uso</h1>
      <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-muted [&_strong]:text-fg">
        <p>
          <strong>O que é:</strong> o Toolkit é um catálogo e gerador de scripts de instalação. Não somos
          afiliados aos desenvolvedores listados; marcas pertencem aos respectivos donos.
        </p>
        <p>
          <strong>Scripts gerados:</strong> revise antes de executar. Use por sua conta e risco — os comandos
          utilizam apenas fontes oficiais validadas, mas a execução acontece na sua máquina.
        </p>
        <p>
          <strong>Licenças dos aplicativos:</strong> cada aplicativo tem sua própria licença (indicada na
          página). Cabe a você respeitá-la.
        </p>
        <p>
          <strong>Disponibilidade:</strong> o serviço é oferecido “no estado em que se encontra”, com esforço
          razoável de disponibilidade documentado em /status.
        </p>
      </div>
    </div>
  );
}
