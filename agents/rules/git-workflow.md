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
