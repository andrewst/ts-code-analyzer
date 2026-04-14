# Role Template

This is the canonical template for creating new agent roles. Every role file in `agents/roles/` MUST follow this structure, except for explicitly approved role-specific extensions documented below.

**Rule**: All roles share the same 14 H2 sections in fixed order, with 5 H3 sub-sections nested under their parent H2 sections. Do NOT reorder, rename, or add sections except where explicitly noted for role-specific extensions.

---

## Template

```markdown
# <Full Role Name> (<ROLE_CODE>)

You are a <role name> Agent in an AI-driven software development system.

Your role is to <one-sentence description>.

You do NOT <list 2-3 things this role must never do>.

Your responsibility is to:

- <responsibility 1>
- <responsibility 2>
- <responsibility 3>
- <responsibility 4>
- <responsibility 5>

---

## STRICT RULES

You MUST NOT:

- <prohibition 1>
- <prohibition 2>
- <prohibition 3>
- <prohibition 4>
- <prohibition 5>

If input is incomplete or unclear:
→ <specific action the role should take instead of guessing>

---

## OBJECTIVES

1. <objective 1>
2. <objective 2>
3. <objective 3>
4. <objective 4>
5. <objective 5>

---

## BEHAVIOR RULES

- <behavioral guideline 1>
- <behavioral guideline 2>
- <behavioral guideline 3>
- <behavioral guideline 4>
- <behavioral guideline 5>

---

## When to Activate

- <condition 1>
- <condition 2>
- <condition 3>

## Workflow Position

<ROLE_CODE> is the <ordinal> stage in the development workflow, after <previous role> and before <next role>. See [Workflow](agents/roles/workflow.md) for full sequence.

## Applicable Rules

See [Role → Rules Mapping](AGENTS.md#role--rules-mapping). `AGENTS.md` is the single source of truth for applicable rules.

## Input

- **REQUIRED primary input**: <file path> — <description of what it provides and why it must be read>
- **REQUIRED if present**: <file path> — <description>
- **OPTIONAL context**: <file path or description> — <when to read it>

### Input Workflow

1. Read <primary input> first to understand <purpose>
2. Read <secondary input if present> to <purpose>
3. <step 3>
4. <step 4>
5. <step 5>

## Output

- **Primary output**: <file path and description>
- **Secondary output**: <file path and description, if any>

## Artifacts

| Artifact     | Location | Lifecycle                                                       |
| ------------ | -------- | --------------------------------------------------------------- |
| <artifact 1> | <path>   | <create new if missing; update existing if present, with rules> |
| <artifact 2> | <path>   | <create new if missing; synchronize existing>                   |

**Update Rules**:

- If <primary artifact> exists: <how to update it>
- If <secondary artifact> exists: <how to synchronize it>

## Done Criteria

<ROLE_CODE>'s work is complete when ALL of the following are satisfied:

- [ ] <verifiable criterion 1>
- [ ] <verifiable criterion 2>
- [ ] <verifiable criterion 3>
- [ ] <verifiable criterion 4>
- [ ] <verifiable criterion 5>
- [ ] <verifiable criterion 6>
- [ ] <verifiable criterion 7>

## Blocking Conditions

The following conditions BLOCK handoff to <next role>:

| Condition     | Type          | Escalation                 | Owner   |
| ------------- | ------------- | -------------------------- | ------- |
| <condition 1> | Unconditional | <escalation path or "N/A"> | <owner> |
| <condition 2> | Unconditional | <escalation path or "N/A"> | <owner> |
| <condition 3> | Unconditional | <escalation path or "N/A"> | <owner> |

### Escalation Rules

- If <condition 1>: <what to do>
- If <condition 2>: <what to do>
- If blocking questions exist: handoff is blocked until they are answered or reclassified as non-blocking/deferred

## Handoff to Next Role

**Target**: <next role name and code>

**Deliverables**:

1. <file path> — <description>
2. <file path> — <description, if any>

**Acceptance Criteria**:

- <criterion 1>
- <criterion 2>
- <criterion 3>
- No blocking questions remain open

**Failure Handling**:

- If <next role> finds <deliverable> insufficient: <next role> records new open questions and requests <ROLE_CODE> re-run
- <ROLE_CODE> MUST address <next role>'s questions before workflow proceeds

## Verification

<ROLE_CODE>'s completion is validated through:

| Method                | What It Checks                                                                                                                       | Enforcement                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Template structure    | <output file> follows [<template name>](agents/templates/<template>.md)                                                              | review-enforced                                               |
| <method 2>            | <description>                                                                                                                        | review-enforced                                               |
| <method 3>            | <description>                                                                                                                        | lint-enforced / test-enforced / review-enforced / manual only |
| Open questions format | Questions follow [open questions base template](agents/templates/open-questions-base-template.md) with Status, Owner, Handoff Impact | review-enforced                                               |

**Note**: <brief note on whether verification is automated or manual, and which stage acts as the verification gate>

## Open Questions Handling

**MANDATORY**: Use [agents/templates/open-questions-template.md](agents/templates/open-questions-template.md) for document metadata and file structure.

**MANDATORY**: Use [agents/templates/open-questions-base-template.md](agents/templates/open-questions-base-template.md) for the canonical question-entry structure.

### File Workflow

**If <open-questions-file> does NOT exist:**

- Create a new file with all current open questions
- Format each question with Status, Owner (if deferred), and Handoff Impact

**If <open-questions-file> already exists:**

- Read existing questions from the file
- Synchronize with current analysis:
  - Mark questions as answered ONLY when the user has given a clear, concrete answer
  - Do NOT move vague, deferred, or "later" responses into answered section
  - Add new open questions that emerged from current session
  - Update statuses and owners as context changes
  - Remove exact duplicates

### Status Rules

- `blocking`: question blocks <ROLE_CODE> from completing <output>; MUST be answered before handoff
- `non-blocking`: question does not block progress; can pass to <next role>
- `deferred`: question intentionally postponed; requires explicit Owner
- `answered`: question resolved; move to answered section with Answered By and Answered Date

### Purpose

- Track assumptions and clarifications needed for accurate <role activity>
- Ensure questions are not lost between sessions
- Provide clear visibility into what information is still needed
- Create audit trail of decisions and their rationale
```

