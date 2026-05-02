/**
 * Core domain contracts for the TypeScript Code Analyzer.
 * All types are purely structural — no implementation logic, no compiler dependencies.
 */

// ---------------------------------------------------------------------------
// Request
// ---------------------------------------------------------------------------

export type WorkflowMode = 'full' | 'public-api' | 'structure';

export type VerbosityLevel = 'concise' | 'normal' | 'verbose';

export interface AnalysisRequest {
  /** Absolute or resolvable path to the target repository. */
  targetPath: string;
  /** Workflow to execute. */
  workflowMode: WorkflowMode;
  /** Explicit list of changed file paths when change-impact analysis is requested. */
  changedFiles?: string[];
  /** Output verbosity for CLI rendering. Defaults to 'concise'. */
  verbosity?: VerbosityLevel;
}

/**
 * Package-level export entry resolved to a project source file when possible.
 */
export interface PackageExportEntry {
  /** Export subpath from package.json, for example "." or "./cli". */
  subpath: string;
  /** Raw package.json target value before source mapping heuristics. */
  target: string;
  /** Source file relative to the project root when it could be resolved. */
  resolvedFile?: string;
}

// ---------------------------------------------------------------------------
// Project Snapshot (compiler adapter output)
// ---------------------------------------------------------------------------

export interface FileInfo {
  /** Absolute path of the source file. */
  absolutePath: string;
  /** Path relative to the project root. */
  relativePath: string;
}

/** Directed dependency edge: `from` imports `to`. */
export interface ModuleEdge {
  from: string;
  to: string;
}

/** Directed export edge: `from` re-exports symbols originally declared in `to`. */
export interface ExportEdge {
  from: string;
  to: string;
  names: string[];
}

export interface ModuleExportInfo {
  /** Source file path relative to the project root. */
  filePath: string;
  /** Exported names observable from the module boundary. */
  exportedNames: string[];
}

export type CompilerDiagnosticSeverity = 'error' | 'warning';

export interface CompilerDiagnostic {
  code: number;
  message: string;
  file?: string;
  severity: CompilerDiagnosticSeverity;
}

export interface ProjectSnapshot {
  /** Absolute path of the analyzed project root. */
  projectRoot: string;
  /** Optional package metadata relevant to public API discovery. */
  packageExports: PackageExportEntry[];
  /** All source files in scope. */
  fileInventory: FileInfo[];
  /** Module-level import/dependency edges. */
  moduleGraph: ModuleEdge[];
  /** Export and re-export edges. */
  exportGraph: ExportEdge[];
  /** Exported names visible per module. */
  moduleExports: ModuleExportInfo[];
  /** Compiler diagnostics relevant to analysis completeness. */
  diagnostics: CompilerDiagnostic[];
}

// ---------------------------------------------------------------------------
// Observations (analyzer outputs)
// ---------------------------------------------------------------------------

export interface StructureObservation {
  kind: 'structure';
  fileCount: number;
  directoryCount: number;
  /** Dominant module type labels (e.g. 'utility', 'service', 'index'). */
  dominantModuleTypes: string[];
  maxHierarchyDepth: number;
}

/** How the public API entry point was discovered. */
export type PublicApiEntryKind = 'package-exports' | 'entry-module' | 're-export';

export interface PublicApiObservation {
  kind: 'public-api';
  entryPoint: string;
  entryKind: PublicApiEntryKind;
  exportedNames: string[];
  /** True when graceful degradation was applied (limited surface signals). */
  limited: boolean;
}

export interface ChangeImpactObservation {
  kind: 'change-impact';
  changedFile: string;
  /** Files that import or re-export from the changed file. */
  affectedFiles: string[];
}

export type HotspotSignal =
  | 'high-fan-in'
  | 'high-fan-out'
  | 'high-public-exposure'
  | 'high-dependency-concentration';

export interface HotspotObservation {
  kind: 'hotspot';
  filePath: string;
  /** Composite score derived from observable signals. */
  score: number;
  signals: HotspotSignal[];
}

export type Observation =
  | StructureObservation
  | PublicApiObservation
  | ChangeImpactObservation
  | HotspotObservation;

export interface ObservationSet {
  structure: StructureObservation[];
  publicApi: PublicApiObservation[];
  changeImpact: ChangeImpactObservation[];
  hotspots: HotspotObservation[];
}

// ---------------------------------------------------------------------------
// Report (final output)
// ---------------------------------------------------------------------------

export type SectionKind = 'structure' | 'public-api' | 'change-impact' | 'hotspots';

export interface ReportSection {
  kind: SectionKind;
  observations: Observation[];
}

export interface ReportMetadata {
  targetPath: string;
  workflowMode: WorkflowMode;
  /** False when diagnostics reduced analysis completeness. */
  analysisComplete: boolean;
  /** Human-readable notes about completeness limitations. */
  caveats: string[];
}

export interface AnalysisReport {
  /** Ordered report sections. */
  sections: ReportSection[];
  metadata: ReportMetadata;
}
