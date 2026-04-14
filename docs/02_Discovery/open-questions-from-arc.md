# Open Questions from ARC

**Project**: ts_code_analyzer  
**Last Updated**: 2026-04-14  
**Status**: answered  
**Vision File**: [vision.md](docs/01_Vision/vision.md)

## Unanswered Questions

None remaining.

---

## Answered Questions

### Q1: What exactly counts as "public API size"?

**Context**: The stories define maintenance risk as a ratio between public API size and total codebase size, but do not define the unit for the public API numerator.
**Impact**: This affects the risk ratio, its stability across repositories, and whether the result is comparable between runs.

**Suggested Answers**:

- [ ] **A1**: Count exported symbols only
- [ ] **A2**: Count exported symbols plus re-exports
- [x] **A3**: Count exported declarations, re-exports, and barrel-file exports
- [ ] **Custom**: Define another measurement unit

---

### Q2: What exactly counts as "codebase size"?

**Context**: The stories require a total-codebase denominator, but do not define whether the size is measured by file count, line count, declaration count, or another metric.
**Impact**: This changes the risk ratio and determines whether the summary is lightweight or compiler-intensive.

**Suggested Answers**:

- [ ] **A1**: Count analyzed TypeScript source files
- [ ] **A2**: Count source lines of code
- [x] **A3**: Count TypeScript declarations or AST nodes
- [ ] **Custom**: Define another measurement unit

## Quick Reference

| Symbol   | Meaning                                       |
| -------- | --------------------------------------------- |
| `[ ]`    | Not selected                                  |
| `[x]`    | Selected answer                               |
| ~~text~~ | Question answered (moved to Answered section) |
