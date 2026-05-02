import { describe, expect, it } from 'vitest';

import {
  collectPublicExportNames,
  discoverPublicSurface,
} from '../src/analysis/shared/public-surface.js';
import { createProjectSnapshot } from './helpers/create-project-snapshot.js';

describe('discoverPublicSurface', () => {
  it('should keep package export entry points even when they have no re-export edges', () => {
    const snapshot = createProjectSnapshot({
      packageExports: [{ subpath: '.', target: './src/index.ts', resolvedFile: 'src/index.ts' }],
      fileInventory: [
        { absolutePath: '/virtual/project/src/index.ts', relativePath: 'src/index.ts' },
      ],
    });

    expect(discoverPublicSurface(snapshot)).toEqual({
      entryPoints: [{ entryPoint: 'src/index.ts', entryKind: 'package-exports' }],
      reachableModules: new Map([['src/index.ts', ['src/index.ts']]]),
    });
  });

  it('should collect public export names from reachable modules only', () => {
    expect(
      collectPublicExportNames('src/index.ts', [
        { filePath: 'src/index.ts', exportedNames: ['alpha'] },
        { filePath: 'src/internal.ts', exportedNames: ['beta'] },
      ]),
    ).toEqual(['alpha']);
  });
});
