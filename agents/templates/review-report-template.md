# Review Report

**Project**: [project name]
**Date**: [YYYY-MM-DD]
**Reviewer**: [agent or person]
**Source**: `src/` (implemented code and tests)

## Review Summary

- **Overall assessment**: [Pass / Conditional Pass / Fail]
- **Brief description of findings**: [2-3 sentences summarizing the review]
- **Recommendation**: [proceed to DOC / address issues and re-review]

## Findings by Severity

### Critical (blocks commit)

- [ ] Finding 1: description, location, evidence, recommended fix
- [ ] Finding 2: description, location, evidence, recommended fix

If there are no critical findings, write `None`.

### Major (should be addressed)

- [ ] Finding 1: description, location, evidence, recommended fix
- [ ] Finding 2: description, location, evidence, recommended fix

If there are no major findings, write `None`.

### Minor (nice to have)

- [ ] Finding 1: description, location, evidence, recommended improvement
- [ ] Finding 2: description, location, evidence, recommended improvement

If there are no minor findings, write `None`.

### Suggestions (optional improvements)

- [ ] Suggestion 1: description and rationale
- [ ] Suggestion 2: description and rationale

If there are no suggestions, write `None`.

## Validation Against Stories

For each user story:

- [ ] **Story**: [title] — Acceptance criteria satisfied: [Yes/No]
  - Evidence: [brief description or reference to tests]

If there are no stories to validate, write `None`.

## Validation Against Architecture

- [ ] Implementation follows architecture: [Yes/No]
- **Deviations**: [list any deviations with rationale]
- **Assessment**: [whether deviations are acceptable or problematic]

## Test Quality Assessment

- [ ] All critical paths tested: [Yes/No]
- [ ] Edge cases covered: [Yes/No]
- [ ] Test quality: [adequate/poor]
- **Gaps**: [list any missing test scenarios]

## Open Questions

See `docs/05_TestStrategy/open-questions-from-rev.md` for unresolved review decisions.

## Blocking Conditions

List any conditions that block handoff to DOC:

| Condition     | Status            | Resolution                        |
| ------------- | ----------------- | --------------------------------- |
| [Condition 1] | [resolved / open] | [how resolved or escalation plan] |
| [Condition 2] | [resolved / open] | [how resolved or escalation plan] |

If there are no blocking conditions, write `None`.

## Handoff Readiness

| Checklist Item                                                                   | Status |
| -------------------------------------------------------------------------------- | ------ |
| Correctness - implementation satisfies all acceptance criteria                   | [ ]    |
| Quality - code follows all applicable rules (R01–R07, A01–A05)                   | [ ]    |
| Test coverage - tests exercise all critical paths and edge cases                 | [ ]    |
| Security - no security vulnerabilities or exposed secrets                        | [ ]    |
| Performance - no obvious performance issues                                      | [ ]    |
| Handoff quality - DOC can update documentation based on validated implementation | [ ]    |

**Verdict**: [ready / needs follow-up / blocked]
