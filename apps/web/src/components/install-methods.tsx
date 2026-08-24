'use client';

import { METHOD_LABELS, OS_LABELS, SOURCE_LABELS, type AppDetail, type InstallMethodDto, type OperatingSystem } from '@toolkit/shared';
import { CopyButton } from './copy-button';
import { ShieldCheck } from 'lucide-react';

const SOURCE_BADGE_STYLES: Record<string, string> = {
  official: 'border-success/50 bg-success/10 text-success',
  community: 'border-border bg-bg-subtle text-muted',
  system: 'border-border bg-bg-subtle text-muted'
};

function commandFor(m: InstallMethodDto): string | null {
  switch (m.method) {
    case 'winget':
      return `winget install --id ${m.packageId} --exact`;
    case 'chocolatey':
      return `choco install ${m.packageId?.toLowerCase()}`;
    case 'scoop':
      return `scoop install ${m.packageId}`;
    case 'apt':
      return `sudo apt install ${m.packageId}`;
    case 'dnf':
      return `sudo dnf install ${m.packageId}`;
    case 'pacman':
      return `sudo pacman -S ${m.packageId}`;
    case 'flatpak':
      return `flatpak install flathub ${m.packageId}`;
    case 'snap':
      return `sudo snap install ${m.packageId}${m.classic ? ' --classic' : ''}`;
    case 'brew_formula':
      return `brew install ${m.packageId}`;
    case 'brew_cask':
      return `brew install --cask ${m.packageId}`;
    default:
      return null;
  }
}

export function InstallMethods({ methods }: { methods: AppDetail['installMethods'] }) {
  const byOs = new Map<OperatingSystem, InstallMethodDto[]>();
  for (const m of methods) {
    const arr = byOs.get(m.os) ?? [];
    arr.push(m);
    byOs.set(m.os, arr);
  }

  if (byOs.size === 0) return null;

  return (
    <div className="space-y-6">
      {[...byOs.entries()].map(([os, osMethods]) => (
        <div key={os}>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted">
            {OS_LABELS[os]}
          </h3>
          <div className="space-y-2.5">
            {osMethods.map((m, i) => {
              const cmd = commandFor(m);
              return (
                <div key={`${m.method}-${i}`} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-semibold">{METHOD_LABELS[m.method]}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        SOURCE_BADGE_STYLES[m.source] ?? SOURCE_BADGE_STYLES['community']
                      }`}
                    >
                      {m.source === 'official' && <ShieldCheck className="h-3 w-3" />}
                      {SOURCE_LABELS[m.source]}
                    </span>
                    {m.repository && (
                      <span className="text-[11px] text-muted">via {m.repository}</span>
                    )}
                    {m.status === 'pending_review' && (
                      <span className="rounded-full border border-warning/50 bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
                        Aguardando verificação
                      </span>
                    )}
                    <span className="flex-1" />
                    {m.url && (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Site oficial ↗
                      </a>
                    )}
                    {cmd && <CopyButton text={cmd} />}
                  </div>

                  {cmd && (
                    <pre className="scrollbar-thin mt-2 overflow-x-auto rounded-md bg-bg-subtle p-2.5 font-mono text-[12px] leading-relaxed text-fg">
                      <code>{cmd}</code>
                    </pre>
                  )}

                  {m.notes && <p className="mt-1.5 text-xs text-muted">{m.notes}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
