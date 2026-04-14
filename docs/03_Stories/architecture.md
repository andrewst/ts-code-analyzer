# Architecture

**Project**: TypeScript Code Analyzer
**Date**: 2026-04-14
**Status**: ready
**Source**: `docs/03_Stories/stories.md`

## Architecture Overview

The v0.0.1 architecture should be a layered CLI analysis pipeline built around one primary workflow: public API inspection, with structural, change-impact, and hotspot signals produced from the same shared project model. The core analysis logic should remain pure and independent from CLI parsing, filesystem access, and TypeScript program construction so QA and CODER can test deterministic behavior without I/O coupling. To preserve observational output, analysis modules should emit normalized facts and scored signals, while a dedicated presentation layer is solely responsible for concise CLI phrasing.

## Proposed Module Boundaries

- `src/cli/` - parse command-line arguments, validate user intent, and invoke application workflows without embedding analysis logic
- `src/application/` - orchestrate end-to-end analysis use cases and compose dependencies for the selected workflow
- `src/project-loading/` - resolve the target repository, tsconfig entry, include/exclude scope, and optional change input into a stable analysis request
- `src/compiler/` - create and expose TypeScript Compiler API adapters that produce source file, symbol, and export metadata for downstream analysis
- `src/contracts/` - define shared domain types for project snapshots, dependency edges, exports, change sets, observations, and report sections
- `src/analysis/structure/` - derive high-level structural summaries from the loaded project snapshot
- `src/analysis/public-api/` - identify externally exposed entry points, exported declarations, and export chains using repository-visible signals
- `src/analysis/change-impact/` - connect an explicit change set to potentially affected files, exports, and dependency neighbors
- `src/analysis/hotspots/` - compute maintenance-relevant centrality and risk signals from structure, exports, and dependency concentration
- `src/presentation/` - convert report sections into concise observational CLI output without changing analytical meaning

## Technical Flow

1. The CLI accepts a target path and workflow options, then passes a normalized request to the application layer.
2. The project-loading layer resolves repository context, tsconfig-driven file scope, and optional changed-file input into a stable project request.
3. The compiler layer builds a TypeScript-backed project snapshot containing source files, module relationships, symbol/export metadata, and diagnostics needed for analysis.
4. The structure analyzer produces a concise codebase overview that becomes the baseline context for all later report sections.
5. The public API analyzer derives exposed surface observations from explicit repository signals such as package exports, top-level entry modules, and re-export chains.
6. When change input is present, the change-impact analyzer maps changed nodes to import/export and dependency neighbors to surface likely follow-up inspection areas.
7. The hotspot analyzer scores central or risky areas using observable signals such as fan-in, fan-out, public exposure, and dependency concentration.
8. The presentation layer renders the final report as concise observations, clearly separating observed facts from inferred impact signals.

## Data Flow and Contracts

- Input: `AnalysisRequest`
  - target repository path
  - selected workflow mode
  - optional explicit changed-file list or change manifest
  - output verbosity constraints for concise CLI rendering
- Intermediate result: `ProjectSnapshot`
  - normalized file inventory
  - module dependency graph
  - export graph
  - compiler diagnostics relevant to analysis completeness
- Intermediate result: `ObservationSet`
  - `StructureObservation[]`
  - `PublicApiObservation[]`
  - `ChangeImpactObservation[]`
  - `HotspotObservation[]`
- Output: `AnalysisReport`
  - ordered report sections
  - per-section observations
  - bounded metadata for caveats and incomplete analysis

The key contract boundary is between project extraction and analysis. `src/compiler/` may use the TypeScript Compiler API and filesystem-backed program creation, but all analyzers must consume a pure `ProjectSnapshot` shape rather than compiler objects directly. This keeps analysis deterministic, prevents TypeScript internals from leaking into presentation, and allows each analyzer to be tested against fixtures or synthetic snapshots.

