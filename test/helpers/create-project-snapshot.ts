import type { ProjectSnapshot } from '../../src/contracts/index.js';

export function createProjectSnapshot(overrides: Partial<ProjectSnapshot> = {}): ProjectSnapshot {
  return {
    projectRoot: '/virtual/project',
    packageExports: [],
    fileInventory: [],
    moduleGraph: [],
    exportGraph: [],
    moduleExports: [],
    diagnostics: [],
    ...overrides,
  };
}
