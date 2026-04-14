# Architecture Rules

| ID  | Rule                                                               | Why                     |
| --- | ------------------------------------------------------------------ | ----------------------- |
| A01 | **Single responsibility**: each module has one clear purpose       | Maintainability         |
| A02 | **Component isolation**: each component in its own directory       | Independent testing     |
| A03 | **Pure core logic**: no side effects, no I/O in analysis functions | Deterministic, testable |
| A04 | **Dependency injection**: constructor/args, no globals             | Mockability             |
| A05 | **No circular dependencies**: unidirectional data flow             | Clear architecture      |
