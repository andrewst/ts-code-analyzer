import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { analyzePublicApi } from '../src/analysis/public-api/index.js';
import { buildProjectSnapshot } from '../src/compiler/index.js';
import { resolveProjectContext } from '../src/project-loading/index.js';
import { createProjectSnapshot } from './helpers/create-project-snapshot.js';

describe('analyzePublicApi/packageExports', () => {
  it('should prioritize package exports over fallback entry module discovery', () => {
    const loadedProject = resolveProjectContext(resolve('test/fixtures/library-with-exports'));

    expect(loadedProject.ok).toBe(true);
    if (!loadedProject.ok) {
      return;
    }

    const snapshot = buildProjectSnapshot(loadedProject.value);

    expect(analyzePublicApi(snapshot)).toEqual([
      {
        kind: 'public-api',
        entryPoint: 'src/index.ts',
        entryKind: 'package-exports',
        exportedNames: ['createWidget', 'sharedValue'],
        limited: false,
      },
      {
        kind: 'public-api',
        entryPoint: 'src/feature.ts',
        entryKind: 'package-exports',
        exportedNames: ['createWidget', 'helper'],
        limited: false,
      },
    ]);
  });
});

describe('analyzePublicApi/fallbacks', () => {
  it('should fallback to src/index.ts when explicit exports are absent', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: [
        { absolutePath: '/virtual/project/src/index.ts', relativePath: 'src/index.ts' },
        { absolutePath: '/virtual/project/src/shared.ts', relativePath: 'src/shared.ts' },
      ],
      exportGraph: [{ from: 'src/index.ts', to: 'src/shared.ts', names: ['sharedValue'] }],
      moduleExports: [
        { filePath: 'src/index.ts', exportedNames: ['sharedValue'] },
        { filePath: 'src/shared.ts', exportedNames: ['sharedValue'] },
      ],
    });

    expect(analyzePublicApi(snapshot)).toEqual([
      {
        kind: 'public-api',
        entryPoint: 'src/index.ts',
        entryKind: 'entry-module',
        exportedNames: ['sharedValue'],
        limited: false,
      },
    ]);
  });

  it('should degrade gracefully when no entry point signal is present', () => {
    expect(analyzePublicApi(createProjectSnapshot())).toEqual([
      {
        kind: 'public-api',
        entryPoint: '<unresolved>',
        entryKind: 'entry-module',
        exportedNames: [],
        limited: true,
      },
    ]);
  });

  it('should not include private exports from reachable modules that are not re-exported', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: [
        { absolutePath: '/virtual/project/src/index.ts', relativePath: 'src/index.ts' },
        { absolutePath: '/virtual/project/src/feature.ts', relativePath: 'src/feature.ts' },
      ],
      exportGraph: [{ from: 'src/index.ts', to: 'src/feature.ts', names: ['foo'] }],
      moduleExports: [
        { filePath: 'src/index.ts', exportedNames: ['foo'] },
        { filePath: 'src/feature.ts', exportedNames: ['bar', 'foo'] },
      ],
    });

    expect(analyzePublicApi(snapshot)).toEqual([
      {
        kind: 'public-api',
        entryPoint: 'src/index.ts',
        entryKind: 'entry-module',
        exportedNames: ['foo'],
        limited: false,
      },
    ]);
  });
});

describe('analyzePublicApi/cycles', () => {
  it('should stop traversal on circular re-export graphs', () => {
    const loadedProject = resolveProjectContext(resolve('test/fixtures/cycle-project'));

    expect(loadedProject.ok).toBe(true);
    if (!loadedProject.ok) {
      return;
    }

    const snapshot = buildProjectSnapshot(loadedProject.value);

    expect(analyzePublicApi(snapshot)).toEqual([
      {
        kind: 'public-api',
        entryPoint: 'src/index.ts',
        entryKind: 'package-exports',
        exportedNames: ['valueA'],
        limited: false,
      },
    ]);
  });
});
