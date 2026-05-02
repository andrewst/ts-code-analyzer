import type {
  ModuleExportInfo,
  PackageExportEntry,
  ProjectSnapshot,
  PublicApiEntryKind,
} from '../../contracts/index.js';

export interface PublicEntryPoint {
  entryPoint: string;
  entryKind: PublicApiEntryKind;
}

export interface PublicSurface {
  entryPoints: PublicEntryPoint[];
  reachableModules: Map<string, string[]>;
}

export function discoverPublicSurface(snapshot: ProjectSnapshot): PublicSurface {
  const packageEntryPoints = snapshot.packageExports
    .filter((entry) => entry.resolvedFile !== undefined)
    .map((entry) => ({
      entryPoint: entry.resolvedFile as string,
      entryKind: 'package-exports' as const,
    }));

  const entryPoints =
    packageEntryPoints.length > 0
      ? packageEntryPoints
      : discoverFallbackEntryPoints(snapshot.fileInventory);

  return {
    entryPoints,
    reachableModules: new Map(
      entryPoints.map((entryPoint) => [
        entryPoint.entryPoint,
        traverseReExportClosure(entryPoint.entryPoint, snapshot),
      ]),
    ),
  };
}

export function collectPublicExportNames(
  entryPoint: string,
  moduleExports: readonly ModuleExportInfo[],
): string[] {
  const moduleExportMap = new Map(moduleExports.map((item) => [item.filePath, item.exportedNames]));

  return [...(moduleExportMap.get(entryPoint) ?? [])].toSorted();
}

function discoverFallbackEntryPoints(
  fileInventory: readonly { relativePath: string }[],
): PublicEntryPoint[] {
  const filePaths = new Set(fileInventory.map((fileInfo) => fileInfo.relativePath));
  const fallbackCandidates = ['src/index.ts', 'src/index.tsx', 'index.ts', 'index.tsx'];

  return fallbackCandidates
    .filter((candidate) => filePaths.has(candidate))
    .map((entryPoint) => ({ entryPoint, entryKind: 'entry-module' as const }));
}

function traverseReExportClosure(entryPoint: string, snapshot: ProjectSnapshot): string[] {
  const adjacency = buildReExportAdjacency(snapshot.packageExports, snapshot.exportGraph);
  const queue = [entryPoint];
  const visited = new Set<string>();
  const reachableModules: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift() as string;
    if (visited.has(current)) {
      continue;
    }

    visited.add(current);
    reachableModules.push(current);

    for (const next of adjacency.get(current) ?? []) {
      if (!visited.has(next)) {
        queue.push(next);
      }
    }
  }

  return reachableModules.toSorted();
}

function buildReExportAdjacency(
  packageExports: readonly PackageExportEntry[],
  exportGraph: readonly { from: string; to: string }[],
): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();

  for (const exportEdge of exportGraph) {
    const neighbors = adjacency.get(exportEdge.from) ?? [];
    neighbors.push(exportEdge.to);
    adjacency.set(exportEdge.from, neighbors);
  }

  for (const entry of packageExports) {
    if (entry.resolvedFile !== undefined && !adjacency.has(entry.resolvedFile)) {
      adjacency.set(entry.resolvedFile, []);
    }
  }

  return adjacency;
}
