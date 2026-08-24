import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { AppSummary } from '@toolkit/shared';
import { formatDate } from '@toolkit/shared';
import { getSharedKit } from '@/lib/catalog-server';
import { AppIcon } from '@/components/app-icon';
import { UseKitButton } from './use-kit';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const kit = await getSharedKit(code);
  if (!kit) return { title: 'Toolkit não encontrado' };
  return {
    title: kit.title ?? 'Toolkit compartilhado',
    description: `${kit.apps.length} aplicativos selecionados.`,
    robots: { index: false }
  };
}

export default async function SharedKitPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const kit = await getSharedKit(code);
  if (!kit || kit.apps.length === 0) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-wider text-muted">Toolkit compartilhado</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">{kit.title ?? 'Toolkit'}</h1>
      <p className="mt-1 text-sm text-muted">
        {kit.apps.length} aplicativos · {t_created(kit.createdAt)}
      </p>

      <div className="mt-6">
        <UseKitButton
          code={kit.code}
          items={kit.apps.map((a: AppSummary) => ({
            slug: a.slug,
            name: a.name,
            iconKey: a.iconKey,
            color: a.color
          }))}
        />
      </div>

      <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
        {kit.apps.map((app: AppSummary) => (
          <li key={app.slug}>
            <Link href={`/apps/${app.slug}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg-subtle">
              <AppIcon slug={app.iconKey} name={app.name} color={app.color} size={32} hasLocalIcon={app.hasLocalIcon} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{app.name}</p>
                <p className="truncate text-xs text-muted">{app.tagline}</p>
              </div>
              <span className="text-xs text-muted">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function t_created(dateIso: string) {
  return `criado em ${formatDate(dateIso)}`;
}
