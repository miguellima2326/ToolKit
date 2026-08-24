import { allApps } from '../src/index.ts';

interface Check {
  appSlug: string;
  method: string;
  id: string;
  url: string;
}

const checks: Check[] = [];

for (const app of allApps) {
  for (const p of app.packages) {
    if (p.status !== 'verified' || !p.packageId) continue;
    let url: string | null = null;

    if (p.method === 'brew_formula') {
      url = `https://formulae.brew.sh/api/formula/${p.packageId}.json`;
    } else if (p.method === 'brew_cask') {
      const letter = p.packageId[0];
      url = `https://raw.githubusercontent.com/Homebrew/homebrew-cask/master/Casks/${letter}/${p.packageId}.rb`;
    } else if (p.method === 'flatpak') {
      url = `https://flathub.org/apps/${p.packageId}`;
    } else if (p.method === 'snap') {
      url = `https://snapcraft.io/${p.packageId}`;
    } else if (p.method === 'winget') {
      const segments = p.packageId.split('.');
      const dirPath = segments.join('/');
      url = `https://api.github.com/repos/microsoft/winget-pkgs/contents/manifests/${segments[0]!.charAt(0).toLowerCase()}/${dirPath}`;
    } else {
      continue;
    }

    checks.push({ appSlug: app.slug, method: p.method, id: p.packageId!, url });
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function check(c: Check): Promise<Check & { state: 'ok' | 'fail' | 'limited'; http: number }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(c.url, {
        signal: AbortSignal.timeout(20000),
        headers: {
          'User-Agent': 'toolkit-package-verifier',
          Accept: 'application/vnd.github+json',
          ...(c.url.includes('api.github.com') && process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {})
        }
      });
      if ((res.status === 403 || res.status === 429) && attempt === 0) {
        const reset = Number(res.headers.get('x-ratelimit-reset')) * 1000;
        const wait = Math.min(75_000, Math.max(5_000, reset - Date.now() + 2_000));
        console.error(`rate-limit em ${c.method}; aguardando ${Math.round(wait / 1000)}s…`);
        await sleep(wait);
        continue;
      }
      return { ...c, state: res.ok ? 'ok' : 'fail', http: res.status };
    } catch {
      return { ...c, state: 'fail', http: -1 };
    }
  }
  return { ...c, state: 'limited', http: 403 };
}

const results: Array<Check & { state: string; http: number }> = [];
const CONCURRENCY = 6;
for (let i = 0; i < checks.length; i += CONCURRENCY) {
  const batch = checks.slice(i, i + CONCURRENCY);
  results.push(...(await Promise.all(batch.map(check))));
  process.stdout.write(`\r${Math.min(i + CONCURRENCY, checks.length)}/${checks.length}   `);
}
process.stdout.write('\n\n');

const byMethod = new Map<string, { ok: number; fail: number; limited: number }>();
for (const r of results) {
  const e = byMethod.get(r.method) ?? { ok: 0, fail: 0, limited: 0 };
  if (r.state === 'ok') e.ok++;
  else if (r.state === 'limited') e.limited++;
  else e.fail++;
  byMethod.set(r.method, e);
}

console.log('=== RESUMO POR MÉTODO ===');
for (const [method, s] of [...byMethod.entries()].sort()) {
  console.log(
    `${method.padEnd(12)} ok:${String(s.ok).padStart(3)}  falha:${String(s.fail).padStart(3)}  rate-limit:${String(s.limited).padStart(3)}`
  );
}

const failed = results.filter((r) => r.state === 'fail');
if (failed.length > 0) {
  console.log('\n=== FALHAS REAIS (404) ===');
  for (const f of failed) console.log(`[${f.http}] ${f.appSlug} · ${f.method} · ${f.id}`);
} else {
  console.log('\nTodos os IDs verificados existem nas fontes oficiais ✔');
}
