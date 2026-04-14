# Claude Code Configuration

> **Important**: This file ensures Claude Code always knows about project structure and workflows.
> For full details, always reference [AGENTS.md](AGENTS.md).

## Project Overview

**TypeScript static code analysis utility** — CLI tool + library

- **Stack**: TypeScript 6.0+, TypeScript Compiler API, ESM, pnpm
- **Stage**: Early development (v0.0.1)
- **Architecture**: Design-driven — see project documentation

## Agent Workflow

**Workflow**: `Request → PM → ARC → QA → CODER → REV → DOC → Commit`

### Agent Roles

| Role  | File                    | Purpose                           |
| ----- | ----------------------- | --------------------------------- |
| PM    | `agents/roles/pm.md`    | User stories, acceptance criteria |
| ARC   | `agents/roles/arc.md`   | Design, architecture decisions    |
| CODER | `agents/roles/coder.md` | Implementation                    |
| QA    | `agents/roles/qa.md`    | Tests, fixtures                   |
| REV   | `agents/roles/rev.md`   | Review                            |
| DOC   | `agents/roles/doc.md`   | Documentation                     |

**Always read the relevant agent file before starting work in that role.**

## Key Rules

- **Code Quality**: `agents/rules/code-quality.md` (R01–R07)
- **Architecture**: `agents/rules/architecture.md` (A01–A05)
- **Testing**: `agents/rules/testing.md` (T01–T05)
- **Git Workflow**: `agents/rules/git-workflow.md` (G01–G04)
- **Internal document links**: whenever one repository document links to another repository document, the link must be relative to the current file. Do not use absolute filesystem paths or repo-root-style paths for internal documentation links.

## Essential Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build TypeScript
pnpm test             # Run tests
```

## Resources

- [Best Practices](agents/best-practices.md) — before/while/after coding
- [Reference](agents/reference.md) — commands, files, documentation sections

## Guidelines for Claude Code

1. **Always read AGENTS.md** at the start of a session for complete context
2. **Follow the workflow**: Request → PM → ARC → QA → CODER → REV → DOC → Commit
3. **Use role-specific files** when working on tasks in a particular role
4. **Apply rules** from `agents/rules/` consistently
5. **Write tests** for all new functionality (per T01–T05)
6. **Commit messages**: Clear, concise, focused on "why" not just "what"

_Last updated: 2026-04-14_
