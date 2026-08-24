import { readFileSync } from 'node:fs';

const TOKEN = process.env.GITHUB_TOKEN;
const H = {
  'User-Agent': 'toolkit-prober',
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${TOKEN}`
};

const ids = process.argv.slice(2);

async function listDir(path: string): Promise<Array<{ name: string; type: string }>> {
  const res = await fetch(
    `https://api.github.com/repos/microsoft/winget-pkgs/contents/manifests/${path}`,
    { headers: H, signal: AbortSignal.timeout(20000) }
  );
  if (!res.ok) return [];
  return (await res.json()) as Array<{ name: string; type: string }>;
}

for (const id of ids) {
  const segs = id.split('.');
  let path = segs[0]!.charAt(0).toLowerCase();
  let discovered = `manifests/${path}`;
  for (let i = 0; i < segs.length; i++) {
    const entries = await listDir(path);
    if (entries.length === 0) {
      console.log(`${id} → NADA em ${discovered}`);
      break;
    }
    const target = segs[i]!.toLowerCase();
    const match = entries.find((e) => e.name.toLowerCase() === target);
    if (!match) {
      const partial = entries.filter((e) => e.name.toLowerCase().startsWith(target.slice(0, 4)));
      console.log(
        `${id} → não achou "${segs[i]}" sob ${discovered}. Candidatos: ${partial.map((p) => p.name).join(', ') || entries.slice(0, 8).map((p) => p.name).join(', ')}`
      );
      break;
    }
    path = `${path}/${match.name}`;
    discovered = `${discovered}/${match.name}`;
    if (i === segs.length - 1) {
      const versions = await listDir(path);
      console.log(`✔ ${id} → ${discovered} (versões: ${versions.length})`);
    }
  }
}
