# AI Agent Configuration

TypeScript dead-code detection utility — agent-driven development.

## Project

**Type**: TypeScript dead-code detection utility (CLI tool + library)  
**Stage**: Early development (v0.0.1)  
**Stack**: TypeScript 6.0+, TypeScript Compiler API, ESM, pnpm  

## Roles

| Role  | File                                                  | When                              |
| ----- | ----------------------------------------------------- | --------------------------------- |
| PDA   | [agents/roles/pda.md](agents/roles/pda.md)            | Idea structuring, discovery       |
| PM    | [agents/roles/pm.md](agents/roles/pm.md)              | User stories, acceptance criteria |
| ARC   | [agents/roles/arc.md](agents/roles/arc.md)            | Design, architecture decisions    |
| CODER | [agents/roles/coder.md](agents/roles/coder.md)        | Implementation                    |
| QA    | [agents/roles/qa.md](agents/roles/qa.md)              | Tests, fixtures                   |
| REV   | [agents/roles/rev.md](agents/roles/rev.md)            | Review                            |
| DOC   | [agents/roles/doc.md](agents/roles/doc.md)            | Documentation                     |

**Workflow**: `Request → PDA → PM → ARC → QA → CODER → REV → DOC → Commit`

## Rules

| File                                         | IDs     |
| -------------------------------------------- | ------- |
| [Code Quality](agents/rules/code-quality.md) | R01–R07 |
| [Architecture](agents/rules/architecture.md) | A01–A05 |
| [Testing](agents/rules/testing.md)           | T01–T05 |
| [Git Workflow](agents/rules/git-workflow.md) | G01–G04 |

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
- [Reference](agents/reference.md) — commands, files, RFC sections
- [Tooling](agents/tooling.md) — linting, testing, and build configuration

## Tooling & Configuration

See [agents/tooling.md](agents/tooling.md) — linting, testing, and build configuration.

_Last updated: 2026-04-14_
