# Testing Rules

| ID  | Rule                                                                                                                                                                                         | Why                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| T01 | **Test-first**: tests before or alongside code                                                                                                                                               | Coverage, clarity       |
| T02 | **Core coverage threshold**: >= 95% for critical modules (parsing/source loading, symbol/model extraction, graph construction, rule evaluation/detection, CLI/report integration); 100% for purely deterministic pure functions. Critical modules must be listed in `test/critical-modules.md`. | Critical path           |
| T03 | **Fixtures in `test/fixtures/`**: one per edge case scenario                                                                                                                                 | Reproducible edge cases |
| T04 | **Integration tests**: end-to-end with real TypeScript projects                                                                                                                              | Pipeline validation     |
| T05 | **Naming**: `describe('<ComponentName>')`, `it('should <behavior>')`                                                                                                                         | Clarity                 |
| T06 | **Vitest**: use `vitest` for all tests. Prefer snapshot tests (`toMatchSnapshot`) for verifying complex data structures (AST output, reports).                                               | Tooling consistency     |
| T07 | **Fixture documentation**: each fixture in `test/fixtures/` must include a brief comment or a local `README.md` describing the analysis scenario it covers.                                  | Discoverability         |
