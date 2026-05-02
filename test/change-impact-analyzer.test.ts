import { describe, expect, it } from 'vitest';

import { analyzeChangeImpact } from '../src/analysis/change-impact/index.js';
import { createProjectSnapshot } from './helpers/create-project-snapshot.js';

describe('analyzeChangeImpact', () => {
  it('should report dependency neighbors for explicitly changed files', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: [
        { absolutePath: '/virtual/project/src/a.ts', relativePath: 'src/a.ts' },
        { absolutePath: '/virtual/project/src/b.ts', relativePath: 'src/b.ts' },
        { absolutePath: '/virtual/project/src/c.ts', relativePath: 'src/c.ts' },
      ],
      moduleGraph: [
        { from: 'src/a.ts', to: 'src/b.ts' },
        { from: 'src/c.ts', to: 'src/a.ts' },
      ],
      exportGraph: [{ from: 'src/b.ts', to: 'src/c.ts', names: ['valueC'] }],
    });

    expect(analyzeChangeImpact(snapshot, { changedFiles: ['src/a.ts'] })).toEqual([
      {
        kind: 'change-impact',
        changedFile: 'src/a.ts',
        affectedFiles: ['src/b.ts', 'src/c.ts'],
      },
    ]);
  });

  it('should return no observations when no explicit change list is provided', () => {
    expect(analyzeChangeImpact(createProjectSnapshot(), {})).toEqual([]);
  });

  it('should keep isolated changes bounded to zero affected files', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: [
        { absolutePath: '/virtual/project/src/isolated.ts', relativePath: 'src/isolated.ts' },
      ],
    });

    expect(analyzeChangeImpact(snapshot, { changedFiles: ['src/isolated.ts'] })).toEqual([
      {
        kind: 'change-impact',
        changedFile: 'src/isolated.ts',
        affectedFiles: [],
      },
    ]);
  });

  it('should clear affected files when the changed file is outside the known inventory', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: [{ absolutePath: '/virtual/project/src/a.ts', relativePath: 'src/a.ts' }],
      moduleGraph: [{ from: 'src/a.ts', to: 'src/b.ts' }],
      exportGraph: [{ from: 'src/b.ts', to: 'src/a.ts', names: ['valueA'] }],
    });

    expect(analyzeChangeImpact(snapshot, { changedFiles: ['../outside.ts'] })).toEqual([
      {
        kind: 'change-impact',
        changedFile: '../outside.ts',
        affectedFiles: [],
      },
    ]);
  });

  it('should include export graph neighbors for both outgoing and incoming re-export edges', () => {
    const snapshot = createProjectSnapshot({
      fileInventory: [
        { absolutePath: '/virtual/project/src/a.ts', relativePath: 'src/a.ts' },
        { absolutePath: '/virtual/project/src/b.ts', relativePath: 'src/b.ts' },
        { absolutePath: '/virtual/project/src/c.ts', relativePath: 'src/c.ts' },
      ],
      exportGraph: [
        { from: 'src/a.ts', to: 'src/b.ts', names: ['valueB'] },
        { from: 'src/c.ts', to: 'src/a.ts', names: ['valueA'] },
      ],
    });

    expect(analyzeChangeImpact(snapshot, { changedFiles: ['src/a.ts'] })).toEqual([
      {
        kind: 'change-impact',
        changedFile: 'src/a.ts',
        affectedFiles: ['src/b.ts', 'src/c.ts'],
      },
    ]);
  });
});
