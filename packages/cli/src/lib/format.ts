import pc from 'picocolors';

export function ok(label: string): string {
  return `${pc.green('✓')} ${label}`;
}

export function fail(label: string): string {
  return `${pc.red('✗')} ${label}`;
}

export function heading(text: string): string {
  return pc.bold(pc.cyan(text));
}

export function dim(text: string): string {
  return pc.dim(text);
}

export function bullet(text: string): string {
  return `  ${pc.dim('-')} ${text}`;
}

export function printError(message: string): void {
  console.error(`${pc.red('erro:')} ${message}`);
}

export function printWarning(message: string): void {
  console.error(`${pc.yellow('aviso:')} ${message}`);
}
