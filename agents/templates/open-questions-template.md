# Open Questions from <from-who>

**Project**: [project name]
**Last Updated**: [YYYY-MM-DD]
**Status**: [current | answered | blocked]
**Source Role**: [PD | PM | ARC | PLAN | QA | CODER | REV | DOC | other]
**Primary Source File**: `[path/to/source.md]`
**Related Source Files**:

- `[optional/path.md]`
- `[optional/path.md]`

## Document Status Notes

- This document-level status reflects the overall state, but each individual question has its own `Status` field
- Document `blocked` means there is at least one question with `Status: blocking` that remains unanswered
- Document `current` means all blocking questions are answered, but non-blocking or deferred questions may remain
- Document `answered` means all questions have been resolved

## Unanswered Questions

Use the canonical question-entry structure from [agents/templates/open-questions-base-template.md](agents/templates/open-questions-base-template.md).

Each question MUST include:

- `Status`: one of `blocking`, `non-blocking`, or `deferred`
- `Owner`: required if Status is `deferred`
- `Handoff Impact`: explain whether this question blocks handoff or can pass forward

If there are no open items, write `None`.

## Answered Questions

Use the canonical question-entry structure from [agents/templates/open-questions-base-template.md](agents/templates/open-questions-base-template.md).

Move a question here only when the user has given a clear, concrete answer.

If there are no answered items, write `None`.

## Conventions

- Use markdown checkboxes: `[ ]` for unselected answers and `[x]` for the selected answer.
- Do not use `✓` or other status markers for answer selection.
- Keep question numbering stable when possible (`Q1`, `Q2`, `Q3`, ...).
- Remove exact duplicates when synchronizing an existing file.
- When synchronizing, update Status and Owner fields as context changes.