---

## Section-by-Section Guide

| Section                     | Purpose                           | Content Rules                                                         |
| --------------------------- | --------------------------------- | --------------------------------------------------------------------- |
| **H1 Title**                | Role identification               | Format: `# <Full Role Name> (<ROLE_CODE>)`                            |
| **STRICT RULES**            | What the role MUST NOT do         | List 5-7 specific prohibitions; end with "If input is unclear" action |
| **OBJECTIVES**              | What the role MUST accomplish     | Numbered list, 5-8 items, outcome-focused                             |
| **BEHAVIOR RULES**          | How the role should behave        | Bullet list, 5-6 guidelines, actionable                               |
| **When to Activate**        | Conditions that trigger this role | 3-5 bullet points                                                     |
| **Workflow Position**       | Where this role sits in pipeline  | One sentence referencing workflow.md                                  |
| **Applicable Rules**        | Which rules apply                 | Defer to AGENTS.md; PD/PM have "none"                                 |
| **Input**                   | What the role consumes            | Use REQUIRED/OPTIONAL dictionary; include Input Workflow steps        |
| **Output**                  | What the role produces            | Primary + secondary outputs with paths                                |
| **Artifacts**               | File lifecycle                    | Table with Location and Lifecycle; Update Rules below                 |
| **Done Criteria**           | Verifiable completion             | Checkbox list, 7 items, all verifiable (not evaluative)               |
| **Blocking Conditions**     | What prevents handoff             | Table with Condition/Type/Escalation/Owner; Escalation Rules below    |
| **Handoff to Next Role**    | Formal handoff                    | Target, Deliverables, Acceptance Criteria, Failure Handling           |
| **Verification**            | How completion is validated       | Table with Method/What It Checks/Enforcement                          |
| **Open Questions Handling** | Status system                     | MANDATORY template refs, File Workflow, Status Rules, Purpose         |

Total: **1 H1 + 14 H2 + 5 H3 = 20 headings** in the canonical role structure.

---

## Role-Specific Extensions

Some roles may need additional sections. These are the only approved extensions:

| Extension                           | Where to insert                                              | Which roles use it                          |
| ----------------------------------- | ------------------------------------------------------------ | ------------------------------------------- |
| `## Document Responsibility Matrix` | Between `## Verification` and `## Open Questions Handling`   | DOC only                                    |
| Role-specific template references   | Within relevant sections (e.g., Verification, Done Criteria) | Any role that has a dedicated template file |

**Rule**: Do NOT add sections beyond those listed above without explicit justification. The canonical structure is 14 H2 sections by default, with approved extensions only where explicitly allowed.

---

## Terminology Dictionary

All roles MUST use this exact terminology for inputs:

| Term                       | Meaning                                                            |
| -------------------------- | ------------------------------------------------------------------ |
| **REQUIRED primary input** | Must be read; role cannot function without it                      |
| **REQUIRED if present**    | Must be read if the file exists; role adapts based on content      |
| **OPTIONAL context**       | May be read for additional context; not required for core function |

Do NOT use: `MANDATORY`, `must read if exists`, `optional, but...`, or any other variant.

---

## Verification Types

Use only these enforcement types in the Verification table:

| Type                | Meaning                                                 | Examples                                         |
| ------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| **lint-enforced**   | Automatically checked by compiler or linter             | TypeScript strict mode, oxc lint                 |
| **test-enforced**   | Validated by running tests                              | Coverage reports, test execution                 |
| **review-enforced** | Manually checked during REV stage                       | Code quality, architecture compliance            |
| **manual only**     | Requires conscious attention but has no automated check | Documentation quality, product discovery quality |

---

## Question Statuses

Use only these statuses in Open Questions Handling:

| Status         | Meaning                                              | Handoff Impact                   |
| -------------- | ---------------------------------------------------- | -------------------------------- |
| `blocking`     | Blocks current role; MUST be answered before handoff | Blocks handoff                   |
| `non-blocking` | Does not block progress                              | Can pass to next role            |
| `deferred`     | Postponed to future stage                            | Requires Owner; can pass forward |
| `answered`     | Resolved with clear answer                           | Moved to answered section        |
