# Product Discovery — TypeScript Code Analyzer

**Date**: 2026-04-14  
**Stage**: Product Discovery (PDA)  
**Input**: [`../../docs/01_Vision/vision.md`](../../01_Vision/vision.md)

---

## 1. Core Value Proposition

**One sentence**: A static analysis CLI tool that gives developers of large TypeScript/npm libraries rapid, actionable insight into the health and state of their codebase.

**Why it matters**: As TypeScript libraries grow, manual code review becomes impractical. Developers need an automated way to surface structural problems, understand their public API footprint, and generate reports — without running the code or setting up complex tooling.

---

## 2. Target Users

| User Segment | Context | Primary Need |
| --- | --- | --- |
| **Library maintainers** | Maintain a public TypeScript/npm package with many consumers | Understand what the public API actually exposes; detect accidental breaking changes |
| **Team leads / architects** | Oversee a large internal TypeScript codebase across multiple teams | Get a high-level health report: complexity hotspots, dead code, dependency tangles |
| **Individual contributors** | Work on a specific module within a large library | Quickly understand unfamiliar code; find issues before they reach review |

---

## 3. Main Use Cases

### UC-1: Public API Discovery
A developer runs the tool against their library and receives a complete, accurate listing of all exported types, functions, classes, and interfaces — the actual public API surface.

### UC-2: Code Health Report
A developer runs the tool and receives a structured report with metrics and identified problems (e.g., unused exports, overly complex functions, circular dependencies, dead code).

### UC-3: Quick State Overview
A developer runs the tool with a summary flag and receives a concise dashboard-style output: file count, export count, problem count, severity breakdown.

### UC-4: CI/CD Integration
A pipeline runs the tool and fails the build if critical issues exceed a threshold (e.g., new circular dependencies, undocumented exports).

---

## 4. Conceptual Feature Breakdown

| Feature Group | What It Covers | Priority |
| --- | --- | --- |
| **API Surface Catalog** | Extract and list all public exports (types, functions, classes, interfaces, constants) with full signatures from entry points; trace through barrel files / re-export chains | **P0 — Core** |
| **Breaking Change Detection** | Compare API surface between two versions/commits; identify removed, renamed, or signature-changed exports; track deprecations | **P0 — Core** |
| **Problem Detection (focused rule set)** | Unused exports, circular dependencies, high cyclomatic complexity, dead code, undocumented public exports — intentionally scoped to what ESLint/oxlint DON'T cover | **P0 — Core** |
| **CLI Interface** | Command-line tool with subcommands for different analysis modes (`api`, `check`, `report`, `diff`) | **P0 — Foundational** |
| **Console + JSON Output** | Human-readable terminal output AND machine-readable JSON for CI/CD pipelines and programmatic consumption | **P0 — Core** |
| **CI/CD Gates** | Exit codes, threshold configuration, JSON output for pipeline consumption | **P1 — Secondary** |
| **Structural Metrics (contextual)** | File count, export/import counts — available as supporting context, not the primary product | **P1 — Secondary** |
| **Monorepo Support** | Workspace root detection, per-package analysis | **P2 — Future (not v1)** |
| **Incremental Analysis** | Analyze only changed files since last run | **P2 — Future** |

### Decisions from Open Questions

| Question | Decision |
| --- | --- |
| Q1 — Which problems to detect? | Focused rule set: unused exports, circular deps, complexity, dead code, undocumented exports |
| Q2 — API only or code health too? | API-first, code-health-secondary |
| Q3 — What concrete information to report? | API-centric: full signature catalog, breaking change detection, deprecation tracking |
| Q4 — Monorepo support? | Not in v1 — single-package only |
| Q5 — Output format? | Console + JSON from day one |

---

## 5. User Journeys

### Journey A: First-Time API Discovery
```
Developer discovers the tool
  → installs via pnpm/npm
  → runs: ts-analyzer api ./src
  → receives console output: full catalog of public exports with signatures
  → drills down: ts-analyzer api ./src --format json > api.json
  → shares API catalog with team or uses it for documentation
```

### Journey B: Breaking Change Check Before Release
```
Maintainer prepares v2.0.0 release
  → runs: ts-analyzer diff v1.0.0 HEAD ./src
  → receives report: 3 breaking changes detected (removed export, renamed function, changed signature)
  → reviews each breaking change, decides which are intentional
  → updates changelog with breaking change notes
  → runs: ts-analyzer check ./src --format json > report.json
  → attaches JSON report to release
```

