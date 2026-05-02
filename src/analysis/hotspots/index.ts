import type { HotspotObservation, ProjectSnapshot } from '../../contracts/index.js';

import { discoverPublicSurface } from '../shared/public-surface.js';

const HOTSPOT_LIMIT = 5;

/**
 * Compute maintenance hotspot signals from static dependency topology.
 *
 * @param snapshot Snapshot produced by the compiler adapter.
 * @returns Highest-signal hotspot observations.
 */
export function analyzeHotspots(snapshot: ProjectSnapshot): HotspotObservation[] {
  const fanIn = new Map<string, number>();
  const fanOut = new Map<string, number>();
  const publicExposure = new Map<string, number>();
  const filePaths = snapshot.fileInventory.map((fileInfo) => fileInfo.relativePath);

  for (const edge of snapshot.moduleGraph) {
    fanOut.set(edge.from, (fanOut.get(edge.from) ?? 0) + 1);
    fanIn.set(edge.to, (fanIn.get(edge.to) ?? 0) + 1);
  }

  for (const modules of discoverPublicSurface(snapshot).reachableModules.values()) {
    for (const filePath of modules) {
      publicExposure.set(filePath, (publicExposure.get(filePath) ?? 0) + 1);
    }
  }

  return filePaths
    .map((filePath) => createHotspotObservation(filePath, fanIn, fanOut, publicExposure))
    .filter((observation) => observation.signals.length > 0)
    .toSorted(
      (left, right) => right.score - left.score || left.filePath.localeCompare(right.filePath),
    )
    .slice(0, HOTSPOT_LIMIT);
}

function createHotspotObservation(
  filePath: string,
  fanIn: ReadonlyMap<string, number>,
  fanOut: ReadonlyMap<string, number>,
  publicExposure: ReadonlyMap<string, number>,
): HotspotObservation {
  const incoming = fanIn.get(filePath) ?? 0;
  const outgoing = fanOut.get(filePath) ?? 0;
  const exposure = publicExposure.get(filePath) ?? 0;
  const signals: HotspotObservation['signals'] = [];

  if (incoming >= 2) {
    signals.push('high-fan-in');
  }

  if (outgoing >= 2) {
    signals.push('high-fan-out');
  }

  if (exposure >= 1) {
    signals.push('high-public-exposure');
  }

  if (incoming >= 2 && outgoing >= 2) {
    signals.push('high-dependency-concentration');
  }

  return {
    kind: 'hotspot',
    filePath,
    score:
      incoming * 3 +
      outgoing * 2 +
      exposure * 2 +
      (signals.includes('high-dependency-concentration') ? 2 : 0),
    signals,
  };
}
