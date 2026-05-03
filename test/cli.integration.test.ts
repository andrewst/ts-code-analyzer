import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('ts-code-analyzer CLI', () => {
  it('should execute end-to-end against a fixture project', () => {
    const output = execFileSync(
      process.execPath,
      [
        './node_modules/tsx/dist/cli.mjs',
        'src/index.ts',
        'test/fixtures/library-with-exports',
        '--workflow',
        'public-api',
      ],
      {
        cwd: resolve('.'),
        encoding: 'utf8',
      },
    );

    expect(output).toContain('Public API:');
    expect(output).toContain('observed entry point src/index.ts via package-exports');
  });
});
