import Link from 'next/link';
import { LogoMark } from './logo';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-fg">
            <LogoMark />
            <span className="text-[15px] font-semibold">Toolkit</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Your apps. Your system. One place.
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted">
            Tudo que seu computador precisa. Em um só lugar.
          </p>
        </div>

        <FooterCol
          title="Produto"
          links={[
            { href: '/apps', label: 'Apps' },
            { href: '/drivers', label: 'Drivers' },
            { href: '/collections', label: 'Coleções' },
            { href: '/generate', label: 'Gerar instalação' }
          ]}
        />
        <FooterCol
          title="Recursos"
          links={[
            { href: '/docs', label: 'Documentação' },
            { href: '/docs#api', label: 'API v1' },
            { href: '/status', label: 'Status' },
            { href: '/suggest', label: 'Sugerir aplicativo' }
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { href: '/security', label: 'Segurança' },
            { href: '/privacy', label: 'Privacidade' },
            { href: '/terms', label: 'Termos' },
            { href: '/admin', label: 'Admin' }
          ]}
        />
      </div>
      <div className="border-t border-border py-4">
        <p className="text-center text-xs text-muted">
          © {new Date().getFullYear()} Toolkit · Open source · Feito para quem formata PC
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className="text-sm text-muted transition-colors hover:text-fg">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
