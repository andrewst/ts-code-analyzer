# Testing Rules

| ID  | Rule                                                                          | Why                     |
| --- | ----------------------------------------------------------------------------- | ----------------------- |
| T01 | **Test-first**: tests before or alongside code                                | Coverage, clarity       |
| T02 | **100% core coverage**: Scanner, Parser, API Builder, Graph Builder, Detector | Critical path           |
| T03 | **Fixtures in `test/fixtures/`**: one per scenario from RFC Section 9         | Reproducible edge cases |
| T04 | **Integration tests**: end-to-end with real TypeScript projects               | Pipeline validation     |
| T05 | **Naming**: `describe('<ComponentName>')`, `it('should <behavior>')`          | Clarity                 |

---

_See: [Code Quality Rules](code-quality.md) | [Architecture Rules](architecture.md) | [Git Workflow Rules](git-workflow.md) | [Tooling](../tooling.md) | [Back to Rules Index](../AGENTS.md#rules)_
