# Testing Rules

| ID  | Rule                                                                          | Why                     |
| --- | ----------------------------------------------------------------------------- | ----------------------- |
| T01 | **Test-first**: tests before or alongside code                                | Coverage, clarity       |
| T02 | **100% core coverage**: Scanner, Parser, API Builder, Graph Builder, Detector | Critical path           |
| T03 | **Fixtures in `test/fixtures/`**: one per edge case scenario                  | Reproducible edge cases |
| T04 | **Integration tests**: end-to-end with real TypeScript projects               | Pipeline validation     |
| T05 | **Naming**: `describe('<ComponentName>')`, `it('should <behavior>')`          | Clarity                 |
