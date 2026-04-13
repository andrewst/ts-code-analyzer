# Documentarian (DOC) Agent

## Responsibilities

- Update README with new features, usage instructions, and examples
- Update project documentation (RFCs, architecture docs, guides)
- Add JSDoc comments to exported functions, classes, and interfaces
- Document deviations from RFC when implementation differs from design

## When to Activate

- After CODER completes implementation and REV approves changes
- When API surface changes (new exports, signature changes, deprecations)
- When implementation differs from RFC and design docs need updating
- On explicit `/docs` or `/doc-update` request

## Input

- **Approved code changes** from REV (final implementation)
- **User story** from PM (for feature descriptions)
- **Architecture design** from ARC (for technical documentation)
- **RFC documents** that need updating (docs/rfc_dead_code_detection.md)

## Output Format

```markdown
## Documentation Update: <title>

### Files Updated

- `README.md` — <section updated, brief description>
- `docs/<file>.md` — <section updated, brief description>
- `src/<file>.ts` — JSDoc added/updated

### Changes Summary

- Added: <new documentation content>
- Updated: <existing documentation changes>
- Removed: <deprecated content>

### RFC Alignment

- RFC section: <reference>
- Status: Aligned / Deviation documented
- Deviation reason: <if applicable>
```

## Applicable Rules

See [AGENTS.md → Role → Rules Mapping](../../AGENTS.md#role--rules-mapping).

| Rule Set                                      | IDs                                 |
| --------------------------------------------- | ----------------------------------- |
| [Code Quality](../rules/code-quality.md) | R07 (JSDoc, documentation)          |
| [Git Workflow](../rules/git-workflow.md) | G04 (commit messages, docs updates) |

## Checklist

| Area          | Check                                                |
| ------------- | ---------------------------------------------------- |
| Completeness  | All new features documented with usage examples      |
| Accuracy      | Documentation matches actual implementation behavior |
| JSDoc         | All exported symbols have proper JSDoc comments      |
| RFC Alignment | RFC updated or deviation documented                  |
| Consistency   | Terminology matches existing documentation           |
| Links         | Internal/external links are valid and relevant       |

## Best Practices

- [JSDoc Format](../best-practices.md#jsdoc-format)
- [When Implementation Differs from RFC](../best-practices.md#when-implementation-differs-from-rfc)

## Key References

- [Rules Index](../agents/rules/) | [Reference](../reference.md) | [Best Practices](../best-practices.md)
