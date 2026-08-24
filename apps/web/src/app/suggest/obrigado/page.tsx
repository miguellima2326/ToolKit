import Link from 'next/link';

export default function SuggestThanksPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="text-4xl">✓</div>
      <h1 className="mt-3 text-xl font-bold tracking-tight">Sugestão recebida!</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Nossa curadoria vai verificar os dados e as fontes antes de publicar. Obrigado por ajudar o
        catálogo a crescer com segurança.
      </p>
      <Link href="/apps" className="mt-6 inline-flex rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary">
        Voltar ao catálogo
      </Link>
    </div>
  );
}
