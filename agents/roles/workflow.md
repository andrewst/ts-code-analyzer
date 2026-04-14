# Workflow

The AI-driven software development workflow defines the sequence of roles from initial idea to final commit.

## Workflow Sequence

```
Request → PDA → PM → ARC → QA → CODER → REV → DOC → Commit
```

## Role Stages

| Stage | Role                        | Description                                                                                                                   |
| ----- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1     | **PDA** (Product Discovery) | Clarify the idea, identify users and goals, break down features conceptually, define user flows, expose assumptions and risks |
| 2     | **PM** (Product Manager)    | Write user stories and acceptance criteria based on PDA's structured discovery                                                |
| 3     | **ARC** (Architect)         | Design system architecture and technical approach                                                                             |
| 4     | **QA** (Quality Assurance)  | Define test strategy and quality gates                                                                                        |
| 5     | **CODER** (Developer)       | Implement the solution                                                                                                        |
| 6     | **REV** (Reviewer)          | Review code for correctness, security, and quality                                                                            |
| 7     | **DOC** (Documentation)     | Update and verify documentation                                                                                               |
| 8     | **Commit**                  | Commit changes and verify                                                                                                     |

## Workflow Notes

- **PDA comes before PM**: PDA prepares structured input so PM can write precise user stories
- Each role applies a specific subset of rules — see [Role → Rules Mapping](AGENTS.md#role--rules-mapping)
- Roles that do not write code (PDA, PM) do not have applicable rules

## Open Question Management

All roles MUST manage open questions using a consistent status system. Questions track assumptions, clarifications, and unresolved decisions that arise during each stage.

### Question Statuses

Each open question MUST have one of the following statuses:

| Status      | Description                                                                                     | Example                                          |
| ----------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `blocking`  | Question blocks the current role from proceeding; MUST be answered before handoff               | "Which authentication method should we use?"     |
| `non-blocking` | Question does not block progress; can be answered later or by next role                      | "Should we add rate limiting in v1 or v2?"       |
| `deferred`  | Question is intentionally postponed to a future stage or release; requires explicit owner       | "Defer to v2: support for GraphQL APIs"          |
| `answered`  | Question has been resolved with a clear, concrete answer; moved to answered section             | "Use JWT authentication with 15min expiry"       |

### Handoff Rules

When a role completes their work and hands off to the next stage:

1. **Blocking questions MUST be resolved**: a role cannot handoff if there are blocking questions that remain open
2. **Non-blocking questions can be passed forward**: document them clearly and include in handoff
3. **Deferred questions MUST have an owner**: specify which role or stage should address them
4. **Answered questions MUST be moved to the answered section**: do not leave answered questions in the active list

### Role-Specific Rules

- **PDA and PM**: blocking questions about product scope or user needs MUST be resolved before handoff to ARC
- **ARC**: blocking technical decisions MUST be resolved before handoff to QA
- **QA**: blocking test strategy gaps MUST be resolved before handoff to CODER
- **CODER**: blocking implementation questions MUST be resolved; if blocked by external dependency, record and escalate
- **REV**: blocking findings in review MUST be addressed before handoff to DOC
- **DOC**: blocking documentation gaps MUST be resolved before commit

### Escalation

If a blocking question cannot be resolved within a role:

1. Record the question with `blocking` status
2. Include context and suggested answers
3. Handoff is blocked until the question is answered
4. Escalate to user or next role for decision
