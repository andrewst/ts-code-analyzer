# Architecture Rules

| ID  | Rule                                                               | Why                     |
| --- | ------------------------------------------------------------------ | ----------------------- |
| A01 | **Follow RFC**: components match `docs/rfc_dead_code_detection.md` | Architectural integrity |
| A02 | **Component isolation**: each component in its own directory       | Independent testing     |
| A03 | **Pure core logic**: no side effects, no I/O in analysis functions | Deterministic, testable |
| A04 | **Dependency injection**: constructor/args, no globals             | Mockability             |
| A05 | **No circular dependencies**: unidirectional data flow             | Clear architecture      |

---

_See: [Code Quality Rules](code-quality.md) | [Testing Rules](testing.md) | [Git Workflow Rules](git-workflow.md) | [Back to Rules Index](../AGENTS.md#rules)_
