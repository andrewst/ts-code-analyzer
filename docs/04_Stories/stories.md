# User Stories — TypeScript Code Analyzer

**Date**: 2026-04-14  
**Stage**: PM — User Story Creation  
**Input**: [`../../docs/03_Discovery/discovery.md`](../../03_Discovery/discovery.md)  
**Decisions**: [`../../docs/01_Vision/open-questions-from-pda.md`](../../01_Vision/open-questions-from-pda.md)

---

## 1. Feature Groups Overview

| # | Feature Group | Priority | Source (Discovery) |
|---|---------------|----------|--------------------|
| FG-1 | CLI Interface | P0 — Foundational | Section 4, Journey A–D |
| FG-2 | API Surface Catalog | P0 — Core | UC-1, Section 4, Journey A, D |
| FG-3 | Breaking Change Detection | P0 — Core | Section 4, Journey B |
| FG-4 | Problem Detection (Focused Rule Set) | P0 — Core | UC-2, Section 4, Journey C, D |
| FG-5 | Console + JSON Output | P0 — Core | Section 4, Journey A–D |
| FG-6 | CI/CD Gates | P1 — Secondary | UC-4, Section 4, Journey C |
| FG-7 | Structural Metrics (Contextual) | P1 — Secondary | Section 4, Journey A, C |

---

## 2. User Stories

---

### Feature Group: FG-1 — CLI Interface

#### User Story: CLI-01 — Install and Run Tool
- Description: As a developer, I want to install and run the tool from the command line, so that I can analyze my TypeScript codebase with minimal setup.

- Acceptance Criteria:
  - [ ] Tool is installable via `npm`, `pnpm`, and `yarn`
  - [ ] Running `ts-analyzer --version` prints the current version
  - [ ] Running `ts-analyzer --help` prints usage information with available subcommands
  - [ ] Running `ts-analyzer` without arguments prints help and exits with code `0`

- Notes:
  - Package name TBD (e.g., `ts-analyzer`, `ts-code-analyzer`)

---

#### User Story: CLI-02 — Subcommand Structure
- Description: As a developer, I want distinct subcommands for different analysis modes, so that I can run exactly the type of analysis I need.

- Acceptance Criteria:
  - [ ] `ts-analyzer api <path>` — runs API surface extraction
  - [ ] `ts-analyzer check <path>` — runs problem detection
  - [ ] `ts-analyzer diff <ref1> <ref2> <path>` — runs breaking change comparison
  - [ ] `ts-analyzer report <path>` — generates a combined health report
  - [ ] Each subcommand prints help when invoked with `--help`
  - [ ] Each subcommand exits with code `0` on success, non-zero on failure

- Notes:
  - `report` subcommand may combine API catalog + problem detection output

---

#### User Story: CLI-03 — Project Configuration Resolution
- Description: As a developer, I want the tool to automatically detect and respect my `tsconfig.json`, so that analysis reflects my actual project setup without manual configuration.

- Acceptance Criteria:
  - [ ] Tool auto-detects `tsconfig.json` in the target directory or any ancestor directory
  - [ ] `--project <path>` flag allows specifying a custom `tsconfig.json` location
  - [ ] If no `tsconfig.json` is found, the tool exits with code `2` and prints a clear error message
  - [ ] Tool respects `include`, `exclude`, and `files` patterns from `tsconfig.json`
  - [ ] Tool respects `compilerOptions.paths` (path aliases) and `compilerOptions.baseUrl`
  - [ ] Tool respects `compilerOptions.outDir` — excludes build output directories from analysis

- Notes:
  - This is critical for correctness — wrong path resolution = wrong analysis results

---

#### User Story: CLI-04 — Target Path and Scope Control
- Description: As a developer, I want to analyze a specific file or directory, so that I can focus the tool on the parts of my codebase I care about.

- Acceptance Criteria:
  - [ ] Each analysis subcommand accepts a required `<path>` argument (file or directory)
  - [ ] If `<path>` is a directory, tool analyzes all `.ts` / `.tsx` files within it (recursively)
  - [ ] If `<path>` is a single file, tool analyzes only that file
  - [ ] If `<path>` does not exist, tool exits with code `2` and prints a clear error message
  - [ ] Tool respects `tsconfig.json` `exclude` patterns even when a directory is specified

- Notes:
  - Users will typically run against `./src` or a specific module path

