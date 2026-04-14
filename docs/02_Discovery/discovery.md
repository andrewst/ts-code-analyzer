# Discovery

**Project**: ts_code_analyzer  
**Date**: 2026-04-14  
**Status**: ready  
**Source**: [vision.md](./docs/01_Vision/vision.md)

---

## Product Understanding

The product is a TypeScript static analysis CLI for maintainers of large TypeScript npm libraries who need a fast, trustworthy view of the current state of their codebase. The vision focuses on helping people understand what is publicly exposed and where maintenance risk is increasing without manually reading the entire project. Maintenance risk is explicitly framed as the relationship between public API size and total codebase size, with the output intended to support everyday maintenance decisions rather than provide raw data.

## Target Users

- Library maintainers - people responsible for keeping a large TypeScript package healthy and who need quick review signals.
- Senior engineers and reviewers - people who need to inspect public API impact before merging or releasing.
- Tech leads or owners - people who want a high-level health overview to decide what deserves attention first.

## Core Need

Help maintainers answer three recurring questions quickly: what is publicly exposed through exported TypeScript symbols and re-exports, how large the public API is relative to the total codebase, and where maintenance risk is increasing.

## Conceptual Feature Areas

- Public API understanding - identifies exported TypeScript symbols and re-exports that form the public surface.
- Maintenance risk detection - compares public API size to total codebase size as a signal of maintenance risk.
- Concise CLI summary - gives a quick snapshot that supports review, triage, and release decisions.

## User Journey

1. The maintainer points the CLI at a local TypeScript npm library.
2. The tool evaluates the repository at a high level and gathers the relevant codebase signals.
3. The maintainer reviews a compact human-readable summary of public API exposure and maintenance-risk signals.
4. The maintainer uses the output to decide what needs manual inspection, review, or follow-up work.

## Assumptions

- The main use case is analyzing an existing local repository, not authoring or refactoring code.
- The primary user is already familiar with TypeScript library maintenance.
- The tool is expected to work on large codebases where manual inspection is too slow.
- The output is intentionally human-readable first rather than machine-readable first.
- The output must be actionable enough to influence maintenance decisions, not just describe files.

## Risks And Edge Cases

- Public API boundaries may be ambiguous in libraries that use re-exports, barrel files, or unconventional export patterns.
- Large or heavily modular codebases may produce too much noise unless the output stays strongly filtered and prioritized.
- Generated code, monorepos, mixed JS/TS projects, and package-specific conventions may complicate consistent analysis.
- The vision implies accuracy, so false positives or missed API boundaries would directly reduce trust in the tool.
- The maintenance-risk model is still underspecified, so the first version may either over-report noise or miss the most important warning signs.

## Open Questions

None at the moment. See [open-questions-from-pda.md](./docs/01_Vision/open-questions-from-pda.md) for the current clarification record.

## PM Handoff Readiness

| Checklist Item | Status |
| --- | --- |
| Coherence - idea is structured and logical | [x] |
| User focus - journeys cover primary flows | [x] |
| Completeness - use cases cover the main needs | [x] |
| Scope clarity - feature breakdown is unambiguous | [x] |
| Handoff quality - PM can derive user stories from this input | [x] |

**Verdict**: ready

## Product Summary

A discovery tool for maintainers of large TypeScript npm libraries that quickly explains what the public API is and how large it is relative to the total codebase. v1 should focus on producing a concise, trustworthy overview that helps a maintainer decide what to inspect next.
