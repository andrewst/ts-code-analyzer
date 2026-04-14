# Stories

**Project**: ts_code_analyzer  
**Date**: 2026-04-14  
**Status**: ready  
**Source**: [discovery.md](docs/02_Discovery/discovery.md)

## 1. Feature Groups Overview

- Public API understanding
- Maintenance risk detection
- Concise CLI summary

## 2. User Stories

### Feature Group: Public API understanding

#### User Story: Summarize the public surface
- Description: As a library maintainer, I want to see which TypeScript symbols and re-exports are publicly exposed, so that I can understand the library's public surface quickly.

- Acceptance Criteria:
  - [ ] The tool identifies publicly exposed TypeScript symbols and re-exports in the analyzed repository.
  - [ ] The summary distinguishes public surface information from non-public code.
  - [ ] The output is understandable without manually reading the full repository.

- Notes (optional, NON-technical):
  - Ambiguous public API boundaries are included in the public API summary by default.

### Feature Group: Maintenance risk detection

#### User Story: Assess maintenance risk from surface size
- Description: As a tech lead or maintainer, I want a maintenance-risk signal based on the relationship between public API size and total codebase size, so that I can spot when the surface area may be harder to maintain.

- Acceptance Criteria:
  - [ ] The output includes a maintenance-risk signal.
  - [ ] The signal is based on the relationship between public API size and total codebase size.
  - [ ] The summary explains why the codebase is being highlighted as lower or higher risk.

- Notes (optional, NON-technical):
  - The maintenance-risk signal is presented as a numeric ratio.

### Feature Group: Concise CLI summary

#### User Story: Review a decision-ready overview
- Description: As a maintainer, I want a concise human-readable CLI summary that combines public API and maintenance-risk signals, so that I can decide what to inspect next.

- Acceptance Criteria:
  - [ ] The tool produces a human-readable CLI summary.
  - [ ] The summary includes public API and maintenance-risk signals in one view.
  - [ ] The summary is concise enough to support review and release decisions.
  - [ ] The summary points the user toward what deserves manual inspection first.

- Notes (optional, NON-technical):
  - The summary should stay focused on decision-making, not raw data volume.

## 3. Dependencies

- Story dependencies:
  - `Review a decision-ready overview` depends on `Summarize the public surface` and `Assess maintenance risk from surface size`.
- Feature dependencies:
  - `Concise CLI summary` depends on the outputs of `Public API understanding` and `Maintenance risk detection`.
  - `Maintenance risk detection` depends on a public API summary and a codebase size signal.

## 4. Open Questions

See [open-questions-from-pm.md](docs/02_Discovery/open-questions-from-pm.md).

## 5. Out of Scope

- Code refactoring or automated fixes.
- Machine-readable output as the primary experience.
- Non-local repository analysis as the main workflow.
- Architectural or implementation decisions.
- Mixed JS/TS projects, monorepos, and generated code support in v1.
- Detailed tuning of analysis algorithms.
