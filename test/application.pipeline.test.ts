import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { createAnalysisPipeline } from '../src/application/index.js';
import type { AnalysisRequest } from '../src/contracts/index.js';
import { buildProjectSnapshot } from '../src/compiler/index.js';
import { resolveProjectContext, type ProjectLoadResult } from '../src/project-loading/index.js';

describe('createAnalysisPipeline', () => {
  it('should build a full analysis report from the shared project snapshot', () => {
    const pipeline = createAnalysisPipeline();
    const request: AnalysisRequest = {
      targetPath: resolve('test/fixtures/library-with-exports'),
      workflowMode: 'full',
      changedFiles: ['src/feature.ts'],
    };

    const report = pipeline(request);

    expect(report.sections.map((section) => section.kind)).toEqual([
      'structure',
      'public-api',
      'change-impact',
      'hotspots',
    ]);
    expect(report.metadata).toEqual({
      targetPath: expect.stringContaining('test/fixtures/library-with-exports'),
      workflowMode: 'full',
      analysisComplete: true,
      caveats: [],
    });
    expect(report.sections[1]?.observations).toEqual([
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
    expect(report.sections[2]?.observations).toEqual([
      {
        kind: 'change-impact',
        changedFile: 'src/feature.ts',
        affectedFiles: ['src/helper.ts', 'src/index.ts'],
      },
    ]);
  });

  it('should reduce report sections according to the selected workflow mode', () => {
    const pipeline = createAnalysisPipeline();
    const report = pipeline({
      targetPath: resolve('test/fixtures/library-with-exports'),
      workflowMode: 'public-api',
    });

    expect(report.sections.map((section) => section.kind)).toEqual(['public-api']);
  });

  it('should normalize project-loading failures into an incomplete report', () => {
    const pipeline = createAnalysisPipeline({
      resolveProjectContext: (): ProjectLoadResult => ({
        ok: false,
        error: {
          code: 'TSCONFIG_NOT_FOUND',
          message: 'missing tsconfig',
          details: ['checked test fixture'],
        },
      }),
      buildProjectSnapshot,
    });

    const report = pipeline({
      targetPath: '/virtual/missing-project',
      workflowMode: 'full',
    });

    expect(report).toEqual({
      sections: [],
      metadata: {
        targetPath: '/virtual/missing-project',
        workflowMode: 'full',
        analysisComplete: false,
        caveats: ['missing tsconfig', 'checked test fixture'],
      },
    });
  });

  it('should preserve diagnostics as report caveats without aborting analysis', () => {
    const pipeline = createAnalysisPipeline({
      resolveProjectContext,
      buildProjectSnapshot,
    });

    const report = pipeline({
      targetPath: resolve('test/fixtures/broken-project'),
      workflowMode: 'structure',
    });

    expect(report.sections.map((section) => section.kind)).toEqual(['structure']);
    expect(report.metadata.analysisComplete).toBe(false);
    expect(report.metadata.caveats.length).toBeGreaterThan(0);
  });
});
