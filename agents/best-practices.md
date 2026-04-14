# Best Practices

## Before Writing Code

1. Read sibling files for style/patterns
2. Ask user on architectural ambiguity
3. Write tests first (TDD)

## While Writing Code

1. Follow R01–R07 ([Code Quality Rules](rules/code-quality.md))
2. Match existing style: indentation, naming, import order
3. Add JSDoc on all exports
4. Keep core logic pure

## After Writing Code

1. `tsc --noEmit` — must pass
2. All tests pass, coverage meets threshold
3. Linter clean (once configured)
4. Run tool on itself
5. Update docs if implementation differs from design

## Common Pitfalls

| Pitfall                 | Fix                                             |
| ----------------------- | ----------------------------------------------- |
| `any` for AST nodes     | Use TypeScript AST types from chosen library    |
| Mix I/o with core logic | Separate pure functions from I/O                |
| Skip edge cases         | Reference edge case documentation               |
| Over-engineer           | Start simple, add complexity when proven        |
| Skip tests              | Every change includes tests                     |
| Ignore performance      | Consider file count, memory for large codebases |
