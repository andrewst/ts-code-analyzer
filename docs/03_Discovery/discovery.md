# Discovery — TypeScript Code Analyzer

> Session: 2026-04-14  
> Analyst: PDA

---

## 1. Problem Statement

When a TypeScript npm library grows to large scale (10k+ LOC, multiple contributors), maintaining awareness of the codebase state becomes difficult. Developers cannot easily answer:
- What does this library actually export?
- Which parts are dead code?
- How is the code structured?

Current solutions (reading files manually, IDE navigation) do not scale.

---

## 2. Target Users

| User | Pain |
|------|------|
| **Library maintainer** | Loses visibility into public API surface; dead code accumulates |
| **Onboarding developer** | Needs to understand a large codebase quickly |
| **Tech lead / architect** | Needs metrics and reports on codebase health over time |

---

## 3. Value Proposition

> Turns opaque, sprawling TypeScript codebases into understandable, reportable artifacts — enabling faster maintenance, cleaner public APIs, and better onboarding.

---

## 4. Primary Use Cases

| ID | Use Case | Goal |
|----|----------|------|
| UC1 | Public API extraction | Get a complete list of all exported symbols |
| UC2 | Dead code detection | Find exports with no internal references |
| UC3 | Codebase statistics | Generate summary metrics (LOC, file count, export/import counts) |
| UC4 | Structural overview | Produce a navigable module tree |
| UC5 | CI/CD integration | Run in CI with threshold-based build guards |

---

## 5. Conceptual Feature Breakdown

| Component | Responsibility |
|-----------|---------------|
| **Scanner** | Discover project files, respect `tsconfig.json` and ignore patterns |
| **Parser** | Use TypeScript Compiler API to extract AST data: symbols, imports, exports, types |
| **Analyzer** | Run analysis passes: API extraction, dead code detection, metrics |
| **Reporter** | Output results in multiple formats (CLI table, JSON, Markdown) |
| **CLI** | User-facing commands: `scan`, `report`, `overview` with flags |

---

## 6. User Journeys

### J1: Maintainer reviews public API
```
ts-code-analyzer scan --public-api
→ Structured list of all exports with file locations
→ Maintainer identifies unexpected/leaky exports
```

### J2: New developer explores codebase
```
ts-code-analyzer overview
→ Module tree + export/import summary
→ Developer identifies "hot" modules vs. isolated ones
```

### J3: CI build guard
```
ts-code-analyzer scan --fail-on-unused-exports 100
→ Build fails if unused exports exceed threshold
→ Team gets alerted to clean up
```

---

## 7. Assumptions

| ID | Assumption | Impact if wrong |
|----|------------|-----------------|
| A1 | Projects have a `tsconfig.json` | Tool needs alternative file discovery |
| A2 | Primary value is in large libraries (10k+ LOC) | Small projects may see tool as overkill |
| A3 | TypeScript Compiler API covers needed analysis patterns | Dynamic/runtime patterns may be missed |
| A4 | Users run this as a CLI | Programmatic API may be needed later |

---

## 8. Risks

| ID | Risk | Mitigation |
|----|------|------------|
| R1 | Scope creep into linter territory | Define clear scope boundary — focus on visibility, not prescriptive fixes |
| R2 | False positives on dead code (external consumers) | Label as "no internal usage" not "dead"; support `@public`/`@internal` annotations |
| R3 | Performance on large repos | Benchmark early; optimize file discovery and parsing |
| R4 | Monorepo complexity | Explicitly support or explicitly exclude in v1 |
| R5 | Generated code pollution | Provide ignore patterns or auto-detect generated files |

---

## 9. Open Questions

See [`../../01_Vision/open-questions-from-pda.md`](../../01_Vision/open-questions-from-pda.md) for 6 active questions requiring user input:

| # | Topic |
|---|-------|
| Q1 | Scope boundary vs. existing linters |
| Q2 | Dead code detection scope |
| Q3 | Output formats |
| Q4 | Monorepo support |
| Q5 | Primary activation mode (CLI vs. CI) |
| Q6 | Programmatic API need |

---

## 10. Handoff Readiness for PM

| Checklist Item | Status |
|----------------|--------|
| Idea is coherent and structured | ✓ |
| Target users identified | ✓ |
| Use cases defined (UC1–UC5) | ✓ |
| Feature components identified (5) | ✓ |
| User journeys documented (J1–J3) | ✓ |
| Assumptions exposed | ✓ (4) |
| Risks identified | ✓ (5) |
| Open questions tracked | ✓ (6 active) |

**Ready for PM** after open questions are resolved.
