# Open Questions from PDA

> Session: 2026-04-14 — Initial Discovery

---

## Active Questions

### Q1: Scope boundary vs. existing linters

**Context:** Tools like ESLint, oxlint, and Biome already detect dead code, complexity, and unused imports. We need to clarify what makes this tool *distinct* so it doesn't become a linter competitor.

**Suggested answers:**
- **A.** Focus on *public API surface analysis* — what exports exist, how they relate, what consumers see. Linters don't do this holistically.
- **B.** Focus on *cross-module dependency analysis* — import graphs, coupling metrics, cycle detection across the entire library.
- **C.** Focus on *reporting & visibility* — produce human-readable summaries of codebase state, not prescriptive "fix this" suggestions.
- **D.** Complement linters — run after linting, focus on architectural-level insights rather than line-level issues.

---

### Q2: Dead code detection scope

**Context:** If we detect "unused exports," we can only know about *internal* usage. An export might be consumed by external packages we can't see. Flagging it as "dead" could be misleading.

**Suggested answers:**
- **A.** Only flag exports with zero internal references — mark them as "no internal usage, may be used externally" rather than "dead."
- **B.** Allow users to annotate exports with `@public` or `@internal` JSDoc — only flag internal exports that are unused.
- **C.** Skip dead code detection entirely in v1 — focus on API extraction and reporting first.

---

### Q3: Output formats

**Context:** Different users need different outputs. Maintainers may want CLI output for quick checks; CI pipelines may want JSON/structured data.

**Suggested answers:**
- **A.** Start with CLI table output + JSON — add Markdown/HTML reports later.
- **B.** Start with JSON only — build CLI visualization on top of it.
- **C.** Support CLI + Markdown from the start — JSON is secondary.

---

### Q4: Monorepo support

**Context:** Many large TS libraries live in monorepos (pnpm workspaces, Nx, Turborepo). Ignoring this limits the tool's audience; supporting it adds complexity.

**Suggested answers:**
- **A.** Support monorepos from v1 — accept a `--workspace` flag that analyzes each package.
- **B.** Single-package only for v1 — document monorepo support as a roadmap item.
- **C.** Support monorepos by accepting a root `tsconfig.json` that references all packages.

---

### Q5: Primary activation mode

**Context:** How will users primarily run this tool?

**Suggested answers:**
- **A.** CLI-first — developer runs it manually when needed.
- **B.** CI-first — tool is integrated into CI pipelines; results are reviewed passively.
- **C.** Both equally — design CLI and CI output formats in parallel.

---

### Q6: Programmatic API

**Context:** Should the tool expose a Node.js API so other tools/scripts can use it as a library?

**Suggested answers:**
- **A.** No — CLI only for v1. Programmatic API adds surface area.
- **B.** Yes — expose a minimal API (`analyze(config)`) alongside CLI from the start.
- **C.** Yes, but later — plan for it architecturally but don't implement in v1.

---

## Answered Questions

_(none yet)_
