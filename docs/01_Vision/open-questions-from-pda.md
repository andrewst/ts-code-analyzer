# Open Questions from PDA

**Project**: ts_code_analyzer  
**Last Updated**: 2026-04-14  
**Vision File**: [vision.md](./vision.md)

## Unanswered Questions

None

---

## Answered Questions

### Q1: What is the intended input scope?
**Context**: The vision says the tool analyzes large TypeScript npm libraries, but it does not yet state whether the main input is a local repository, a published package, or both.
**Impact**: This affects how the product is framed for users and which workflows PM should prioritize.

**Suggested Answers**:
- [x] **A1**: Local repository analysis only
- [ ] **A2**: Local repository first, with package metadata support later
- [ ] **A3**: Local repositories and published npm packages equally
- [ ] **Custom**: Define a different input scope

---

### Q2: What should v1 treat as the public API boundary?
**Context**: "Public API" can mean exported symbols, package.json `exports`, generated type declarations, or documentation-facing entry points.
**Impact**: This determines what the tool must recognize as public-facing and what counts as an API change.

**Suggested Answers**:
- [ ] **A1**: `package.json` exports and entry points
- [x] **A2**: Exported TypeScript symbols and re-exports
- [ ] **A3**: A combined boundary including package metadata and exports
- [ ] **Custom**: Define a project-specific API boundary model

---

### Q3: What is the primary output format for the user?
**Context**: The vision emphasizes quick understanding, but not whether the user should receive terminal output, JSON, markdown, or another format.
**Impact**: This changes how users consume the tool and how PM should describe the core experience.

**Suggested Answers**:
- [x] **A1**: Human-readable CLI summary
- [ ] **A2**: Machine-readable JSON output
- [ ] **A3**: Both human-readable and machine-readable output
- [ ] **Custom**: Another primary format

---

### Q4: How should the tool define "maintenance risk" at the product level?
**Context**: The vision now defines maintenance risk as the relationship between the size of the public API and the total size of the codebase.
**Impact**: This determines what the tool should calculate and which signals the PM should treat as the core risk metric.

**Suggested Answers**:
- [x] **A1**: Public API size relative to total codebase size
- [ ] **A2**: Structural complexity and coupling signals
- [ ] **A3**: Change volatility and churn signals
- [ ] **Custom**: Define another risk model

## Quick Reference

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not selected |
| `[x]` | Selected answer |
| ~~text~~ | Question answered (moved to Answered section) |
