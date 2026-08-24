import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacidade',
  description: 'Política de privacidade do Toolkit.'
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Privacidade</h1>
      <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-muted [&_strong]:text-fg">
        <p>
          <strong>Resumo:</strong> o Toolkit funciona sem conta e não vende dados. Sua seleção de aplicativos
          fica no seu navegador (localStorage) até você criar um link compartilhável.
        </p>
        <p>
          <strong>Dados técnicos:</strong> registramos logs de servidor agregados (sem conteúdo de requisição
          sensível) para estabilidade e limites de taxa por IP, retidos por período curto.
        </p>
        <p>
          <strong>Contadores públicos:</strong> números como “instalações geradas” são agregados e anônimos.
        </p>
        <p>
          <strong>Analytics opcional:</strong> quando habilitado, usamos Plausible Analytics — sem cookies,
          sem rastreamento entre sites, sem dados pessoais.
        </p>
        <p>
          <strong>Kits compartilhados:</strong> ao criar um link, a lista de slugs e o título opcional ficam
          acessíveis a quem tiver o código. Evite incluir informações pessoais no título.
        </p>
        <p>
          Dúvidas de privacidade: privacy@toolkit.dev.
        </p>
      </div>
    </div>
  );
}
