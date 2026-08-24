import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchPalette } from '@/components/search-palette';
import { SITE_URL } from '@/lib/api';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Toolkit — Your apps. Your system. One place.',
    template: '%s · Toolkit'
  },
  description:
    'Encontre aplicativos, drivers e ferramentas para Windows, Linux e macOS. Monte seu pacote, gere um script de instalação seguro e prepare qualquer máquina em minutos.',
  keywords: ['aplicativos', 'drivers', 'winget', 'homebrew', 'flatpak', 'instalação', 'formatar pc'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Toolkit',
    title: 'Toolkit — Your apps. Your system. One place.',
    description: 'Monte seu pacote de aplicativos e instale tudo de uma vez.'
  },
  twitter: { card: 'summary_large_image', title: 'Toolkit', description: 'Your apps. Your system. One place.' },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' }
  ]
};

const themeInit = `(function(){try{var t=localStorage.getItem('toolkit.theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');var l=localStorage.getItem('toolkit.locale');if(l)document.documentElement.lang=l;}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-fg"
          >
            Pular para o conteúdo
          </a>
          <Header />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Footer />
          <SearchPalette />
        </Providers>
      </body>
    </html>
  );
}
