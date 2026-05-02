import type {
  AnalysisReport,
  ChangeImpactObservation,
  HotspotObservation,
  Observation,
  PublicApiObservation,
  StructureObservation,
} from '../contracts/index.js';

const MAX_LIST_ITEMS = 5;

/**
 * Format an analysis report into observational CLI-friendly text.
 *
 * @param report Analysis report produced by the application pipeline.
 * @returns Human-readable report text for standard output.
 */
export function formatAnalysisReport(report: AnalysisReport): string {
  const lines = [
    `Target: ${report.metadata.targetPath}`,
    `Workflow: ${report.metadata.workflowMode}`,
    `Analysis complete: ${report.metadata.analysisComplete ? 'yes' : 'no'}`,
  ];

  if (report.metadata.caveats.length > 0) {
    lines.push('', 'Caveats:');
    lines.push(...report.metadata.caveats.map((caveat) => `- ${caveat}`));
  }

  for (const section of report.sections) {
    lines.push('', `${formatSectionTitle(section.kind)}:`);

    if (section.observations.length === 0) {
      lines.push('- no observations');
      continue;
    }

    lines.push(...section.observations.map((observation) => formatObservation(observation)));
  }

  return `${lines.join('\n')}\n`;
}

function formatSectionTitle(kind: AnalysisReport['sections'][number]['kind']): string {
  switch (kind) {
    case 'structure':
      return 'Structure';
    case 'public-api':
      return 'Public API';
    case 'change-impact':
      return 'Change Impact';
    case 'hotspots':
      return 'Hotspots';
  }
}

function formatObservation(observation: Observation): string {
  switch (observation.kind) {
    case 'structure':
      return formatStructureObservation(observation);
    case 'public-api':
      return formatPublicApiObservation(observation);
    case 'change-impact':
      return formatChangeImpactObservation(observation);
    case 'hotspot':
      return formatHotspotObservation(observation);
  }
}

function formatStructureObservation(observation: StructureObservation): string {
  const dominantModules =
    observation.dominantModuleTypes.length === 0
      ? 'none observed'
      : observation.dominantModuleTypes.join(', ');

  return `- observed ${observation.fileCount} files across ${observation.directoryCount} directories; dominant module types: ${dominantModules}; max depth: ${observation.maxHierarchyDepth}`;
}

function formatPublicApiObservation(observation: PublicApiObservation): string {
  const exportedNames =
    observation.exportedNames.length === 0
      ? 'no exported names observed'
      : summarizeList(observation.exportedNames);
  const limitation = observation.limited ? '; visible surface is limited' : '';

  return `- observed entry point ${observation.entryPoint} via ${observation.entryKind}; exported names: ${exportedNames}${limitation}`;
}

function formatChangeImpactObservation(observation: ChangeImpactObservation): string {
  const affectedFiles =
    observation.affectedFiles.length === 0
      ? 'no affected neighbors observed'
      : summarizeList(observation.affectedFiles);

  return `- observed change input ${observation.changedFile}; affected files: ${affectedFiles}`;
}

function formatHotspotObservation(observation: HotspotObservation): string {
  const signals = summarizeList(observation.signals);

  return `- observed hotspot candidate ${observation.filePath}; score ${observation.score}; signals: ${signals}`;
}

function summarizeList(values: readonly string[]): string {
  if (values.length <= MAX_LIST_ITEMS) {
    return values.join(', ');
  }

  const visibleValues = values.slice(0, MAX_LIST_ITEMS).join(', ');
  return `${visibleValues} (+${values.length - MAX_LIST_ITEMS} more)`;
}
