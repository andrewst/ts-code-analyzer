import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { resolveProjectContext } from '../src/project-loading/index.js';

describe('resolveProjectContext', () => {
  it('should resolve tsconfig scope and package exports for a valid fixture project', () => {
    const targetPath = resolve('test/fixtures/library-with-exports');
    const result = resolveProjectContext(targetPath);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value.tsconfigPath).toContain('library-with-exports/tsconfig.json');
    expect(
      result.value.fileNames.map((fileName) => fileName.split('/').slice(-2).join('/')).toSorted(),
    ).toEqual(['src/feature.ts', 'src/helper.ts', 'src/index.ts', 'src/shared.ts']);
    expect(result.value.packageExports).toEqual([
      { subpath: '.', target: './dist/index.js', resolvedFile: 'src/index.ts' },
      { subpath: './feature', target: './dist/feature.js', resolvedFile: 'src/feature.ts' },
    ]);
  });

  it('should return a typed error when tsconfig is missing', () => {
    const targetPath = resolve('test/fixtures/no-tsconfig');
    const result = resolveProjectContext(targetPath);

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'TSCONFIG_NOT_FOUND',
        message: expect.stringContaining('No tsconfig.json was found'),
      },
    });
  });

  it('should return a typed error when the target path does not exist', () => {
    expect(resolveProjectContext(resolve('test/fixtures/does-not-exist'))).toEqual({
      ok: false,
      error: {
        code: 'TARGET_NOT_FOUND',
        message: expect.stringContaining('Target path does not exist'),
      },
    });
  });

  it('should return a typed error when the target path is a file', () => {
    expect(resolveProjectContext(resolve('package.json'))).toEqual({
      ok: false,
      error: {
        code: 'TARGET_NOT_DIRECTORY',
        message: expect.stringContaining('Target path is not a directory'),
      },
    });
  });

  it('should return a typed error when tsconfig content is invalid', () => {
    expect(resolveProjectContext(resolve('test/fixtures/invalid-tsconfig'))).toEqual({
      ok: false,
      error: {
        code: 'TSCONFIG_INVALID',
        message: expect.stringContaining('Failed to parse tsconfig.json'),
        details: expect.any(Array),
      },
    });
  });

  it('should load projects without package.json and keep package exports empty', () => {
    const result = resolveProjectContext(resolve('test/fixtures/tsconfig-only'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.packageExports).toEqual([]);
  });

  it('should flatten nested package export conditions and keep unresolved targets visible', () => {
    const result = resolveProjectContext(resolve('test/fixtures/conditional-exports'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.packageExports).toEqual([
      { subpath: '.', target: './dist/index.js', resolvedFile: 'src/index.ts' },
      { subpath: './missing', target: './dist/missing.js', resolvedFile: undefined },
    ]);
  });

  it('should normalize string exports to the root subpath', () => {
    const result = resolveProjectContext(resolve('test/fixtures/string-exports'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.packageExports).toEqual([
      { subpath: '.', target: './src/index.ts', resolvedFile: 'src/index.ts' },
    ]);
  });

  it('should normalize top-level conditional exports to the root subpath', () => {
    const result = resolveProjectContext(resolve('test/fixtures/conditional-root-exports'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.packageExports).toEqual([
      { subpath: '.', target: './dist/index.js', resolvedFile: 'src/index.ts' },
    ]);
  });

  it('should ignore unsupported exports shapes', () => {
    const result = resolveProjectContext(resolve('test/fixtures/invalid-exports-shape'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.packageExports).toEqual([]);
  });

  it('should resolve dist declaration targets and non-priority export conditions', () => {
    const result = resolveProjectContext(resolve('test/fixtures/resolver-exports-branches'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.packageExports).toEqual([
      { subpath: '.', target: './dist/index.d.ts', resolvedFile: 'src/index.ts' },
      { subpath: './feature', target: './src/feature.ts', resolvedFile: 'src/feature.ts' },
    ]);
    expect(
      result.value.fileNames.map((fileName) => fileName.split('/').slice(-2).join('/')).toSorted(),
    ).toEqual(['src/feature.ts', 'src/index.ts']);
  });

  it('should return a typed error when tsconfig cannot be read as a file', () => {
    expect(resolveProjectContext(resolve('test/fixtures/read-error-tsconfig'))).toEqual({
      ok: false,
      error: {
        code: 'TSCONFIG_INVALID',
        message: expect.stringContaining('Failed to read tsconfig.json'),
        details: expect.any(Array),
      },
    });
  });
});