---

#### User Story: CLI-05 — Global Output Format Flag
- Description: As a developer, I want to control the output format across all subcommands, so that I can get results in the format I need (human-readable console or machine-readable JSON).

- Acceptance Criteria:
  - [ ] All subcommands accept `--format <console|json>` flag
  - [ ] Default format is `console`
  - [ ] When `--format json` is used, output is valid JSON to stdout
  - [ ] When `--format json` is used, no non-JSON text (e.g., banners, progress messages) is mixed into stdout
  - [ ] JSON output can be piped to a file: `ts-analyzer api ./src --format json > api.json`

---

### Feature Group: FG-2 — API Surface Catalog

#### User Story: API-01 — Extract All Public Exports
- Description: As a library maintainer, I want to see every public export from my codebase, so that I know exactly what my library's public API surface looks like.

- Acceptance Criteria:
  - [ ] Tool identifies all entry points of the package (via `tsconfig.json` or package.json `main` / `exports` field)
  - [ ] Tool extracts all exported items: functions, classes, interfaces, types, constants, enums, namespaces
  - [ ] Each exported item includes its full signature (e.g., function parameters + return type, class members, interface members)
  - [ ] Output includes the file path where each export is defined
  - [ ] Re-exports from barrel files are traced through to their original definition

- Notes:
  - This is the core feature of the tool — accuracy is paramount

---

#### User Story: API-02 — Distinguish Type-Only Exports
- Description: As a library maintainer, I want type-only exports to be clearly marked separately from runtime exports, so that I understand what consumers can use at runtime vs. only in type positions.

- Acceptance Criteria:
  - [ ] Items exported with `export type { ... }` are marked as `type-only`
  - [ ] Items exported with `export { type X, ... }` have their type-only nature indicated per-item
  - [ ] Regular (runtime) exports are clearly distinguishable from type-only exports in all output formats
  - [ ] Type aliases (`export type Foo = ...`) are cataloged as type-only exports

---

#### User Story: API-03 — Trace Barrel File Re-exports
- Description: As a library maintainer, I want the tool to follow re-export chains through barrel files, so that I see the true origin of each public export, not just the barrel file that re-exports it.

- Acceptance Criteria:
  - [ ] When a symbol is re-exported through one or more barrel files (e.g., `index.ts`), the tool identifies the original definition file
  - [ ] Re-export depth is tracked (e.g., "re-exported through 2 levels")
  - [ ] Output shows both the original file and the barrel file(s) that re-export it
  - [ ] Circular re-export chains are detected and reported (not followed infinitely)

- Notes:
  - Barrel files are a common pattern in TypeScript libraries — handling them correctly is critical for accurate API discovery

---

#### User Story: API-04 — API Catalog Console Output
- Description: As a developer, I want a human-readable console output of the API catalog, so that I can quickly scan my public API in the terminal.

- Acceptance Criteria:
  - [ ] Output is organized by file or module, with clear visual grouping
  - [ ] Each export shows: name, kind (function/class/interface/type/const/enum), signature
  - [ ] Type-only exports are visually distinguished (e.g., `[type]` prefix or different styling)
  - [ ] Total counts are shown at the end (e.g., "Total: 42 exports across 12 files")
  - [ ] Output is readable and not truncated for typical terminal widths (80+ columns)

---

### Feature Group: FG-3 — Breaking Change Detection

#### User Story: DIFF-01 — Compare API Between Two Git References
- Description: As a maintainer preparing a release, I want to compare the API surface between two git commits/branches/tags, so that I can identify breaking changes before publishing.

- Acceptance Criteria:
  - [ ] `ts-analyzer diff <ref1> <ref2> <path>` runs analysis on both git references
  - [ ] Tool checks out each ref, runs API extraction, and compares the results
  - [ ] After comparison, tool restores the working directory to its pre-diff state (or prints a warning if it cannot)
  - [ ] If a ref cannot be checked out, tool exits with code `2` and a clear error message
  - [ ] Tool requires a clean working tree (or `--force` flag) before running diff

- Notes:
  - This is a core differentiator feature for library maintainers

---

#### User Story: DIFF-02 — Detect Removed Exports
- Description: As a maintainer, I want to know when a previously public export has been removed, so that I can assess the impact on consumers.

