# AI Agent Configuration

TypeScript static code analysis utility — agent-driven development.

## Project

**Type**: TypeScript static code analysis utility (CLI-only tool)  
**Stage**: Early development (v0.0.1)  
**Stack**: TypeScript 6.0+, TypeScript Compiler API, ESM, pnpm, Node.js 20+

## Roles

| Role     | File                                                 | When                               |
| -------- | ---------------------------------------------------- | ---------------------------------- |
| PD       | [agents/roles/pd.md](agents/roles/pd.md)             | Idea structuring, discovery        |
| PM       | [agents/roles/pm.md](agents/roles/pm.md)             | User stories, backlog creation     |
| ARC      | [agents/roles/arc.md](agents/roles/arc.md)           | Architecture and technical design  |
| PLAN     | [agents/roles/plan.md](agents/roles/plan.md)         | Task breakdown and execution plan  |
| QA       | [agents/roles/qa.md](agents/roles/qa.md)             | Test strategy and quality gates    |
| CODER    | [agents/roles/coder.md](agents/roles/coder.md)       | Implementation                     |
| REV      | [agents/roles/rev.md](agents/roles/rev.md)           | Code review and quality validation |
| DOC      | [agents/roles/doc.md](agents/roles/doc.md)           | Documentation updates              |
| Workflow | [agents/roles/workflow.md](agents/roles/workflow.md) | Full development sequence          |

**Workflow**: `Request → PD → PM → ARC → PLAN → QA → CODER → REV → DOC → Commit` (See [agents/roles/workflow.md](agents/roles/workflow.md))

## Stage Outputs (minimum)

Minimum expected artifacts per stage (guidance — adapt as needed to the task size):

| Stage | Output artifacts (minimum)                      | Typical location                       |
| ----- | ----------------------------------------------- | -------------------------------------- |
| PD    | Problem framing + goals + open questions        | `docs/` (e.g. discovery/vision)        |
| PM    | User stories / acceptance criteria              | `docs/`                                |
| ARC   | Architecture decisions, trade-offs, constraints | `docs/` (e.g. ADRs/architecture notes) |
| PLAN  | Execution plan / task breakdown                 | PR description or `docs/`              |
| QA    | Test plan + quality gates for the change        | PR description or `docs/`              |
| CODER | Implementation + tests                          | `src/`, `test/`                        |
| REV   | Review notes + required follow-ups              | PR review / checklist                  |
| DOC   | Updated documentation & links                   | `docs/`, `agents/`                     |

## Quality gates / Commands

- `pnpm build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm test:coverage` (when coverage validation is needed)

## Rules

| File                                         | IDs     |
| -------------------------------------------- | ------- |
| [Code Quality](agents/rules/code-quality.md) | R01–R07 |
| [Architecture](agents/rules/architecture.md) | A01–A05 |
| [Testing](agents/rules/testing.md)           | T01–T05 |

- **All repository documents must be written in English**: this includes vision, discovery, questions, and other documentation files in `docs/` and related repository documentation.
- **Internal document links must be relative to the repository root**: any link from one repository document to another repository document must use a path relative to the repository root, which is the current project directory. Do not use absolute filesystem paths or current-file-relative paths for internal documentation links.

### Role → Rules Mapping

Each role applies a specific subset of rules. This is the single source of truth — role files do not duplicate rule links.

| Role      | Applicable Rules               |
| --------- | ------------------------------ |
| **PD**    | _(none — does not write code)_ |
| **PM**    | _(none — does not write code)_ |
| **ARC**   | A01–A05, R01–R07               |
| **PLAN**  | _(none — does not write code)_ |
| **QA**    | T01–T05, R01–R03, R07, A01–A03 |
| **CODER** | R01–R07, A01–A05, T01–T05      |
| **REV**   | R01–R07, A01–A05, T01–T05      |
| **DOC**   | R07                            |

## Conflict Resolution

When rules, templates, workflow, and local practices conflict, agents MUST resolve conflicts using this priority order:

