# Open Questions from PDA

**Date**: 2026-04-14
**Status**: ✅ All answered — ready for PM handoff

---

## Active Questions

_(none)_

---

## Answered Questions

### Q1: What specific "problems in code" should the tool detect?

**Answer**: **A)** Start with a focused set: unused exports, circular dependencies, high cyclomatic complexity, dead code, undocumented public exports. Expand later.

**Implication**: Detection engine ships with a small, high-value rule set. Each rule is designed to fill gaps that ESLint/oxlint don't address — focusing on architectural and API-level problems rather than style or basic correctness.

---

### Q2: Should the tool focus only on public API analysis, or also internal code health?

**Answer**: **A)** Public API is the primary feature; internal code health is secondary but supported (API-first, metrics-second).

**Implication**: The tool's identity is a "public API analyzer with code health awareness." Internal metrics support the primary goal — e.g., knowing that a complex internal module backs a simple public export helps prioritize refactoring.

---

### Q3: What does "получать больше информации о состоянии кода" mean concretely?

**Answer**: **B)** API-centric: list of all public types/functions with signatures, breaking change detection between versions, deprecation tracking.

**Implication**: Reporting is API-first. The core output is a structured catalog of everything the library exposes, enriched with version-comparison intelligence (breaking changes, deprecations). Structural metrics (file counts, complexity) are secondary context, not the main product.

---

### Q4: Should the tool support monorepos out of the box?

**Answer**: **B)** No — single-package only for v1; monorepo support is future work.

**Implication**: v1 assumes a single `tsconfig.json` and a single package root. Users in monorepos can run the tool per-package manually. This keeps initial file resolution and config handling simple.

---

### Q5: What is the minimum viable output format?

**Answer**: **B)** Console + JSON output (for CI/CD and programmatic consumption).

**Implication**: Two output targets from day one:
- **Console**: human-readable, terminal-friendly formatting
- **JSON**: machine-readable, suitable for CI/CD pipelines, programmatic consumption, and future tooling (dashboards, diffs)

Markdown report is deferred (can be generated from JSON by consumers if needed).