- Acceptance Criteria:
  - [ ] Any export present in `<ref1>` but absent in `<ref2>` is reported as "removed"
  - [ ] Removed export report includes: name, kind, file path where it was defined
  - [ ] Output distinguishes between removed runtime exports and removed type-only exports
  - [ ] Count of removed exports is displayed in summary

---

#### User Story: DIFF-03 — Detect Renamed Exports
- Description: As a maintainer, I want to know when a public export has been renamed, so that I can update documentation and warn consumers.

- Acceptance Criteria:
  - [ ] When an export from `<ref1>` no longer exists in `<ref2>` but a new export with the same signature (or near-identical) appears, it is flagged as "possibly renamed"
  - [ ] Renamed export report includes: old name, new name (if detected), kind, file path
  - [ ] Rename detection is heuristic-based — output marks it as a "suggestion" not a certainty
  - [ ] Count of possibly renamed exports is displayed in summary

- Notes:
  - Rename detection is inherently heuristic — it should be presented as a suggestion to the user, not a definitive fact

---

#### User Story: DIFF-04 — Detect Signature Changes
- Description: As a maintainer, I want to know when a public export's signature has changed, so that I can identify breaking changes that will affect consumers.

- Acceptance Criteria:
  - [ ] For each export present in both refs, the tool compares full signatures
  - [ ] Function signature changes detected: parameter count, parameter types, return type changes
  - [ ] Class signature changes detected: added/removed/changed public methods, added/removed public properties
  - [ ] Interface signature changes detected: added/removed/changed members
  - [ ] Type alias changes detected: underlying type definition changed
  - [ ] Each change is classified as "breaking" or "non-breaking" (e.g., widening a union return type may be non-breaking for consumers)
  - [ ] Breaking change classification follows semantic versioning logic

- Notes:
  - Breaking vs non-breaking classification is nuanced — initial implementation can be conservative (flag anything changed as "breaking", let user decide)

---

#### User Story: DIFF-05 — Detect Deprecations
- Description: As a maintainer, I want to track which exports have been marked as deprecated between versions, so that I can communicate this to consumers.

- Acceptance Criteria:
  - [ ] Exports with `@deprecated` JSDoc tag in `<ref2>` but not in `<ref1>` are reported as "newly deprecated"
  - [ ] Exports with `@deprecated` JSDoc tag in `<ref1>` but not in `<ref2>` are reported as "deprecation removed"
  - [ ] Deprecation message (text after `@deprecated`) is included in the report
  - [ ] Count of deprecated exports is displayed in summary

---

#### User Story: DIFF-06 — Diff Summary Report
- Description: As a maintainer, I want a concise summary of all detected changes between two versions, so that I can quickly assess the scope of the API change.

- Acceptance Criteria:
  - [ ] Summary includes counts by category: removed, renamed, signature-changed, newly deprecated, deprecation-removed
  - [ ] Summary includes a "breaking change count" (subset of changes classified as breaking)
  - [ ] Summary is printed in both `console` and `json` formats
  - [ ] JSON summary includes full detail of each change, not just counts

---

### Feature Group: FG-4 — Problem Detection (Focused Rule Set)

#### User Story: CHECK-01 — Detect Unused Exports
- Description: As a developer, I want to find exported symbols that are never imported anywhere in the codebase, so that I can remove dead API or mark it as internal.

- Acceptance Criteria:
  - [ ] Tool identifies all exported symbols that have zero internal imports within the analyzed codebase
  - [ ] Exports consumed only by external packages (node_modules) are not flagged as unused
  - [ ] Entry point exports (used by package.json `main` / `exports`) are not flagged as unused
  - [ ] Each unused export is reported with: name, kind, file path
  - [ ] Count of unused exports is displayed in summary

- Notes:
  - This is a high-value rule — unused exports are common in growing libraries

---

#### User Story: CHECK-02 — Detect Circular Dependencies
- Description: As a developer, I want to find circular import chains between modules, so that I can refactor them to improve maintainability and avoid runtime issues.

- Acceptance Criteria:
  - [ ] Tool detects all circular dependency chains (A → B → C → A)
  - [ ] Each circular chain is reported with: the full cycle path (list of files involved), chain length
  - [ ] Self-imports (a file importing itself) are detected and reported
  - [ ] Count of circular dependency chains is displayed in summary
  - [ ] Output shows the complete cycle, not just "A depends on B"

