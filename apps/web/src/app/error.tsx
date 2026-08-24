'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-sm text-warning">500</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Algo deu errado por aqui</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Registramos o problema internamente. Tente novamente em alguns instantes.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-fg hover:opacity-90"
      >
        Tentar novamente
      </button>
    </div>
  );
}
