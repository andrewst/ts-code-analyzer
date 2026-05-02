import type { ProjectSnapshot, PublicApiObservation } from '../../contracts/index.js';

import { collectPublicExportNames, discoverPublicSurface } from '../shared/public-surface.js';

/**
 * Derive public API observations using package exports first and conventional
 * entry modules as a fallback.
 *
 * @param snapshot Snapshot produced by the compiler adapter.
 * @returns Public API observations for each discovered entry point.
 */
export function analyzePublicApi(snapshot: ProjectSnapshot): PublicApiObservation[] {
  const publicSurface = discoverPublicSurface(snapshot);

  if (publicSurface.entryPoints.length === 0) {
    return [
      {
        kind: 'public-api',
        entryPoint: '<unresolved>',
        entryKind: 'entry-module',
        exportedNames: [],
        limited: true,
      },
    ];
  }

  return publicSurface.entryPoints.map((entryPoint) => ({
    kind: 'public-api',
    entryPoint: entryPoint.entryPoint,
    entryKind: entryPoint.entryKind,
    exportedNames: collectPublicExportNames(entryPoint.entryPoint, snapshot.moduleExports),
    limited: false,
  }));
}
