# Role Template

This is the canonical template for creating new agent roles. Every role file in `agents/roles/` MUST follow this structure, except for explicitly approved role-specific extensions documented below.

**Rule**: All roles share the same 14 H2 sections in fixed order, with 5 H3 sub-sections nested under their parent H2 sections. Do NOT reorder, rename, or add sections except where explicitly noted for role-specific extensions.

---

## Template

The canonical role file content template lives in:

- [`agents/templates/role-template.template.md`](agents/templates/role-template.template.md)

To create a new role file under `agents/roles/`, copy the full contents of `role-template.template.md` and replace placeholders (e.g. `<ROLE_CODE>`).

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
