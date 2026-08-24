import Link from 'next/link';
import { AppCard } from '@/components/app-card';
import { getPopularApps } from '@/lib/catalog-server';

export default async function NotFound() {
  const popular = await getPopularApps(3).catch(() => []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Página não encontrada</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        O endereço pode ter mudado ou o aplicativo não existe mais no catálogo.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/" className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary">
          Voltar à página inicial
        </Link>
        <Link href="/apps" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-fg hover:opacity-90">
          Explorar apps
        </Link>
      </div>

      {popular.length > 0 && (
        <>
          <p className="mt-12 text-xs uppercase tracking-wider text-muted">Talvez você procure:</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {popular.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
