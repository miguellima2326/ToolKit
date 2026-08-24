import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ICONS_DIR = join(process.cwd(), 'public', 'icons');

export function hasLocalIcon(slug: string): boolean {
  try {
    return existsSync(join(ICONS_DIR, `${slug}.svg`));
  } catch {
    return false;
  }
}
