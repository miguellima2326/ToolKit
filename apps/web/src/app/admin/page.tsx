import type { Metadata } from 'next';
import { AdminClient } from './admin-client';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Painel administrativo do Toolkit.',
  robots: { index: false }
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <AdminClient />
    </div>
  );
}
