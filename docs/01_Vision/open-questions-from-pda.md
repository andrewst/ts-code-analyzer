# Open Questions from PDA

**Project**: TypeScript Code Analyzer
**Last Updated**: 2026-04-14
**Status**: answered
**Source Role**: PDA
**Primary Source File**: `docs/02_Discovery/discovery.md`
**Related Source Files**:

- `docs/01_Vision/vision.md`
- `docs/00_Idea/idea.md`

## Document Status Notes

- This document-level status reflects the overall state, but each individual question has its own `Status` field
- Document `blocked` means there is at least one question with `Status: blocking` that remains unanswered
- Document `current` means all blocking questions are answered, but non-blocking or deferred questions may remain
- Document `answered` means all questions have been resolved

## Unanswered Questions

None.

## Answered Questions

### Q1: Which analysis perspective should define the first CLI workflow in v0.0.1?

**Context**: The vision includes structural insights, public API discovery, change-related signals, and maintenance hotspots.
**Impact**: PM can write more focused stories if the first user workflow is framed around one primary entry point instead of several equally weighted ones.
**Status**: answered
**Answered By**: user
**Answered Date**: 2026-04-14

**Suggested Answers**:

- [ ] **A1**: Start with general codebase exploration as the primary workflow.
- [x] **A2**: Start with public API inspection as the primary workflow.
- [ ] **A3**: Start with change impact review as the primary workflow.
- [ ] **Custom**: Write a different priority for the first workflow.

---

### Q2: What level of user guidance should the CLI output provide in v0.0.1?

**Context**: The vision emphasizes actionable signals, but the degree of interpretation is still open.
**Impact**: PM can define stories differently depending on whether output should mainly describe findings or also suggest where the user should look next.
**Status**: answered
**Answered By**: user
**Answered Date**: 2026-04-14

**Suggested Answers**:

- [x] **A1**: Output should mainly report observations and let users interpret them.
- [ ] **A2**: Output should report observations and explicitly highlight likely next inspection targets.
- [ ] **A3**: Output should provide brief summaries plus ranked recommendations for attention.
- [ ] **Custom**: Define a different level of guidance.

---

## Conventions

- Use markdown checkboxes: `[ ]` for unselected answers and `[x]` for the selected answer.
- Do not use `✓` or other status markers for answer selection.
- Keep question numbering stable when possible (`Q1`, `Q2`, `Q3`, ...).
- Remove exact duplicates when synchronizing an existing file.
- When synchronizing, update Status and Owner fields as context changes.
