# Open Questions from ARC

**Project**: ts_code_analyzer
**Last Updated**: 2026-04-14
**Status**: answered
**Source Role**: ARC
**Primary Source File**: `docs/03_Stories/stories.md`
**Related Source Files**:

- `docs/01_Vision/vision.md`
- `docs/02_Discovery/discovery.md`

## Document Status Notes

- This document-level status reflects the overall state, but each individual question has its own `Status` field
- Document `blocked` means there is at least one question with `Status: blocking` that remains unanswered
- Document `current` means all blocking questions are answered, but non-blocking or deferred questions may remain
- Document `answered` means all questions have been resolved

## Unanswered Questions

None

## Answered Questions

### Q1: What exactly counts as "public API size"?

**Context**: The stories define maintenance risk as a ratio between public API size and total codebase size, but do not define the unit for the public API numerator.
**Impact**: This affects the risk ratio, its stability across repositories, and whether the result is comparable between runs.
**Status**: answered
**Answered By**: User
**Answered Date**: 2026-04-14

**Suggested Answers**:

- [ ] **A1**: Count exported symbols only
- [ ] **A2**: Count exported symbols plus re-exports
- [x] **A3**: Count exported declarations, re-exports, and barrel-file exports
- [ ] **Custom**: Define another measurement unit

---

### Q2: What exactly counts as "codebase size"?

**Context**: The stories require a total-codebase denominator, but do not define whether the size is measured by file count, line count, declaration count, or another metric.
**Impact**: This changes the risk ratio and determines whether the summary is lightweight or compiler-intensive.
**Status**: answered
**Answered By**: User
**Answered Date**: 2026-04-14

**Suggested Answers**:

- [ ] **A1**: Count analyzed TypeScript source files
- [ ] **A2**: Count source lines of code
- [x] **A3**: Count TypeScript declarations or AST nodes
- [ ] **Custom**: Define another measurement unit
