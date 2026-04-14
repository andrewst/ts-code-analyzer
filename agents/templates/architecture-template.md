# Architecture

**Project**: [project name]  
**Date**: [YYYY-MM-DD]  
**Status**: [status of document]  
**Source**: `docs/03_Stories/stories.md`

## Architecture Overview

[Describe the recommended technical approach in 2-4 sentences.]

## Proposed Module Boundaries

- `[module/path/]` - [responsibility]
- `[module/path/]` - [responsibility]
- `[module/path/]` - [responsibility]
- `[module/path/]` - [responsibility]

## Technical Flow

1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]

## Data Flow and Contracts

- Input: [inputs]
- Intermediate result: [intermediate model or state]
- Output: [output shape or artifact]

[Describe the key data contracts and how they stay separate from presentation or I/O.]

## Key Design Decisions

- [Decision 1]
- [Decision 2]
- [Decision 3]
- [Decision 4]

## Error Handling and Scope Boundaries

- [Error condition or boundary 1]
- [Error condition or boundary 2]
- [Error condition or boundary 3]
- [Error condition or boundary 4]

## Open Technical Questions

See `docs/02_Discovery/open-questions-from-arc.md` for unresolved architecture decisions.

## Blocking Conditions

List any conditions that block handoff to QA and CODER:

| Condition     | Status            | Resolution                        |
| ------------- | ----------------- | --------------------------------- |
| [Condition 1] | [resolved / open] | [how resolved or escalation plan] |
| [Condition 2] | [resolved / open] | [how resolved or escalation plan] |

If there are no blocking conditions, write `None`.

## Done Criteria

ARC's work is complete when ALL of the following are satisfied:

- [ ] Architecture file exists and follows this template structure
- [ ] Module boundaries are explicitly defined with ownership
- [ ] Data flow and control flow are described for all user stories
- [ ] Dependencies between modules are directional and acyclic
- [ ] Key design decisions are documented with rationale
- [ ] Error handling and scope boundaries are defined
- [ ] All blocking open questions are answered (no questions with `Status: blocking` remain unanswered)
- [ ] Open questions file is created or synchronized with correct statuses

## Handoff Readiness

| Checklist Item                                                 | Status |
| -------------------------------------------------------------- | ------ |
| Coherence - architecture has one clear approach                | [ ]    |
| Boundaries - modules have single responsibilities              | [ ]    |
| Testability - core logic can be tested without I/O             | [ ]    |
| Maintainability - dependency flow is directional               | [ ]    |
| Handoff quality - QA and CODER can proceed with implementation | [ ]    |

**Verdict**: [ready / needs follow-up / blocked]

## Technical Summary

[Provide a short summary of the architecture and the main implementation tradeoffs.]
