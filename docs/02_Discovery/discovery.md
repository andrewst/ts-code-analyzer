# Discovery

**Project**: TypeScript Code Analyzer
**Date**: 2026-04-14
**Status**: ready
**Source**: `docs/01_Vision/vision.md`

---

## Product Understanding

TypeScript Code Analyzer is a CLI-only static analysis product for engineers who need to understand unfamiliar or growing TypeScript codebases faster than manual reading allows. Its value is to convert code structure, public API exposure, and maintenance-relevant signals into practical command-line insights that support everyday maintenance and change analysis decisions. For v0.0.1, the primary workflow should center on public API inspection, and the CLI should emphasize observed facts rather than prescriptive recommendations.

## Target Users

- Repository maintainers - need to inspect structure, exported surface, and likely maintenance hotspots before making changes.
- Engineers onboarding to an existing codebase - need a fast way to identify important modules, public entry points, and areas worth reading first.
- Engineers reviewing or planning changes - need to estimate what may be affected by a change without relying only on manual inspection.

## Core Need

Users need a fast, reliable way to answer a small set of maintenance-critical questions about a TypeScript codebase: what the codebase exposes, which areas matter most, what changed, and where likely impact or maintenance risk exists. The product should reduce investigation time by presenting actionable signals instead of low-level compiler details.

## Conceptual Feature Areas

- Structural codebase inspection - reveal high-level module, file, or package structure so users can orient themselves quickly.
- Public API surface discovery - serve as the primary v0.0.1 workflow by identifying what is exposed publicly and which interfaces matter for consumers or maintainers.
- Change impact signals - connect changes to potentially affected areas so users can focus review and follow-up effort.
- Maintenance hotspot identification - highlight areas that appear more important, central, or risky to maintainers without over-interpreting findings for the user.

## User Journey

1. A user points the CLI at a TypeScript codebase they need to understand or update.
2. The user runs an analysis command focused on public API inspection to identify exported surface and the most relevant exposed areas.
3. The user uses the reported observations to narrow attention to the modules or entry points that require manual inspection.
4. The user uses the output to decide what to inspect manually next, what to review more carefully, and where maintenance effort should focus.
5. Edge-case flow: if the codebase is large, unfamiliar, or only partially changed, the user still expects the CLI to present concise observations about exposed surface and relevant areas without overwhelming output or asserting conclusions too strongly.

## Assumptions

- Users already have local access to the TypeScript codebase and prefer CLI workflows over graphical interfaces.
- Users value concise, actionable summaries more than exhaustive raw analysis output.
- Public API visibility is meaningful for at least a subset of target repositories and is useful during maintenance work.
- Maintenance decisions can be improved by surfacing prioritized signals about structure, exposure, and change impact.

## Risks And Edge Cases

- Different repository layouts may make it unclear what should count as the practical public API.
- Very large codebases may produce too much output unless the tool prioritizes signal over volume.
- Some codebases may have limited explicit exports, which reduces the usefulness of public API-oriented analysis.
- Change-related analysis may be interpreted differently by users unless product language clearly distinguishes observed changes from likely impact.

## Open Questions

See `docs/01_Vision/open-questions-from-pd.md` for the recorded answers that further constrain PM story-writing.

## Blocking Conditions

None.

## Done Criteria

PD's work is complete when ALL of the following are satisfied:

- [x] Discovery file exists and follows this template structure
- [x] Product idea is structured with problem statement, target users, and value proposition
- [x] User journeys cover primary flows and at least one edge-case flow
- [x] Feature breakdown is high-level but unambiguous (no implementation details)
- [x] Assumptions and risks are explicitly listed
- [x] All blocking open questions are answered (no questions with `Status: blocking` remain unanswered)
- [x] Open questions file is created or synchronized with correct statuses

## PM Handoff Readiness

| Checklist Item | Status |
| -------------- | ------ |
| Coherence - idea is structured and logical | [x] |
| User focus - journeys cover primary flows | [x] |
| Completeness - use cases cover the main needs | [x] |
| Scope clarity - feature breakdown is unambiguous | [x] |
| Handoff quality - PM can derive user stories from this input | [x] |

**Verdict**: ready

## Product Summary

TypeScript Code Analyzer is a CLI tool for engineers and maintainers who need to understand TypeScript codebases and assess maintenance impact faster than manual inspection allows. For v0.0.1, PM should focus stories around public API inspection as the primary workflow, supported by structural understanding and maintenance-relevant signals delivered as concise observational CLI output.
