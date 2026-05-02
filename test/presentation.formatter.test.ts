import { describe, expect, it } from 'vitest';

import { formatAnalysisReport } from '../src/presentation/index.js';
import type { AnalysisReport } from '../src/contracts/index.js';

describe('formatAnalysisReport', () => {
  it('should format report metadata, caveats, and observations using observational language', () => {
    const report: AnalysisReport = {
      metadata: {
        targetPath: '/virtual/project',
        workflowMode: 'full',
        analysisComplete: false,
        caveats: ['src/index.ts: parser error'],
      },
      sections: [
        {
          kind: 'structure',
          observations: [
            {
              kind: 'structure',
              fileCount: 3,
              directoryCount: 2,
              dominantModuleTypes: ['index', 'utility'],
              maxHierarchyDepth: 2,
            },
          ],
        },
        {
          kind: 'public-api',
          observations: [
            {
              kind: 'public-api',
              entryPoint: 'src/index.ts',
              entryKind: 'entry-module',
              exportedNames: ['alpha', 'beta'],
              limited: false,
            },
          ],
        },
      ],
    };

    expect(formatAnalysisReport(report)).toContain('Analysis complete: no');
    expect(formatAnalysisReport(report)).toContain('observed 3 files across 2 directories');
    expect(formatAnalysisReport(report)).toContain(
      'observed entry point src/index.ts via entry-module; exported names: alpha, beta',
    );
    expect(formatAnalysisReport(report)).not.toContain('should');
  });

  it('should render a placeholder when a section has no observations', () => {
    const report: AnalysisReport = {
      metadata: {
        targetPath: '/virtual/project',
        workflowMode: 'structure',
        analysisComplete: true,
        caveats: [],
      },
      sections: [{ kind: 'structure', observations: [] }],
    };

    expect(formatAnalysisReport(report)).toContain('- no observations');
  });

  it('should format change-impact observations using observational language', () => {
    const report: AnalysisReport = {
      metadata: {
        targetPath: '/virtual/project',
        workflowMode: 'full',
        analysisComplete: true,
        caveats: [],
      },
      sections: [
        {
          kind: 'change-impact',
          observations: [
            {
              kind: 'change-impact',
              changedFile: 'src/core.ts',
              affectedFiles: ['src/consumer.ts'],
            },
          ],
        },
      ],
    };

    const output = formatAnalysisReport(report);
    expect(output).toContain('observed change input src/core.ts');
    expect(output).toContain('affected files: src/consumer.ts');
    expect(output).not.toContain('should');
  });

  it('should indicate no affected neighbors when change-impact has no affected files', () => {
    const report: AnalysisReport = {
      metadata: {
        targetPath: '/virtual/project',
        workflowMode: 'full',
        analysisComplete: true,
        caveats: [],
      },
      sections: [
        {
          kind: 'change-impact',
          observations: [
            {
              kind: 'change-impact',
              changedFile: 'src/isolated.ts',
              affectedFiles: [],
            },
          ],
        },
      ],
    };

    expect(formatAnalysisReport(report)).toContain('no affected neighbors observed');
  });

  it('should summarize long lists instead of dumping every value', () => {
    const report: AnalysisReport = {
      metadata: {
        targetPath: '/virtual/project',
        workflowMode: 'full',
        analysisComplete: true,
        caveats: [],
      },
      sections: [
        {
          kind: 'hotspots',
          observations: [
            {
              kind: 'hotspot',
              filePath: 'src/core.ts',
              score: 12,
              signals: [
                'high-fan-in',
                'high-fan-out',
                'high-public-exposure',
                'high-dependency-concentration',
                'high-fan-in',
                'high-fan-out',
              ],
            },
          ],
        },
      ],
    };

    expect(formatAnalysisReport(report)).toContain('(+1 more)');
  });
});
