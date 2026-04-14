# Workflow

The AI-driven software development workflow defines the sequence of roles from initial idea to final commit.

## Workflow Sequence

```
Request → PDA → PM → ARC → QA → CODER → REV → DOC → Commit
```

## Role Stages

| Stage | Role | Description |
| ----- | ---- | ----------- |
| 1 | **PDA** (Product Discovery) | Clarify the idea, identify users and goals, break down features conceptually, define user flows, expose assumptions and risks |
| 2 | **PM** (Product Manager) | Write user stories and acceptance criteria based on PDA's structured discovery |
| 3 | **ARC** (Architect) | Design system architecture and technical approach |
| 4 | **QA** (Quality Assurance) | Define test strategy and quality gates |
| 5 | **CODER** (Developer) | Implement the solution |
| 6 | **REV** (Reviewer) | Review code for correctness, security, and quality |
| 7 | **DOC** (Documentation) | Update and verify documentation |
| 8 | **Commit** | Commit changes and verify |

## Workflow Notes

- **PDA comes before PM**: PDA prepares structured input so PM can write precise user stories
- Each role applies a specific subset of rules — see [Role → Rules Mapping](./AGENTS.md#role--rules-mapping)
- Roles that do not write code (PDA, PM) do not have applicable rules