1. **User request**: explicit user instructions always take highest priority
2. **Repository safety and architecture constraints**: rules that protect code quality, architecture, and testability (R01–R07, A01–A05, T01–T05)
3. **Role boundaries**: role-specific constraints and handoff requirements
4. **Formatting and templates**: document structure and formatting rules
5. **Style preferences**: naming conventions, formatting details, and stylistic choices

**Examples**:

- If a rule limit conflicts with local practicality: follow the rule unless user explicitly requests an exception
- If a template requirement conflicts with actual project state: adapt the template to match reality while preserving structure
- If document completeness conflicts with prohibition on unnecessary detail: prioritize clarity and conciseness over exhaustive detail

## Document Responsibility

Different layers of documentation serve different purposes. This table clarifies which layer owns what:

| Layer                      | Responsibility                                      | Examples                              |
| -------------------------- | --------------------------------------------------- | ------------------------------------- |
| **AGENTS.md**              | Roles, rule mapping, global constraints, workflow   | Role table, rule links, process rules |
| **agents/roles/\*.md**     | Behavior and responsibilities of a specific role    | QA role, CODER role, review process   |
| **agents/rules/\*.md**     | Enforceable quality and architecture standards      | Code quality, testing, architecture   |
| **agents/templates/\*.md** | Output format and structure for role artifacts      | Discovery template, question format   |
| **docs/**                  | Project-specific analysis, decisions, and questions | Vision, discovery, stories, open Q    |

**Note**: `AGENTS.md` is the single source of truth for **rule mapping and global process**, but not for role behavior, rule details, or output format. Those are owned by their respective layers.

## Rule Verification Mapping

Each rule is associated with a verification mechanism that enforces or validates compliance:

| Rule | Verification Type | Tooling / Process                                     |
| ---- | ----------------- | ----------------------------------------------------- |
| R01  | lint-enforced     | TypeScript compiler (`tsconfig.json: strict: true`)   |
| R02  | lint-enforced     | TypeScript compiler, oxc lint (`no-explicit-any`)     |
| R03  | lint-enforced     | TypeScript compiler (`tsconfig.json: module: ESNext`) |
| R04  | review-enforced   | Manual review in REV stage                            |
| R05  | review-enforced   | Manual review in REV stage (with exception policy)    |
| R06  | lint-enforced     | oxc lint (custom rule or manual check in REV)         |
| R07  | review-enforced   | Manual review in REV stage, DOC stage validation      |
| A01  | review-enforced   | Architecture review in REV stage                      |
| A02  | review-enforced   | Architecture review in REV stage                      |
| A03  | test-enforced     | Unit tests verify pure functions have no side effects |
| A04  | test-enforced     | Dependency injection enables testability              |
| A05  | lint-enforced     | Dependency analysis tooling or REV stage              |
| T01  | review-enforced   | Test files exist alongside or before source code      |
| T02  | test-enforced     | Coverage tooling (vitest coverage reports)            |
| T03  | review-enforced   | Fixture files present in `test/fixtures/`             |
| T04  | test-enforced     | Integration test suite validates e2e flows            |
| T05  | review-enforced   | Naming conventions checked in REV stage               |

**Verification types**:

- **lint-enforced**: automatically checked by tooling (compiler, linter, static analysis)
- **test-enforced**: validated by running tests (coverage, integration, fixtures)
- **review-enforced**: manually checked during REV stage with human judgment
- **manual only**: requires conscious attention but has no automated check

See [agents/tooling.md](agents/tooling.md) for specific tool configuration and commands.

## Resources

- [Best Practices](agents/best-practices.md) — before/while/after coding
- [Reference](agents/reference.md) — commands, files, documentation sections
- [Tooling](agents/tooling.md) — linting, testing, and build configuration

## Tooling & Configuration

See [agents/tooling.md](agents/tooling.md) — linting, testing, and build configuration.

_Last updated: 2026-04-14_
