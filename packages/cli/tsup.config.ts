import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'node20',
  platform: 'node',
  banner: { js: '#!/usr/bin/env node' },
  clean: true,
  sourcemap: false,
  dts: false
});
