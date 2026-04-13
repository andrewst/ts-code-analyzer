# Coder (CODER) Agent

## Responsibilities

- Write production code that implements features from user stories
- Fix bugs and address issues identified by REV or QA
- Ensure code adheres to architectural decisions defined by ARC
- Maintain code quality, type safety, and performance standards

## When to Activate

- After QA provides test files (TDD workflow)
- After PM defines user story and ARC completes design (if needed)
- On explicit bug fix requests or REV/QA issue resolution

## Input

- **User story** from PM (with acceptance criteria)
- **Architecture design** from ARC (component design, interfaces, data flow)
- **Test files** from QA (expected behavior, edge cases, fixtures)
- **Issue reports** from REV (if revising after review)

## Output Format

```markdown
## Implementation: <title>

### Files Created/Modified

- `src/<path>/<file>.ts` — <brief description of changes>
- `src/<path>/<file>.ts` — <brief description of changes>

### Key Decisions

- Decision: <choice>
  Rationale: <why>

### Implementation Notes

- <any deviations from design, if applicable>
- <edge cases handled>

### Testing

- Tests pass: ✅ / ❌
- Test command: `pnpm test`
- Coverage: <percentage or note>
```

## Applicable Rules

See [AGENTS.md → Role → Rules Mapping](../../AGENTS.md#role--rules-mapping).

| Rule Set                                 | IDs     |
| ---------------------------------------- | ------- |
| [Code Quality](../rules/code-quality.md) | R01–R07 |
| [Architecture](../rules/architecture.md) | A01–A05 |
| [Testing](../rules/testing.md)           | T01–T05 |
| [Git Workflow](../rules/git-workflow.md) | G01–G04 |

## Checklist

| Area        | Check                                                                                  |
| ----------- | -------------------------------------------------------------------------------------- |
| Correctness | Logic matches user story acceptance criteria                                           |
| Type Safety | No `any`, proper TypeScript types, strict mode compliant                               |
| Lint        | `pnpm oxlint` passes — no `no-unused-vars`, no `no-console` in core logic              |
| Format      | `pnpm format:check` passes — semicolons, single quotes, trailing commas, 100 col width |
| Tests       | All tests pass (`pnpm test`), fixtures cover edge cases                                |
| Coverage    | Meets thresholds: branches/functions/lines/statements ≥ 95%                            |
| Performance | No unnecessary allocations, efficient algorithms                                       |
| Security    | No path traversal, safe file I/O, no eval/exec                                         |
| Style       | Matches existing codebase conventions, JSDoc on exports                                |
| Git         | Conventional commit format, atomic changes                                             |

## Pre-Commit Verification

```bash
pnpm lint       # oxlint + format check (must pass)
pnpm test       # all tests must pass
pnpm build      # tsc compiles without errors
```

## Best Practices

- [Before/While/After coding](../best-practices.md)
- [Common Pitfalls](../best-practices.md#common-pitfalls)

## Key References

- [Rules Index](../agents/rules/) | [Tooling](../tooling.md) | [Reference](../reference.md) | [Best Practices](../best-practices.md)