- Notes:
  - Circular dependencies can cause subtle bugs in TypeScript/ESM — this is a high-priority rule

---

#### User Story: CHECK-03 — Detect High Cyclomatic Complexity
- Description: As a developer, I want to find functions with excessive branching logic, so that I can refactor them for readability and maintainability.

- Acceptance Criteria:
  - [ ] Tool calculates cyclomatic complexity for each function/method
  - [ ] Functions exceeding a default threshold (e.g., complexity > 10) are flagged
  - [ ] Each flagged function reports: name, file path, line number, complexity score
  - [ ] Threshold is configurable via CLI flag (e.g., `--max-complexity=15`)
  - [ ] Count of high-complexity functions is displayed in summary

- Notes:
  - Default threshold TBD — 10 is a common industry standard, but this should be configurable

---

#### User Story: CHECK-04 — Detect Dead Code
- Description: As a developer, I want to find functions, variables, or code blocks that are never executed or referenced, so that I can clean up my codebase.

- Acceptance Criteria:
  - [ ] Tool identifies functions that are defined but never called within the analyzed codebase
  - [ ] Tool identifies variables/constants that are defined but never read
  - [ ] Public exports are NOT flagged as dead code (they may be used by consumers)
  - [ ] Each dead code item is reported with: name, kind, file path, line number
  - [ ] Count of dead code items is displayed in summary

- Notes:
  - Dead code detection overlaps with unused exports but focuses on internal (non-exported) symbols too

---

#### User Story: CHECK-05 — Detect Undocumented Public Exports
- Description: As a maintainer, I want to find public exports that lack JSDoc documentation, so that I can ensure my API is properly documented for consumers.

- Acceptance Criteria:
  - [ ] Tool identifies all public exports that have no JSDoc comment (`/** ... */`)
  - [ ] An empty JSDoc comment (`/** */`) is treated as undocumented
  - [ ] A JSDoc comment with at least one line of description text is considered documented
  - [ ] Each undocumented export is reported with: name, kind, file path
  - [ ] Count of undocumented exports is displayed in summary

- Notes:
  - This rule ensures library maintainers don't accidentally expose undocumented API

---

#### User Story: CHECK-06 — Problem Report Output
- Description: As a developer, I want a structured report of all detected problems, so that I can review and prioritize fixes.

- Acceptance Criteria:
  - [ ] All detected problems are listed with: rule ID, severity (error/warning/info), description, file path, line number
  - [ ] Problems are grouped by rule type in output (e.g., "Unused Exports", "Circular Dependencies")
  - [ ] Total problem count is displayed, broken down by severity
  - [ ] Output is available in both `console` and `json` formats
  - [ ] JSON output follows a consistent, versioned schema

---

### Feature Group: FG-5 — Console + JSON Output

#### User Story: OUT-01 — Human-Readable Console Output
- Description: As a developer running the tool interactively, I want clear, readable terminal output, so that I can understand results without parsing JSON.

- Acceptance Criteria:
  - [ ] Console output uses clear visual hierarchy (headers, indentation, grouping)
  - [ ] Severity levels use visual indicators (e.g., colors, emoji, or symbols: 🔴 error, 🟡 warning, 🔵 info)
  - [ ] Output fits within standard terminal widths (80+ columns) without horizontal scrolling
  - [ ] Long lists are presented in a scannable format — not wall-of-text
  - [ ] Console output is colored by default (when stdout is a TTY), with `--no-color` flag to disable

- Notes:
  - Console output quality directly impacts developer experience — this is the primary UI of the tool

---

#### User Story: OUT-02 — Machine-Readable JSON Output
- Description: As a CI/CD pipeline maintainer or programmatic consumer, I want structured JSON output, so that I can parse, store, and act on analysis results automatically.

- Acceptance Criteria:
  - [ ] JSON output is valid JSON (parseable by standard JSON parsers)
  - [ ] JSON schema includes: tool version, analysis timestamp, target path, results (structured by subcommand type)
  - [ ] JSON output contains ALL information shown in console output — no data loss
  - [ ] JSON schema version is included in the output (e.g., `"schemaVersion": "1.0.0"`)
  - [ ] JSON output is written to stdout only (no mixed text)

- Notes:
  - JSON schema becomes a contract — it must be versioned and backward-compatible

---

