# Workflow

The AI-driven software development workflow defines the sequence of roles from initial idea to final commit.

## Workflow Sequence

```
Request → PD → PM → ARC → PLAN → QA → CODER → REV → DOC → Commit
```

## Role Stages Summary

| Stage | Role                       | Input                                                             | Output                              | Done Criteria                                                                                         | Blockers                                                                             | Handoff Target |
| ----- | -------------------------- | ----------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------- |
| 1     | **PD** (Product Discovery) | Vision file, raw idea                                             | Discovery file, open questions      | Discovery follows template; user journeys defined; feature breakdown complete; no blocking questions  | Vision missing; scope ambiguous; blocking questions open                             | PM             |
| 2     | **PM** (Product Manager)   | Discovery file, open questions                                    | Stories file, open questions        | All features have stories; acceptance criteria measurable; dependencies listed; no blocking questions | Discovery missing; scope ambiguous; blocking questions open; criteria not measurable | ARC            |
| 3     | **ARC** (Architect)        | Stories, discovery, open questions                                | Architecture file, open questions   | Module boundaries defined; data flow described; design decisions documented; no blocking questions    | Stories missing; scope ambiguous; blocking questions open; architecture incomplete   | PLAN           |
| 4     | **PLAN** (Planner)         | Stories, architecture, discovery, open questions                  | Tasks file, open questions          | All requirements mapped to tasks; tasks are atomic and developer-ready; no blocking questions         | Stories/architecture missing; ambiguities open                                       | QA             |
| 5     | **QA** (Quality Assurance) | Stories, architecture, tasks, open questions                      | Test strategy, open questions       | All acceptance criteria have tests; edge cases identified; coverage goals set; no blocking questions  | Stories/architecture/tasks missing; strategy incomplete; blocking questions open     | CODER          |
| 6     | **CODER** (Developer)      | Stories, architecture, tasks, test strategy, open questions       | Source code, tests, open questions  | All criteria implemented; tests pass; build/lint clean; no blocking questions                         | Inputs missing; implementation incomplete; build failures; blocking questions open   | REV            |
| 7     | **REV** (Reviewer)         | Stories, architecture, test strategy, code, tests, open questions | Review report, open questions       | All criteria validated; architecture compliance checked; findings categorized; no blocking questions  | Critical findings; stories not satisfied; blocking questions open                    | DOC (if pass)  |
| 8     | **DOC** (Documentation)    | Code, architecture, review report, open questions                 | Updated docs, JSDoc, open questions | All docs current; JSDoc complete; README synced; no blocking questions                                | Review missing; implementation undocumented; blocking questions open                 | Commit         |
| 9     | **Commit**                 | All artifacts, review approval                                    | Committed code                      | All stages complete; no open blockers; documentation ready                                            | N/A                                                                                  | —              |

## Role Details

For detailed role behavior, see individual role files:

- [PD](agents/roles/pd.md) — Product Discovery
- [PM](agents/roles/pm.md) — Product Manager
- [ARC](agents/roles/arc.md) — Architect
- [PLAN](agents/roles/plan.md) — Planner
- [QA](agents/roles/qa.md) — Quality Assurance
- [CODER](agents/roles/coder.md) — Developer
- [REV](agents/roles/rev.md) — Reviewer
- [DOC](agents/roles/doc.md) — Documentation

## Workflow Notes

- **Each role has formal inputs, outputs, done criteria, blockers, and verification** — see individual role files for details
- **Handoff is formal**: a role cannot handoff if blocking conditions exist
- **Open questions use status system**: `blocking`, `non-blocking`, `deferred`, `answered` — see [Open Question Management](#open-question-management)
- Each role applies a specific subset of rules — see [Role → Rules Mapping](AGENTS.md#role--rules-mapping)
- Roles that do not write code (PD, PM) do not have applicable rules

## Open Question Management

All roles MUST manage open questions using a consistent status system. Questions track assumptions, clarifications, and unresolved decisions that arise during each stage.

### Question Statuses

Each open question MUST have one of the following statuses:

| Status         | Description                                                                               | Example                                      |
| -------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------- |
| `blocking`     | Question blocks the current role from proceeding; MUST be answered before handoff         | "Which authentication method should we use?" |
| `non-blocking` | Question does not block progress; can be answered later or by next role                   | "Should we add rate limiting in v1 or v2?"   |
| `deferred`     | Question is intentionally postponed to a future stage or release; requires explicit owner | "Defer to v2: support for GraphQL APIs"      |
| `answered`     | Question has been resolved with a clear, concrete answer; moved to answered section       | "Use JWT authentication with 15min expiry"   |

### Handoff Rules

When a role completes their work and hands off to the next stage:

1. **Blocking questions MUST be resolved**: a role cannot handoff if there are blocking questions that remain open
2. **Non-blocking questions can be passed forward**: document them clearly and include in handoff
3. **Deferred questions MUST have an owner**: specify which role or stage should address them
4. **Answered questions MUST be moved to the answered section**: do not leave answered questions in the active list

### Role-Specific Rules

- **PD and PM**: blocking questions about product scope or user needs MUST be resolved before handoff to ARC
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

### Artifact Lifecycle

Each stage produces specific artifacts. The lifecycle rules are:

| Stage | Primary Artifact                        | Update Rule                                                                 |
| ----- | --------------------------------------- | --------------------------------------------------------------------------- |
| PD    | `docs/02_Discovery/discovery.md`        | Create new if missing; update existing, preserving valid content            |
| PM    | `docs/03_Stories/stories.md`            | Create new if missing; update existing, preserving valid stories            |
| ARC   | `docs/03_Stories/architecture.md`       | Create new if missing; update existing, preserving design decisions         |
| PLAN  | `docs/04_Task/tasks.md`                 | Create new if missing; update existing, preserving dependencies             |
| QA    | `docs/05_TestStrategy/test-strategy.md` | Create new if missing; update existing, preserving test scenarios           |
| CODER | `src/` files                            | Implement according to architecture; update based on REV feedback           |
| REV   | `docs/05_Review/review-report.md`       | Create fresh for each review cycle; reference previous reports              |
| DOC   | Various documentation files             | Update to reflect current implementation per Document Responsibility Matrix |

**Open Questions Files**: Each stage maintains an open questions file. Files are created if missing and synchronized if existing — answered questions are preserved, new questions are added, duplicates are removed.
