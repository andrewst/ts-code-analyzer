import { analyzeChangeImpact } from '../analysis/change-impact/index.js';
import { analyzeHotspots } from '../analysis/hotspots/index.js';
import { analyzePublicApi } from '../analysis/public-api/index.js';
import { analyzeStructure } from '../analysis/structure/index.js';
import type {
  AnalysisReport,
  AnalysisRequest,
  ObservationSet,
  ProjectSnapshot,
  ReportSection,
} from '../contracts/index.js';
import { buildProjectSnapshot } from '../compiler/index.js';
import {
  resolveProjectContext,
  type LoadedProject,
  type ProjectLoadResult,
} from '../project-loading/index.js';

export interface AnalysisPipelineDependencies {
  resolveProjectContext: (targetPath: string) => ProjectLoadResult;
  buildProjectSnapshot: (loadedProject: LoadedProject) => ProjectSnapshot;
}

/**
 * Create an application pipeline for end-to-end repository analysis.
 *
 * @param dependencies Adapter dependencies for project loading and snapshot extraction.
 * @returns A workflow function producing an analysis report from an analysis request.
 */
export function createAnalysisPipeline(
  dependencies?: AnalysisPipelineDependencies,
): (request: AnalysisRequest) => AnalysisReport {
  const resolvedDependencies = dependencies ?? {
    resolveProjectContext,
    buildProjectSnapshot,
  };

  return (request) => {
    const loadResult = resolvedDependencies.resolveProjectContext(request.targetPath);

    if (!loadResult.ok) {
      return createInitializationFailureReport(request, [
        loadResult.error.message,
        ...(loadResult.error.details ?? []),
      ]);
    }

    const snapshot = resolvedDependencies.buildProjectSnapshot(loadResult.value);
    const observations = createObservationSet(snapshot, request);

    return {
      sections: createReportSections(observations, request.workflowMode),
      metadata: {
        targetPath: loadResult.value.projectRoot,
        workflowMode: request.workflowMode,
        analysisComplete: !snapshot.diagnostics.some(
          (diagnostic) => diagnostic.severity === 'error',
        ),
        caveats: snapshot.diagnostics.map((diagnostic) =>
          diagnostic.file === undefined
            ? diagnostic.message
            : `${diagnostic.file}: ${diagnostic.message}`,
        ),
      },
    };
  };
}

function createObservationSet(snapshot: ProjectSnapshot, request: AnalysisRequest): ObservationSet {
  return {
    structure: analyzeStructure(snapshot),
    publicApi: analyzePublicApi(snapshot),
    changeImpact: request.workflowMode === 'full' ? analyzeChangeImpact(snapshot, request) : [],
    hotspots: request.workflowMode === 'full' ? analyzeHotspots(snapshot) : [],
  };
}

function createReportSections(
  observations: ObservationSet,
  workflowMode: AnalysisRequest['workflowMode'],
): ReportSection[] {
  switch (workflowMode) {
    case 'structure':
      return [{ kind: 'structure', observations: observations.structure }];
    case 'public-api':
      return [{ kind: 'public-api', observations: observations.publicApi }];
    case 'full':
      return [
        { kind: 'structure', observations: observations.structure },
        { kind: 'public-api', observations: observations.publicApi },
        { kind: 'change-impact', observations: observations.changeImpact },
        { kind: 'hotspots', observations: observations.hotspots },
      ];
  }
}

function createInitializationFailureReport(
  request: AnalysisRequest,
  caveats: string[],
): AnalysisReport {
  return {
    sections: [],
    metadata: {
      targetPath: request.targetPath,
      workflowMode: request.workflowMode,
      analysisComplete: false,
      caveats,
    },
  };
}
