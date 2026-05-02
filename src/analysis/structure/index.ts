import type { ProjectSnapshot, StructureObservation } from '../../contracts/index.js';

/**
 * Summarize high-level project structure signals from a pure project snapshot.
 *
 * @param snapshot Snapshot produced by the compiler adapter.
 * @returns Structural observations for the analyzed project.
 */
export function analyzeStructure(snapshot: ProjectSnapshot): StructureObservation[] {
  const directories = new Set<string>();
  const moduleTypeCounts = new Map<string, number>();
  let maxHierarchyDepth = 0;

  for (const fileInfo of snapshot.fileInventory) {
    const segments = fileInfo.relativePath.split('/');
    const directoriesOnly = segments.slice(0, -1);
    maxHierarchyDepth = Math.max(maxHierarchyDepth, directoriesOnly.length);

    for (let index = 0; index < directoriesOnly.length; index += 1) {
      directories.add(directoriesOnly.slice(0, index + 1).join('/'));
    }

    const moduleType = classifyModuleType(fileInfo.relativePath);
    moduleTypeCounts.set(moduleType, (moduleTypeCounts.get(moduleType) ?? 0) + 1);
  }

  const dominantModuleTypes = [...moduleTypeCounts.entries()]
    .toSorted((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 3)
    .map(([moduleType]) => moduleType);

  return [
    {
      kind: 'structure',
      fileCount: snapshot.fileInventory.length,
      directoryCount: directories.size,
      dominantModuleTypes,
      maxHierarchyDepth,
    },
  ];
}

function classifyModuleType(relativePath: string): string {
  const lowerCasePath = relativePath.toLowerCase();
  const fileName = lowerCasePath.split('/').at(-1) ?? '';

  if (fileName === 'index.ts' || fileName === 'index.tsx') {
    return 'index';
  }

  if (lowerCasePath.endsWith('.test.ts') || lowerCasePath.endsWith('.spec.ts')) {
    return 'test';
  }

  if (lowerCasePath.includes('service')) {
    return 'service';
  }

  if (
    lowerCasePath.includes('/utils/') ||
    lowerCasePath.includes('util') ||
    lowerCasePath.includes('helper')
  ) {
    return 'utility';
  }

  return 'module';
}
