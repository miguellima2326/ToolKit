'use client';

import { SUGGEST_CATEGORIES } from './categories';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function SuggestPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Sugerir aplicativo</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Toda sugestão passa por <strong className="text-fg">curadoria manual</strong> antes de entrar no
        catálogo — nunca publicamos automaticamente. Se possível, informe os IDs de pacote que você conhece.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const payload = {
            name: String(form.get('name') ?? ''),
            websiteUrl: String(form.get('websiteUrl') ?? ''),
            categorySlug: String(form.get('categorySlug') ?? '') || undefined,
            operatingSystems: form.getAll('oss').map(String),
            wingetId: String(form.get('wingetId') ?? '') || undefined,
            brewId: String(form.get('brewId') ?? '') || undefined,
            flatpakId: String(form.get('flatpakId') ?? '') || undefined,
            notes: String(form.get('notes') ?? '') || undefined,
            contact: String(form.get('contact') ?? '') || undefined
          };
          const button = (e.currentTarget as HTMLFormElement).querySelector('button') as HTMLButtonElement;
          button.disabled = true;
          try {
            await fetch(`${API_URL}/api/v1/suggestions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            location.href = '/suggest/obrigado';
          } catch {
            button.disabled = false;
            alert('Falha ao enviar. Tente novamente.');
          }
        }}
        className="mt-6 space-y-4 rounded-xl border border-border bg-card p-5"
      >
        <Field label="Nome do aplicativo *" name="name" required maxLength={120} />
        <Field label="Site oficial (https) *" name="websiteUrl" required type="url" placeholder="https://..." />

        <div>
          <label htmlFor="categorySlug" className="mb-1 block text-xs font-medium">Categoria</label>
          <select id="categorySlug" name="categorySlug" className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-primary">
            <option value="">—</option>
            {SUGGEST_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-xs font-medium">Sistemas operacionais *</legend>
          <div className="flex gap-3 text-sm">
            {['windows', 'linux', 'macos'].map((os) => (
              <label key={os} className="inline-flex items-center gap-1.5 capitalize">
                <input type="checkbox" name="oss" value={os} defaultChecked={os === 'windows'} className="accent-[var(--primary)]" />
                {os}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Winget ID" name="wingetId" placeholder="Ex.: App.Publisher" />
          <Field label="Homebrew ID" name="brewId" placeholder="ex.: app-name" />
          <Field label="Flatpak ID" name="flatpakId" placeholder="ex.: com.app.Example" />
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-medium">Observações</span>
          <textarea name="notes" rows={3} className="w-full rounded-md border border-border bg-bg p-3 text-sm outline-none focus:border-primary" />
        </label>

        <Field label="Seu e-mail (opcional, para retorno)" name="contact" type="email" />

        <button
          type="submit"
          className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-primary-fg hover:opacity-90 disabled:opacity-60"
        >
          Enviar sugestão
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  type = 'text',
  placeholder,
  maxLength
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
