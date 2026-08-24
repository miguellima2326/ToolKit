import type { Metadata } from 'next';
import { GenerateClient } from './generate-client';

export const metadata: Metadata = {
  title: 'Gerar instalação',
  description: 'Gere um script de instalação seguro com winget, apt, dnf, pacman, flatpak ou Homebrew a partir da sua seleção.',
  robots: { index: false }
};

export default function GeneratePage() {
  return <GenerateClient />;
}
