import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  splitting: false,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  packages: 'external',
  minify: true,
  sourcemap: false,
  legalComments: 'none',
  banner: {
    js: '#!/usr/bin/env node\n',
  },
});
