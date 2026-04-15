# Code Quality Rules

| ID  | Rule                                                                                                                                                                                               | Why                           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| R01 | **Strict TypeScript**: `strict: true` always                                                                                                                                                       | Type safety                   |
| R02 | **No `any`**: use `unknown` or proper types                                                                                                                                                        | Type system integrity         |
| R03 | **ESM only**: `import`/`export` syntax                                                                                                                                                             | Matches tsconfig              |
| R04 | **Named exports preferred**: no `export default` unless required                                                                                                                                   | Tree-shaking, symbol tracking |
| R05 | **File < 300 lines, function < 50 lines** (target; exceptions allowed with justification for visitor/transformer modules or other complex cases where mechanical splitting would hurt readability) | Testability                   |
| R06 | **No `console.log` in core logic**: use proper error handling                                                                                                                                      | Clean CLI output              |
| R07 | **JSDoc on exported functions/types**: required for public APIs, extension points, complex types, and non-obvious contracts. May be omitted for trivial internal exports.                          | Self-documenting              |

## Project Conventions (Source of Truth)

- **Tests location**: all test code must live in the root-level `test/` directory.
