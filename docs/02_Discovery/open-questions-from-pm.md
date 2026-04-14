# Open Questions from PM

**Project**: ts_code_analyzer  
**Last Updated**: 2026-04-14  
**Status**: answered  
**Discovery File**: [discovery.md](docs/02_Discovery/discovery.md)

## Unanswered Questions

None remaining.

## Answered Questions

### Q1: How should maintenance risk be presented to the user?
**Context**: The discovery defines maintenance risk as the relationship between public API size and total codebase size, but it does not define the user-facing presentation.
**Impact**: This changes how clearly the summary communicates risk and how easy it is to compare projects.

**Suggested Answers**:
- [ ] **A1**: A qualitative label such as low, medium, or high
- [x] **A2**: A numeric ratio only
- [ ] **A3**: Both a ratio and a qualitative label
- [ ] **Custom**: Define another presentation format

---

### Q2: How should the tool handle ambiguous public API boundaries?
**Context**: Re-exports, barrel files, and unusual export patterns can make the public surface unclear.
**Impact**: This affects trust in the public API summary and whether the tool should call out uncertainty explicitly.

**Suggested Answers**:
- [x] **A1**: Include them in the public API summary by default
- [ ] **A2**: Flag them as ambiguous and show them separately
- [ ] **A3**: Exclude ambiguous items unless they are clearly public
- [ ] **Custom**: Define a different handling rule

---

### Q3: Should v1 explicitly support mixed JS/TS projects, monorepos, and generated code?
**Context**: The discovery lists these as risks and edge cases, but does not state whether they are in scope for the first version.
**Impact**: This determines the initial scope and what users should expect the tool to handle reliably.

**Suggested Answers**:
- [ ] **A1**: Yes, treat them as supported cases in v1
- [x] **A2**: No, exclude them from v1 scope
- [ ] **A3**: Detect them and warn, but do not fully support them
- [ ] **Custom**: Define a different scope rule

## Quick Reference

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not selected |
| `[x]` | Selected answer |
| ~~text~~ | Question answered (moved to Answered section) |
