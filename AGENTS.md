# AI Agent Configuration

Rules, roles, skills, and workflows for AI agent-driven development of the TypeScript Code Analyzer.

---

## Project Overview

**Type**: TypeScript dead-code detection utility (CLI tool + library)  
**Stage**: Early development (v0.0.1)  
**Stack**: TypeScript 6.0+, TypeScript Compiler API, ESM, pnpm  
**Goal**: Detect unused exports in TypeScript libraries by analyzing AST, public API surface, and usage graphs  
**Architecture**: RFC-driven — see `docs/rfc_dead_code_detection.md`

---

## 1. Rules

### 1.1 Code Quality

| ID | Rule | Why |
|----|------|-----|
| R01 | **Strict TypeScript**: `strict: true` always | Type safety |
| R02 | **No `any`**: use `unknown` or proper types | Type system integrity |
| R03 | **ESM only**: `import`/`export` syntax | Matches tsconfig |
| R04 | **Named exports preferred**: no `export default` unless required | Tree-shaking, symbol tracking |
| R05 | **File < 300 lines, function < 50 lines** | Testability |
| R06 | **No `console.log` in core logic**: use proper error handling | Clean CLI output |
| R07 | **JSDoc on all exported functions/types** | Self-documenting |

### 1.2 Architecture

| ID | Rule | Why |
|----|------|-----|
| A01 | **Follow RFC**: components match `docs/rfc_dead_code_detection.md` | Architectural integrity |
| A02 | **Component isolation**: each component in its own directory | Independent testing |
| A03 | **Pure core logic**: no side effects, no I/O in analysis functions | Deterministic, testable |
| A04 | **Dependency injection**: constructor/args, no globals | Mockability |
| A05 | **No circular dependencies**: unidirectional data flow | Clear architecture |

### 1.3 Testing

| ID | Rule | Why |
|----|------|-----|
| T01 | **Test-first**: tests before or alongside code | Coverage, clarity |
| T02 | **100% core coverage**: Scanner, Parser, API Builder, Graph Builder, Detector | Critical path |
| T03 | **Fixtures in `test/fixtures/`**: one per scenario from RFC Section 9 | Reproducible edge cases |
| T04 | **Integration tests**: end-to-end with real TypeScript projects | Pipeline validation |
| T05 | **Naming**: `describe('<ComponentName>')`, `it('should <behavior>')` | Clarity |

### 1.4 Git Workflow

| ID | Rule | Why |
|----|------|-----|
| G01 | **Atomic commits**: one logical change per commit | Review, bisect, revert |
| G02 | **Conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:` | Changelog, history |
| G03 | **No direct main commits**: feature branches | Stable main |
| G04 | **Update docs with code**: RFC deviation → document it | Documentation currency |

---

## 2. Roles

| Abbr      | Role | Responsibility | When |
|-----------|------|----------------|------|
| **PM**    | Product Manager | Turn ideas into actionable tasks: user stories, prioritization, acceptance criteria | New feature request, idea clarification, backlog grooming |
| **ARC**   | Architect | Design interfaces, data structures, algorithms | New feature, refactor, ambiguity |
| **CODER** | Implementer | Write production code | Most tasks |
| **QA**    | Test Engineer | Write tests, create fixtures | Before/during implementation |
| **REV**   | Reviewer | Check rule compliance, correctness, edge cases | After implementation |
| **DOC**   | Documentarian | Update README, docs, RFC, JSDoc | Feature complete, API change |

### Constraints

The Product Manager (PM):
- ✍️ Writes **user stories** and **acceptance criteria**
- 📋 Prioritizes the backlog
- ❌ Does **not** write code
- ❌ Does **not** make architectural decisions

### Workflow

```
Request → PM (user story + acceptance criteria) → ARC (if needed) → TE (failing tests) → IMP → REV → DOC (if needed) → Commit + Verify
```

---

## 3. Skills

### 3.1 Built-in

| Skill | Use |
|-------|-----|
| `/review` | After each component implementation |
| `/review <file> --comment` | Inline feedback on specific files |

### 3.2 Custom (configure when ready)

| Skill | Command | When |
|-------|---------|------|
| `type-check` | `tsc --noEmit` | After every change |
| `build-verify` | `pnpm run build && node dist/index.js --help` | Before commit |
| `test-all` | (test runner command) | After implementation |
| `check-dead-code` | `pnpm run start -- --src ./src` | Self-analysis |

---

## 4. Best Practices

### Before Writing Code

1. Read `docs/rfc_dead_code_detection.md`
2. Read sibling files for style/patterns
3. Ask user on architectural ambiguity
4. Write tests first (TDD)

### While Writing Code

1. Follow R01–R07 (strict typing, no `any`)
2. Match existing style: indentation, naming, import order
3. Add JSDoc on all exports
4. Throw custom errors from `src/utils/errors.ts`
5. Keep core logic pure

### After Writing Code

1. `tsc --noEmit` — must pass
2. All tests pass, coverage meets threshold
3. Linter clean (once configured)
4. Run tool on itself
5. Update docs if implementation differs from RFC

### Commit Message Format

```
<type>(<scope>): <subject>

<body — bullet points>

Refs: RFC Section X.Y
```

### Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| `any` for AST nodes | Use TypeScript AST types from chosen library |
| Mix I/o with core logic | Separate pure functions from I/O |
| Skip edge cases | Reference RFC Section 9 |
| Over-engineer | Start simple, add complexity when proven |
| Skip tests | Every change includes tests |
| Ignore performance | Consider file count, memory for large codebases |

---

## 5. Target File Structure

```
src/
├── index.ts
├── cli/
│   ├── args.ts
│   ├── config.ts
│   └── output.ts
├── core/
│   ├── scanner/
│   │   ├── scanner.ts
│   │   ├── types.ts
│   │   └── scanner.test.ts
│   ├── parser/
│   │   ├── parser.ts
│   │   ├── exports.ts
│   │   ├── imports.ts
│   │   ├── types.ts
│   │   └── parser.test.ts
│   ├── api-builder/
│   │   ├── api-builder.ts
│   │   ├── types.ts
│   │   └── api-builder.test.ts
│   ├── graph-builder/
│   │   ├── graph-builder.ts
│   │   ├── graph.ts
│   │   ├── types.ts
│   │   └── graph-builder.test.ts
│   └── detector/
│       ├── detector.ts
│       ├── rules.ts
│       ├── types.ts
│       └── detector.test.ts
├── types/
│   └── index.ts
└── utils/
    ├── path.ts
    └── errors.ts
```

---

## 6. Quick Reference

### Commands

| Command | Purpose |
|---------|---------|
| `pnpm run dev` | Type-check watch (no emit) |
| `pnpm run build` | Compile |
| `pnpm run start -- <args>` | Run with tsx |

### Key Files

| File | Purpose |
|------|---------|
| `docs/rfc_dead_code_detection.md` | Architecture |
| `docs/description_task.md` | Task description |
| `tsconfig.json` | TypeScript config |
| `package.json` | Dependencies, scripts |

### Key RFC Sections

| Section | Topic |
|---------|-------|
| 3 | Dead code definition, public API, valid usage |
| 4 | Component architecture |
| 5 | Data flow |
| 6 | Implementation strategy |
| 7 | Output format |
| 9 | Edge cases and limitations |

---

*Last updated: 2026-04-13*