### Journey C: Routine Code Health Check in CI
```
Maintainer adds tool to CI pipeline
  → pipeline runs: ts-analyzer check ./src
  → build fails: 2 circular dependencies + 15 unused exports detected
  → maintainer reviews issue list, removes unused exports
  → refactors circular dependency
  → re-runs: build passes
```

### Journey D: Investigating an Unfamiliar Module
```
Developer inherits maintenance of a module
  → runs: ts-analyzer api ./src/module-name
  → sees all public exports with signatures, complexity notes
  → runs: ts-analyzer check ./src/module-name
  → identifies dead code and undocumented exports
  → quickly understands the module's role and pain points
```

---

## 6. Edge Cases & Boundary Conditions

| Edge Case | Why It Matters | v1 Handling |
| --- | --- | --- |
| **Barrel files (re-exports)** | Should trace through re-export chains to find true API surface | Trace through all re-export levels |
| **Generated code** | Should skip `.d.ts`, build output directories | Respect `tsconfig.json` exclude patterns; allow CLI override |
| **Type-only exports vs runtime exports** | Consumers care about both; analysis should distinguish | Catalog both, mark `type` exports separately |
| **Very large codebases (10k+ files)** | Performance matters; incremental analysis becomes critical | Accept slower initial run; incremental is P2 |
| **Non-standard tsconfig** | Should respect user's tsconfig.json, not impose defaults silently | Auto-detect `tsconfig.json`; allow `--project` flag |
| **Monorepos** | Workspace roots have multiple tsconfig files | **Out of v1 scope** — user runs per-package manually |

---

## 7. Assumptions

| # | Assumption | Risk If Wrong |
| --- | --- | --- |
| A1 | Users already have TypeScript as a dependency and tsconfig.json configured | Tool may need to handle projects without standard TS setup |
| A2 | The primary output target is the developer's terminal (console) | If users want a web UI or IDE plugin, scope expands significantly |
| A3 | Static analysis (no runtime execution) is sufficient | Some issues (e.g., runtime type mismatches) require execution-level analysis |
| A4 | The tool analyzes libraries, not applications | Application-focused analysis would need different metrics (route coverage, component props, etc.) |

---

## 8. Risks & Open Questions

All open questions have been answered. See [`../../docs/01_Vision/open-questions-from-pda.md`](../../01_Vision/open-questions-from-pda.md) for the decision log.

### Residual Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Breaking change detection requires two analyzable git refs | Users without git history or with non-git VCS can't use this feature | Document clearly; feature is opt-in |
| Focused rule set may feel too limited | Users expect broader detection out of the box | Design rule system to be extensible; document how to add rules |
| JSON output schema becomes a contract | Future changes must be backward-compatible | Version the JSON schema from day one |

---

## 9. Out of Scope (Explicitly)

- Code auto-fixing or refactoring (this is analysis, not transformation)
- Runtime profiling or performance measurement
- IDE integration (plugins, extensions) — could be future, not now
- Support for JavaScript-only projects (TypeScript is the focus)
- Dependency vulnerability scanning (that's a different tool category)

---

## 10. Readiness for PM Handoff

| Checklist Item | Status |
| --- | --- |
| Coherence — idea is structured, logical, no contradictions | ✅ |
| User focus — journeys cover primary and edge-case flows | ✅ |
| Completeness — use cases address all identified user needs | ✅ |
| Scope clarity — feature breakdown is high-level but unambiguous | ✅ |
| Handoff quality — PM receives clear input with no unresolved ambiguities | ✅ |

**Verdict**: ✅ All open questions resolved. Discovery is complete and ready for PM to write user stories.

### Product Identity (Summary for PM)

The tool is an **API-first static analysis CLI** for TypeScript libraries. Its primary job is to tell library maintainers:

1. **What your public API actually looks like** — full catalog with signatures
2. **What changed between versions** — breaking changes, deprecations
3. **What problems hide in your codebase** — focused rule set (unused exports, circular deps, complexity, dead code, undocumented exports)

**v1 constraints**: single-package only, console + JSON output, extensible rule system but focused initial rule set.
