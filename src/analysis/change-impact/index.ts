import { resolve } from 'node:path';

import type {
  AnalysisRequest,
  ChangeImpactObservation,
  ExportEdge,
  ModuleEdge,
  ProjectSnapshot,
} from '../../contracts/index.js';

/**
 * Derive dependency neighbors for explicitly changed files.
 *
 * @param snapshot Snapshot produced by the compiler adapter.
 * @param request Analysis request containing explicit changed files.
 * @returns Change impact observations for each changed file.
 */
export function analyzeChangeImpact(
  snapshot: ProjectSnapshot,
  request: Pick<AnalysisRequest, 'changedFiles'>,
): ChangeImpactObservation[] {
  if (request.changedFiles === undefined || request.changedFiles.length === 0) {
    return [];
  }

  const fileInventory = new Set(snapshot.fileInventory.map((file) => file.relativePath));

  return request.changedFiles.map((changedFile) => {
    const normalizedChangedFile = normalizeChangedFile(changedFile, snapshot.projectRoot);
    const relatedFiles = new Set<string>();

    collectImpactFromModuleGraph(snapshot.moduleGraph, normalizedChangedFile, relatedFiles);
    collectImpactFromExportGraph(snapshot.exportGraph, normalizedChangedFile, relatedFiles);

    if (!fileInventory.has(normalizedChangedFile)) {
      relatedFiles.clear();
    }

    return {
      kind: 'change-impact',
      changedFile: normalizedChangedFile,
      affectedFiles: [...relatedFiles].toSorted(),
    };
  });
}

function collectImpactFromModuleGraph(
  moduleGraph: readonly ModuleEdge[],
  changedFile: string,
  relatedFiles: Set<string>,
): void {
  for (const edge of moduleGraph) {
    if (edge.from === changedFile) {
      relatedFiles.add(edge.to);
    }

    if (edge.to === changedFile) {
      relatedFiles.add(edge.from);
    }
  }
}

function collectImpactFromExportGraph(
  exportGraph: readonly ExportEdge[],
  changedFile: string,
  relatedFiles: Set<string>,
): void {
  for (const edge of exportGraph) {
    if (edge.from === changedFile) {
      relatedFiles.add(edge.to);
    }

    if (edge.to === changedFile) {
      relatedFiles.add(edge.from);
    }
  }
}

function normalizeChangedFile(changedFile: string, projectRoot: string): string {
  const absoluteChangedFile = resolve(projectRoot, changedFile);
  const normalizedProjectRoot = `${resolve(projectRoot)}/`;

  if (absoluteChangedFile.startsWith(normalizedProjectRoot)) {
    return absoluteChangedFile.slice(normalizedProjectRoot.length).split('\\').join('/');
  }

  return changedFile.split('\\').join('/');
}
