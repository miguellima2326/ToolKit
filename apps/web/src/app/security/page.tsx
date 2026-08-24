import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Segurança e transparência',
  description: 'Como o Toolkit verifica pacotes, gera scripts e protege seus dados.'
};

const pillars = [
  {
    title: 'De onde vêm os pacotes',
    text: 'Todo aplicativo do catálogo referencia IDs oficiais dos gerenciadores (winget, Homebrew, Flathub, APT, DNF, Pacman, Snap) ou páginas de download do fabricante. Não hospedamos binários de terceiros.'
  },
  {
    title: 'Como os apps são verificados',
    text: 'Cada pacote tem status de curadoria: verified, pending_review, deprecated ou blocked. IDs não confirmados ficam visíveis como "aguardando verificação" e nunca entram em scripts automáticos.'
  },
  {
    title: 'Como os scripts são gerados',
    text: 'Os scripts são montados no servidor a partir exclusivamente dos registros internos validados. Nenhum texto enviado por usuários é interpolado em comandos — a entrada é sempre uma lista de slugs que resolve contra o banco.'
  },
  {
    title: 'Quais dados coletamos',
    text: 'O site funciona sem login. Sua seleção fica no localStorage. Contadores agregados (scripts gerados, kits compartilhados) são anônimos. Analytics opcional usa Plausible, sem cookies nem fingerprinting.'
  },
  {
    title: 'O que os scripts executam',
    text: 'Você vê a lista completa de comandos antes de copiar ou baixar. Cada falha de instalação é registrada sem interromper as demais. Nada é executado automaticamente pelo navegador.'
  },
  {
    title: 'Drivers',
    text: 'A área de drivers aponta apenas para páginas oficiais de fabricantes (NVIDIA, AMD, Intel, Realtek, Dell, HP...) e recomenda Windows Update como primeira opção.'
  }
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Segurança e transparência</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        O Toolkit existe para ser o caminho mais seguro entre uma máquina recém-formatada e um
        ambiente completo. Estes são os princípios que guiam cada decisão.
      </p>

      <div className="mt-8 space-y-4">
        {pillars.map((p) => (
          <section key={p.title} className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold">
              <CheckCircle2 className="h-4 w-4 text-success" /> {p.title}
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{p.text}</p>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-primary/40 bg-primary-soft p-5">
        <h2 className="text-[15px] font-semibold">Reportar uma vulnerabilidade</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          Encontrou algo? Reporte com responsabilidade em{' '}
          <a href="mailto:security@toolkit.dev" className="text-primary hover:underline">
            security@toolkit.dev
          </a>{' '}
          ou abra um advisory privado no GitHub. Respondemos em até 72 horas.
          Consulte também nossa política completa em{' '}
          <Link href="/docs#security" className="text-primary hover:underline">
            SECURITY.md
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
