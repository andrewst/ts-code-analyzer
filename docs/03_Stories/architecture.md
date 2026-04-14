# Architecture

**Project**: ts_code_analyzer  
**Date**: 2026-04-14  
**Status**: ready  
**Source**: [stories.md](docs/03_Stories/stories.md)

## Architecture Overview

The tool should use a small analysis pipeline: resolve the target repository, build a TypeScript program, extract the public surface, compute size metrics, and render a concise CLI summary. Core analysis must remain pure and operate on structured inputs so that repository access, TypeScript compiler access, and CLI output stay isolated.
Public API size is defined as the count of exported declarations, re-exports, and barrel-file exports. Codebase size is defined as the count of TypeScript declarations or AST nodes used by the analysis model, so the maintenance-risk ratio stays derived from the same compiler-backed representation.

## Proposed Module Boundaries

- `src/cli/` - argument parsing, orchestration, and terminal output
- `src/io/` - filesystem access, path resolution, and repository discovery
- `src/analysis/public-surface/` - exported symbol and re-export extraction
- `src/analysis/metrics/` - public API size and codebase size measurement
- `src/analysis/risk/` - maintenance-risk ratio calculation and ranking logic
- `src/model/` - shared data contracts for analysis results and summary output

## Technical Flow

1. Resolve the repository root and validate that the target fits the supported v1 scope.
2. Build a TypeScript program for the repository and collect source files that belong to the analysis set.
3. Extract exported symbols, re-exports, and ambiguous public-facing items into a normalized public-surface model.
4. Measure public API size and total codebase size, derive the maintenance-risk ratio, and render a compact CLI summary.

## Data Flow and Contracts

- Input: repository path, CLI options, and TypeScript project metadata
- Intermediate result: `AnalysisContext`, `PublicSurfaceModel`, `CodebaseSizeModel`, `MaintenanceRiskModel`
- Output: `AnalysisReport` containing public-surface details, risk ratio, and a human-readable summary

The analysis layer should only consume structured models and return structured results. Presentation logic should read from the final report only and must not recompute metrics.

## Key Design Decisions

- Keep TypeScript compiler interaction behind a repository/analysis adapter so core logic remains testable without I/O.
- Treat ambiguous exports as part of the public surface, but mark them explicitly in the model so the CLI can surface uncertainty.
- Compute the maintenance signal from a single ratio model using the defined public-surface count and codebase-size count rather than multiple overlapping scores.
- Keep the CLI summary decision-oriented: the report should identify what deserves manual inspection first, not dump raw compiler output.

## Error Handling and Scope Boundaries

- Reject unsupported v1 cases early, including mixed JS/TS projects, monorepos, and generated-code-heavy repositories.
- Report missing or unreadable project metadata as a user-facing analysis failure rather than a partial success.
- Preserve ambiguous public API items instead of hiding them, because the product scope prefers inclusion by default.
- Keep analysis deterministic for a given repository snapshot; do not mix in network access or non-local inputs.

## Open Technical Questions

See [open-questions-from-arc.md](docs/02_Discovery/open-questions-from-arc.md) for unresolved architecture decisions.

## Handoff Readiness

| Checklist Item | Status |
| --- | --- |
| Coherence - architecture has one clear approach | [x] |
| Boundaries - modules have single responsibilities | [x] |
| Testability - core logic can be tested without I/O | [x] |
| Maintainability - dependency flow is directional | [x] |
| Handoff quality - QA and CODER can proceed with implementation | [x] |

**Verdict**: ready

## Technical Summary

The design is straightforward: isolate I/O, keep analysis pure, and build one report that feeds the CLI. The ratio is now defined well enough for implementation, with the remaining work focused on coding the adapters and report model.
