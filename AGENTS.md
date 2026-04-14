# AI Agent Configuration

TypeScript static code analysis utility — agent-driven development.

## Project

**Type**: TypeScript static code analysis utility (CLI tool)  
**Stage**: Early development (v0.0.1)  
**Stack**: TypeScript 6.0+, TypeScript Compiler API, ESM, pnpm

## Roles

| Role     | File                                                 | When                              |
| -------- | ---------------------------------------------------- | --------------------------------- |
| PDA      | [agents/roles/pda.md](agents/roles/pda.md)           | Idea structuring, discovery       |
| PM       | [agents/roles/pm.md](agents/roles/pm.md)             | User stories, backlog creation    |
| ARC      | [agents/roles/arc.md](agents/roles/arc.md)           | Architecture and technical design |
| Workflow | [agents/roles/workflow.md](agents/roles/workflow.md) | Full development sequence         |

**Workflow**: See [agents/roles/workflow.md](agents/roles/workflow.md)

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

| Role      | Applicable Rules                   |
| --------- | ---------------------------------- |
| **PDA**   | _(none — does not write code)_     |
| **PM**    | _(none — does not write code)_     |
| **ARC**   | A01–A05, R01–R07                   |
| **QA**    | T01–T05, R01–R03, R07, A01–A03     |
| **CODER** | R01–R07, A01–A05, T01–T05, G01–G04 |
| **REV**   | R01–R07, A01–A05, T01–T05, G01–G04 |
| **DOC**   | R07, G04                           |

## Resources

- [Best Practices](agents/best-practices.md) — before/while/after coding
- [Reference](agents/reference.md) — commands, files, documentation sections
- [Tooling](agents/tooling.md) — linting, testing, and build configuration

## Tooling & Configuration

See [agents/tooling.md](agents/tooling.md) — linting, testing, and build configuration.

_Last updated: 2026-04-14_