Public API identification should follow an explicit precedence order to avoid over-interpretation:

1. package-level `exports` or equivalent package entry signals when available
2. well-known repository entry modules such as `src/index.ts`
3. transitive re-exports reachable from those entry modules

Change-impact analysis should consume explicit change input instead of directly depending on git commands in core logic. This keeps the architecture CLI-friendly and testable while still satisfying the user story about connecting observed changes to potentially affected areas.

## Key Design Decisions

- Use a layered pipeline with pure analyzers and impure adapters. This satisfies A03 and A04 by isolating filesystem and compiler concerns from the analytical core.
- Build one shared `ProjectSnapshot` for all feature groups. Structural, public API, change-impact, and hotspot analyses all depend on the same repository facts, so duplicate parsing would add cost and inconsistency.
- Keep public API as a distinct analyzer rather than treating every export as public. This aligns with the approved v0.0.1 priority and avoids conflating internal module structure with consumer-facing surface.
- Represent change impact as observed adjacency and exposure signals, not certainty claims. This preserves the product requirement to use observational language instead of prescriptive conclusions.
- Keep report rendering in a dedicated presentation layer. Analyzer output should stay semantic and machine-usable, while CLI formatting enforces concise human-readable summaries.
- Maintain unidirectional dependencies: `cli -> application -> project-loading/compiler -> contracts -> analysis -> presentation` at composition time, with analyzers depending only on `contracts`. This prevents circular dependencies and keeps ownership boundaries clear.

## Error Handling and Scope Boundaries

- Missing or invalid repository path, tsconfig resolution failures, and unsupported project loading conditions must terminate early in the CLI/application layer with user-facing error messages; analyzers should not handle path-level I/O failures.
- Compiler diagnostics may reduce confidence in results but should not automatically abort analysis unless the project snapshot cannot be built. Partial analysis is acceptable if the report states that completeness is reduced.
- Repositories without clear package exports or top-level entry modules are in scope, but the public API analyzer must degrade gracefully by reporting that exposed surface signals are limited rather than inventing visibility.
- Large repositories are in scope only when output remains concise. Presentation must cap section size and prioritize highest-signal observations instead of dumping exhaustive raw lists.
- Automated code modification, refactoring advice, and ranked implementation prescriptions remain out of scope. The architecture supports observations and signals only.
- Direct VCS integration is not required in core modules for v0.0.1. If a future CLI adapter reads git state, it should convert that input into the same explicit change-set contract used by `src/analysis/change-impact/`.

## Open Technical Questions

See `docs/02_Discovery/open-questions-from-arc.md` for unresolved architecture decisions.

## Blocking Conditions

None.

## Done Criteria

ARC's work is complete when ALL of the following are satisfied:

- [x] Architecture file exists and follows this template structure
- [x] Module boundaries are explicitly defined with ownership
- [x] Data flow and control flow are described for all user stories
- [x] Dependencies between modules are directional and acyclic
- [x] Key design decisions are documented with rationale
- [x] Error handling and scope boundaries are defined
- [x] All blocking open questions are answered (no questions with `Status: blocking` remain unanswered)
- [x] Open questions file is created or synchronized with correct statuses

## Handoff Readiness

| Checklist Item | Status |
| -------------- | ------ |
| Coherence - architecture has one clear approach | [x] |
| Boundaries - modules have single responsibilities | [x] |
| Testability - core logic can be tested without I/O | [x] |
| Maintainability - dependency flow is directional | [x] |
| Handoff quality - QA and CODER can proceed with implementation | [x] |

**Verdict**: ready

## Technical Summary

The recommended architecture is a CLI-orchestrated, shared-snapshot analysis pipeline that keeps extraction, analysis, and presentation separate. Its main tradeoff is a slightly larger initial contract surface in exchange for cleaner module isolation, deterministic analysis logic, and a stable foundation for adding future workflows without entangling TypeScript compiler access with user-facing reporting.
