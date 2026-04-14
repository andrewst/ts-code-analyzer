# AI Agents Configuration

This directory contains the configuration, roles, and rules for the AI-driven development workflow used in this project.

## Agent-Driven Approach

We use a structured multi-role AI workflow to ensure code quality, architectural consistency, and thorough documentation. Each stage of development is handled by a specialized agent role with specific responsibilities and constraints.

## Roles

The workflow consists of the following roles:

| Role         | Responsibility                                                |
| :----------- | :------------------------------------------------------------ |
| **PD**       | Product Discovery: idea structuring and conceptual breakdown. |
| **PM**       | Product Manager: user stories and backlog creation.           |
| **ARC**      | Architect: technical design and architectural constraints.    |
| **QA**       | Quality Assurance: test strategy and quality gates.           |
| **CODER**    | Developer: implementation and unit testing.                   |
| **REV**      | Reviewer: code review and quality validation.                 |
| **DOC**      | Documentation: keeping documentation in sync with changes.    |
| **Workflow** | Orchestrator: manages the full development sequence.          |

## Rules & Verification

Rules are categorized into **Code Quality (R)**, **Architecture (A)**, and **Testing (T)**. Each role is bound by a specific subset of these rules, which are enforced through:

- **Linting**: Automated checks (TypeScript compiler, oxlint).
- **Testing**: Automated test suites (vitest).
- **Review**: Manual validation during the `REV` stage.

## Directory Structure

- [`roles/`](roles/): Detailed definitions and instructions for each agent role.
- [`rules/`](rules/): Specific technical and quality standards.
- [`templates/`](templates/): Standardized formats for agent outputs (discovery, stories, etc.).

For the full configuration, including detailed rule mappings and conflict resolution policies, see the [**`AGENTS.md`**](../AGENTS.md) file in the repository root.
