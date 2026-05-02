import { describe, expect, it } from 'vitest';

import { analyzeHotspots } from '../src/analysis/hotspots/index.js';
import { createProjectSnapshot } from './helpers/create-project-snapshot.js';

describe('analyzeHotspots', () => {
  it('should flag centrally depended-upon modules as hotspots', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: [
        { absolutePath: '/virtual/project/src/index.ts', relativePath: 'src/index.ts' },
        { absolutePath: '/virtual/project/src/core.ts', relativePath: 'src/core.ts' },
        { absolutePath: '/virtual/project/src/a.ts', relativePath: 'src/a.ts' },
        { absolutePath: '/virtual/project/src/b.ts', relativePath: 'src/b.ts' },
      ],
      packageExports: [{ subpath: '.', target: './src/index.ts', resolvedFile: 'src/index.ts' }],
      moduleGraph: [
        { from: 'src/index.ts', to: 'src/core.ts' },
        { from: 'src/a.ts', to: 'src/core.ts' },
        { from: 'src/b.ts', to: 'src/core.ts' },
        { from: 'src/core.ts', to: 'src/a.ts' },
        { from: 'src/core.ts', to: 'src/b.ts' },
      ],
      exportGraph: [{ from: 'src/index.ts', to: 'src/core.ts', names: ['coreValue'] }],
      moduleExports: [
        { filePath: 'src/index.ts', exportedNames: ['coreValue'] },
        { filePath: 'src/core.ts', exportedNames: ['coreValue'] },
        { filePath: 'src/a.ts', exportedNames: [] },
        { filePath: 'src/b.ts', exportedNames: [] },
      ],
    });

    expect(analyzeHotspots(snapshot)[0]).toEqual({
      kind: 'hotspot',
      filePath: 'src/core.ts',
      score: 17,
      signals: [
        'high-fan-in',
        'high-fan-out',
        'high-public-exposure',
        'high-dependency-concentration',
      ],
    });
  });

  it('should cap hotspot output to the highest-signal modules', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: Array.from({ length: 7 }, (_, index) => ({
        absolutePath: `/virtual/project/src/module-${index}.ts`,
        relativePath: `src/module-${index}.ts`,
      })),
      moduleGraph: Array.from({ length: 6 }, (_, index) => ({
        from: `src/module-${index}.ts`,
        to: 'src/module-6.ts',
      })),
    });

    expect(analyzeHotspots(snapshot)).toHaveLength(1);
  });
});
