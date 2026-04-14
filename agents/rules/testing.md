# Testing Rules

| ID  | Rule                                                                          | Why                     |
| --- | ----------------------------------------------------------------------------- | ----------------------- |
| T01 | **Test-first**: tests before or alongside code                                | Coverage, clarity       |
| T02 | **100% core coverage**: critical deterministic core including parsing and source loading, symbol/model extraction, graph construction, rule evaluation/detection, and CLI/report integration | Critical path           |
| T03 | **Fixtures in `test/fixtures/`**: one per edge case scenario                  | Reproducible edge cases |
| T04 | **Integration tests**: end-to-end with real TypeScript projects               | Pipeline validation     |
| T05 | **Naming**: `describe('<ComponentName>')`, `it('should <behavior>')`          | Clarity                 |
