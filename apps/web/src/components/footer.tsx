import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
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
            { href: '/terms', label: 'Termos' }
          ]}
        />
      </div>
      <div className="border-t border-border py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-muted">
            © {new Date().getFullYear()} Toolkit · Open source · Feito para quem formata PC
          </p>
          <p className="flex items-center gap-3 text-xs text-muted">
            <span>
              Feito por <span className="font-medium text-fg">Miguel Lima</span>
            </span>
            <a
              href="https://github.com/miguellima2326"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub de Miguel Lima"
              className="text-muted transition-colors hover:text-fg"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/in/miguel-lima-845666252"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn de Miguel Lima"
              className="text-muted transition-colors hover:text-fg"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </p>
        </div>
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
