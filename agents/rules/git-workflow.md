# Git Workflow Rules

| ID  | Rule                                                                               | Why                    |
| --- | ---------------------------------------------------------------------------------- | ---------------------- |
| G01 | **Atomic commits**: one logical change per commit                                  | Review, bisect, revert |
| G02 | **Conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:` | Changelog, history     |
| G03 | **No direct main commits**: feature branches                                       | Stable main            |
| G04 | **Update docs with code**: RFC deviation → document it                             | Documentation currency |

### Commit Message Format

```
<type>(<scope>): <subject>

<body — bullet points>

Refs: RFC Section X.Y
```

---

_See: [Code Quality Rules](code-quality.md) | [Architecture Rules](architecture.md) | [Testing Rules](testing.md) | [Tooling](../tooling.md) | [Back to Rules Index](../AGENTS.md#rules)_