#### User Story: OUT-03 — JSON Output to File
- Description: As a developer, I want to save JSON output directly to a file, so that I don't have to manually redirect stdout.

- Acceptance Criteria:
  - [ ] `--output <file>` flag writes output to the specified file path
  - [ ] When `--output` is used with `--format json`, file contains valid JSON
  - [ ] When `--output` is used with `--format console`, file contains the console-formatted text (without ANSI color codes)
  - [ ] If the output file's parent directory does not exist, the tool creates it
  - [ ] If the output file cannot be written (permissions, etc.), tool exits with code `2` and a clear error

---

### Feature Group: FG-6 — CI/CD Gates

#### User Story: CI-01 — Non-Zero Exit on Problems
- Description: As a CI/CD pipeline maintainer, I want the tool to return a non-zero exit code when critical problems are found, so that my build can fail automatically.

- Acceptance Criteria:
  - [ ] Exit code `0` = no problems found (or all problems below threshold)
  - [ ] Exit code `1` = problems found at or above configured threshold
  - [ ] Exit code `2` = tool error (e.g., can't read files, invalid config, analysis failure)
  - [ ] Exit code behavior applies to `check` and `report` subcommands
  - [ ] Exit code is documented in `--help` output

---

#### User Story: CI-02 — Configurable Problem Thresholds
- Description: As a CI/CD pipeline maintainer, I want to configure the maximum number of each problem type allowed before the build fails, so that I can enforce quality standards incrementally.

- Acceptance Criteria:
  - [ ] CLI flags allow setting per-rule thresholds: `--max-unused=0`, `--max-circular=0`, `--max-complexity=5`
  - [ ] A global `--max-problems=N` flag sets a threshold for total problem count
  - [ ] If any threshold is exceeded, tool exits with code `1`
  - [ ] Threshold values are displayed in output when set
  - [ ] Default thresholds: no defaults that cause exit code `1` (i.e., by default tool always exits `0` unless user configures thresholds)

- Notes:
  - Conservative defaults — tool should not break existing CI pipelines out of the box

---

#### User Story: CI-03 — Config File for Persistent Settings
- Description: As a project maintainer, I want to store analysis configuration in a file, so that I don't have to pass long CLI flags every time and the whole team shares the same settings.

- Acceptance Criteria:
  - [ ] Tool auto-detects a configuration file (`.ts-analyzerrc`, `.ts-analyzerrc.json`, or `ts-analyzer` key in `package.json`)
  - [ ] Configuration file can specify: problem thresholds, max complexity, output format defaults
  - [ ] CLI flags override configuration file settings
  - [ ] If a configuration file is found but is invalid, tool exits with code `2` and a clear error
  - [ ] Configuration file format and supported keys are documented in `--help`

---

### Feature Group: FG-7 — Structural Metrics (Contextual)

#### User Story: MET-01 — Basic Codebase Statistics
- Description: As a developer, I want to see basic statistics about my codebase, so that I get context for the analysis results.

- Acceptance Criteria:
  - [ ] Tool reports: total file count (`.ts` / `.tsx`), total line count
  - [ ] Tool reports: total export count, total import count
  - [ ] Tool reports: total number of unique modules/files analyzed
  - [ ] Statistics are included at the top or bottom of analysis output
  - [ ] Statistics are included in JSON output under a `metadata` section

---

#### User Story: MET-02 — Complexity Distribution
- Description: As a developer, I want to see the distribution of cyclomatic complexity across my codebase, so that I can understand where complexity is concentrated.

- Acceptance Criteria:
  - [ ] Tool reports: number of functions in each complexity tier (e.g., 1–5, 6–10, 11–20, 20+)
  - [ ] Tool reports: the top 5 most complex functions with their scores
  - [ ] Complexity distribution is shown in both `console` and `json` formats
  - [ ] Complexity stats are part of the `report` subcommand output

---

---

## 3. Dependencies

### Story → Story Dependencies

| Dependent | Depends On | Reason |
|-----------|-----------|--------|
| CLI-02 | CLI-01 | Subcommands require the tool to be installable and runnable |
| CLI-03 | CLI-01 | Config resolution requires the tool to run |
| CLI-04 | CLI-01 | Path control requires the tool to run |
| CLI-05 | CLI-02 | Output format flag applies to subcommands |
| API-01 | CLI-03, CLI-04 | API extraction needs project config and target path |
| API-02 | API-01 | Type-only distinction requires extraction first |
| API-03 | API-01 | Barrel tracing requires extraction first |
| API-04 | API-01, CLI-05 | Console output requires extraction + format support |
| DIFF-01 | API-01 | Diff needs API extraction as a prerequisite |
| DIFF-02 | DIFF-01 | Removed export detection needs diff infrastructure |
| DIFF-03 | DIFF-01 | Rename detection needs diff infrastructure |
| DIFF-04 | DIFF-01 | Signature change detection needs diff infrastructure |
| DIFF-05 | DIFF-01 | Deprecation tracking needs diff infrastructure |
| DIFF-06 | DIFF-02, DIFF-03, DIFF-04, DIFF-05 | Summary aggregates all diff results |
| CHECK-01–05 | CLI-03, CLI-04 | Problem rules need project config and target path |
| CHECK-06 | CHECK-01–05 | Problem report aggregates all rule results |
| OUT-01 | CLI-02, API-04, CHECK-06 | Console output is used by all subcommands |
| OUT-02 | CLI-02, API-04, CHECK-06 | JSON output is used by all subcommands |
| OUT-03 | OUT-02 | File output extends JSON output |
| CI-01 | CHECK-06 | Exit codes depend on problem detection |
| CI-02 | CI-01 | Thresholds depend on exit code behavior |
| CI-03 | CI-02 | Config file extends threshold settings |
| MET-01 | CLI-03, CLI-04 | Metrics need project config and target path |
| MET-02 | MET-01, CHECK-03 | Complexity distribution needs metrics + complexity rule |

### Feature → Feature Dependencies

| Dependent | Depends On | Reason |
|-----------|-----------|--------|
| FG-2 (API Catalog) | FG-1 (CLI Interface) | Needs CLI to run |
| FG-3 (Diff) | FG-2 (API Catalog) | Diff compares API catalogs |
| FG-4 (Problem Detection) | FG-1 (CLI Interface) | Needs CLI to run |
| FG-5 (Output) | FG-1, FG-2, FG-4 | Output formats serve all subcommands |
| FG-6 (CI/CD Gates) | FG-4 (Problem Detection) | CI gates depend on problem detection |
| FG-7 (Metrics) | FG-1 (CLI Interface) | Metrics need CLI to run |

---

## 4. Open Questions

The following questions need user input before implementation can begin. They have been saved to:

📄 **[`../../docs/01_Vision/open-questions-from-pm.md`](../../01_Vision/open-questions-from-pm.md)**

Summary of open questions:

| # | Topic | Why It Matters |
|---|-------|----------------|
| Q1 | Package name | Affects installation, branding, npm publishing |
| Q2 | Default complexity threshold | Affects CHECK-03 user experience out of the box |
| Q3 | Diff working tree safety | Affects whether tool auto-stashes or requires clean tree |
| Q4 | "Undocumented" JSDoc definition | Affects CHECK-05 false positive rate |
| Q5 | Config file format preference | Affects CI-03 implementation |

---

## 5. Out of Scope

The following are explicitly **NOT** included in these user stories, per the Discovery document (Section 9):

- Code auto-fixing or refactoring (this is analysis, not transformation)
- Runtime profiling or performance measurement
- IDE integration (plugins, extensions)
- Support for JavaScript-only projects (TypeScript is the focus)
- Dependency vulnerability scanning
- Monorepo support (single-package only in v1)
- Incremental analysis (analyze only changed files)
- Markdown report generation (can be generated from JSON by consumers)
- Web UI or dashboard
- Custom rule engine configuration (rule system is extensible internally, but user-facing rule configuration is out of v1 scope beyond threshold settings)

---

## Quality Check ✅

| Check | Status |
|-------|--------|
| Can a developer understand the intent without asking questions? | ✅ Each story has clear user, action, and outcome |
| Can QA test acceptance criteria without ambiguity? | ✅ All criteria are measurable and verifiable |
| Are all criteria testable? | ✅ Each `[ ]` item is a binary pass/fail check |
| Are stories non-overlapping and logically grouped? | ✅ Grouped by feature, no duplicate coverage |
| Does every discovery feature have corresponding stories? | ✅ All 7 feature groups covered |
| Are implementation details avoided? | ✅ No architecture, tech stack, or code-level decisions specified |
