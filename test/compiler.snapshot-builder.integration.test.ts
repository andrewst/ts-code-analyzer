import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildProjectSnapshot } from '../src/compiler/index.js';
import { resolveProjectContext } from '../src/project-loading/index.js';

describe('buildProjectSnapshot', () => {
  it('should build a pure snapshot from a fixture project', () => {
    const loadedProject = resolveProjectContext(resolve('test/fixtures/library-with-exports'));

    expect(loadedProject.ok).toBe(true);
    if (!loadedProject.ok) {
      return;
    }

    const snapshot = buildProjectSnapshot(loadedProject.value);

    expect({
      files: snapshot.fileInventory.map((file) => file.relativePath).toSorted(),
      exports: snapshot.packageExports,
      moduleGraph: snapshot.moduleGraph,
      exportGraph: snapshot.exportGraph,
      moduleExports: snapshot.moduleExports,
    }).toMatchSnapshot();
  });

  it('should preserve diagnostics when source files contain syntax errors', () => {
    const loadedProject = resolveProjectContext(resolve('test/fixtures/broken-project'));

    expect(loadedProject.ok).toBe(true);
    if (!loadedProject.ok) {
      return;
    }

    const snapshot = buildProjectSnapshot(loadedProject.value);

    expect(snapshot.fileInventory.map((file) => file.relativePath).toSorted()).toEqual([
      'src/helper.ts',
      'src/index.ts',
    ]);
    expect(snapshot.diagnostics.length).toBeGreaterThan(0);
    expect(snapshot.diagnostics.some((diagnostic) => diagnostic.file === 'src/index.ts')).toBe(
      true,
    );
  });

  it('should ignore unresolved local exports and external library imports in graph construction', () => {
    const loadedProject = resolveProjectContext(resolve('test/fixtures/conditional-exports'));

    expect(loadedProject.ok).toBe(true);
    if (!loadedProject.ok) {
      return;
    }

    const snapshot = buildProjectSnapshot(loadedProject.value);

    expect(snapshot.moduleGraph).toEqual([]);
    expect(snapshot.exportGraph).toEqual([]);
    expect(snapshot.moduleExports).toEqual([
      { filePath: 'src/index.ts', exportedNames: ['conditionalValue'] },
    ]);
  });

  it('should capture wildcard and namespace re-export edges without leaking external imports', () => {
    const loadedProject = resolveProjectContext(resolve('test/fixtures/compiler-edges'));

    expect(loadedProject.ok).toBe(true);
    if (!loadedProject.ok) {
      return;
    }

    const snapshot = buildProjectSnapshot(loadedProject.value);

    expect(snapshot.fileInventory.map((file) => file.relativePath).toSorted()).toEqual([
      'src/helper.ts',
      'src/index.ts',
      'src/local.ts',
    ]);
    expect(snapshot.moduleGraph).toEqual([{ from: 'src/index.ts', to: 'src/helper.ts' }]);
    expect(snapshot.exportGraph).toEqual([
      { from: 'src/index.ts', to: 'src/helper.ts', names: ['*'] },
      { from: 'src/index.ts', to: 'src/helper.ts', names: ['tools'] },
    ]);
    expect(snapshot.moduleExports).toEqual([
      { filePath: 'src/helper.ts', exportedNames: ['helperValue'] },
      { filePath: 'src/index.ts', exportedNames: ['helperValue', 'localValue', 'tools'] },
      { filePath: 'src/local.ts', exportedNames: [] },
    ]);
  });
});
