import { describe, expect, it } from 'vitest';

import { analyzeStructure } from '../src/analysis/structure/index.js';
import { createProjectSnapshot } from './helpers/create-project-snapshot.js';

describe('analyzeStructure', () => {
  it('should summarize file counts, directory counts, and dominant module types', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: [
        { absolutePath: '/virtual/project/src/index.ts', relativePath: 'src/index.ts' },
        {
          absolutePath: '/virtual/project/src/services/user-service.ts',
          relativePath: 'src/services/user-service.ts',
        },
        { absolutePath: '/virtual/project/src/utils/math.ts', relativePath: 'src/utils/math.ts' },
      ],
    });

    expect(analyzeStructure(snapshot)).toEqual([
      {
        kind: 'structure',
        fileCount: 3,
        directoryCount: 3,
        dominantModuleTypes: ['index', 'service', 'utility'],
        maxHierarchyDepth: 2,
      },
    ]);
  });

  it('should handle an empty snapshot without failing', () => {
    expect(analyzeStructure(createProjectSnapshot())).toEqual([
      {
        kind: 'structure',
        fileCount: 0,
        directoryCount: 0,
        dominantModuleTypes: [],
        maxHierarchyDepth: 0,
      },
    ]);
  });

  it('should classify test files and generic modules separately', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: [
        {
          absolutePath: '/virtual/project/src/example.spec.ts',
          relativePath: 'src/example.spec.ts',
        },
        { absolutePath: '/virtual/project/src/plain.ts', relativePath: 'src/plain.ts' },
      ],
    });

    expect(analyzeStructure(snapshot)).toEqual([
      {
        kind: 'structure',
        fileCount: 2,
        directoryCount: 1,
        dominantModuleTypes: ['module', 'test'],
        maxHierarchyDepth: 1,
      },
    ]);
  });
});
