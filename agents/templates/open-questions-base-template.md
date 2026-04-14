# Open Questions Entry Template

Use this template for each question entry in an open-questions document.

## Unanswered Question Entry

### Q[1]: [Question title]

**Context**: [Why this question matters]
**Impact**: [What decisions depend on this answer]
**Status**: [blocking | non-blocking | deferred]
**Owner**: [role or person responsible for answering; required if Status is deferred]
**Handoff Impact**: [Explain whether this question blocks handoff to next stage or can be passed forward]

**Suggested Answers**:

- [ ] **A1**: [first suggested option]
- [ ] **A2**: [second suggested option]
- [ ] **A3**: [third suggested option]
- [ ] **Custom**: [write your own answer here]

---

## Answered Question Entry

### Q[1]: [Question title]

**Context**: [Why this question matters]
**Impact**: [What decisions depend on this answer]
**Status**: answered
**Answered By**: [who provided the answer]
**Answered Date**: [YYYY-MM-DD]

**Suggested Answers**:

- [ ] **A1**: [first suggested option]
- [x] **A2**: [selected option]
- [ ] **A3**: [third suggested option]
- [ ] **Custom**: [write your own answer here]

---

## Rules

- Each active question must include 2-4 suggested answer options.
- **Status field** MUST be set for every question:
  - `blocking`: question blocks current role from proceeding; MUST be answered before handoff
  - `non-blocking`: question does not block progress; can be answered later or by next role
  - `deferred`: question is intentionally postponed; requires explicit Owner
  - `answered`: question has been resolved with clear, concrete answer (moved to answered section)
- **Owner field** MUST be set when Status is `deferred`
- **Handoff Impact field** MUST explain whether question blocks handoff or can pass forward
- Move a question to the answered section only when the user has given a clear, concrete answer.
- Do not move vague, deferred, or "later" responses into the answered section.
- Use `None` when a section has no items.
