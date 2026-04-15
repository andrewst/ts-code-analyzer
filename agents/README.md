# AI Agents Configuration

This directory contains the configuration, roles, and rules for the AI-driven development workflow used in this project.

## Start here

- If you are new to this repo, start with [`AGENTS.md`](AGENTS.md) (canonical workflow, rule mapping, constraints).
- If you need expected artifacts per stage, see the “Stage Outputs (minimum)” section in `AGENTS.md`.
- If you want to run the process end-to-end, read [`agents/roles/workflow.md`](agents/roles/workflow.md).
- If you need commands and quality gates, see [`agents/tooling.md`](agents/tooling.md) and the “Quality gates / Commands” section in `AGENTS.md`.
- If you need role instructions, see [`agents/roles/`](agents/roles/).
- If you need technical rules, see [`agents/rules/`](agents/rules/).
- If you need output formats, see [`agents/templates/`](agents/templates/).

## Agent-Driven Approach

We use a structured multi-role AI workflow to improve code quality, architectural consistency, and documentation hygiene. Each stage is handled by a specialized agent role with defined responsibilities and constraints.

## What this is (and is not)

- This is documentation for the _development workflow_ used in this repo (roles, rules, templates, tooling).
- This is not product documentation for the TypeScript analyzer itself (see the repo root `README.md` and `docs/` for product-level docs).

## Workflow

The canonical workflow is defined in [`AGENTS.md`](AGENTS.md):

`Request → PD → PM → ARC → PLAN → QA → CODER → REV → DOC → Commit`

## Minimal example

In practice, a small change typically looks like:

- Capture the request and open questions (use templates in [`agents/templates/`](agents/templates/)).
- Produce artifacts per stage as needed (see “Stage Outputs (minimum)” in `AGENTS.md`).
- Implement + test (`CODER`), then validate quality gates and review (`QA`/`REV`).
- Update docs (`DOC`) and commit.

## Roles

Role IDs (e.g. `PD`, `PM`, `ARC`) are canonical and match the role documents under [`agents/roles/`](agents/roles/).

| Role (ID) | Responsibility                                                |
| :-------- | :------------------------------------------------------------ |
| **PD**    | Product Discovery: idea structuring and conceptual breakdown. |
| **PM**    | Product Manager: user stories and backlog creation.           |
| **ARC**   | Architect: technical design and architectural constraints.    |
| **PLAN**  | Planner: task breakdown and execution plan.                   |
| **QA**    | Quality Assurance: test strategy and quality gates.           |
| **CODER** | Developer: implementation and unit testing.                   |
| **REV**   | Reviewer: code review and quality validation.                 |
| **DOC**   | Documentation: keeping documentation in sync with changes.    |

## Rules & Verification

Rules are categorized into **Code Quality (R)**, **Architecture (A)**, and **Testing (T)**. Each role is bound by a specific subset of these rules, which are enforced through:

- **Linting**: Automated checks (TypeScript compiler, oxc lint).
- **Testing**: Automated test suites (vitest).
- **Review**: Manual validation during the `REV` stage.

## Directory Structure

- [`agents/roles/`](agents/roles/): Detailed definitions and instructions for each agent role.
- [`agents/rules/`](agents/rules/): Specific technical and quality standards.
- [`agents/templates/`](agents/templates/): Standardized formats for agent outputs (discovery, stories, etc.).
- [`agents/tooling.md`](agents/tooling.md): Lint/test/build tooling and command reference.
- [`agents/reference.md`](agents/reference.md): Quick reference for common tasks and conventions.
- [`agents/best-practices.md`](agents/best-practices.md): Practical guidance for running the workflow smoothly.

## Documentation language

Repository-facing documentation is **English by default** (including `agents/**`). Localized notes/analysis are allowed under `docs/analysis/**` or `docs/notes/**` (use a language suffix like `*.ru.md`). See [`AGENTS.md`](AGENTS.md) for details.

For the full configuration, including detailed rule mappings and conflict resolution policies, see [`AGENTS.md`](AGENTS.md).
