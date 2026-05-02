# Code Quality Rules

| ID  | Rule                                                                                                                                                                                               | Why                           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| R01 | **Strict TypeScript**: `strict: true` always                                                                                                                                                       | Type safety                   |
| R02 | **No `any`**: use `unknown` or proper types                                                                                                                                                        | Type system integrity         |
| R03 | **ESM only**: `import`/`export` syntax                                                                                                                                                             | Matches tsconfig              |
| R04 | **Named exports preferred**: no `export default` unless required                                                                                                                                   | Tree-shaking, symbol tracking |
| R05 | **Size guidelines** (recommended, not hard limits): file < 300 lines, function < 50 lines. Exceeding requires documented justification in the PR. Exceptions: visitor/transformer modules or cases where mechanical splitting hurts readability. | Testability                   |
| R06 | **No `console.log` in core logic**: use proper error handling. `console.info`/`console.error` are permitted only in the CLI layer or via a dedicated output wrapper.                               | Clean CLI output              |
| R07 | **JSDoc on exported functions/types**: required for public APIs (anything exported from a module's public entry point), extension points, complex types, and non-obvious contracts. Minimum fields: description, `@param`, `@returns`, `@throws` (when applicable). May be omitted for trivial internal exports. | Self-documenting              |
| R08 | **Automated checks**: all code must pass `pnpm lint` (oxlint) and `pnpm format` (prettier) before committing.                                                                                     | Consistent style              |
| R09 | **AST traversal**: use built-in traversal methods (ts-morph Visitor or native Compiler API) over manual string parsing of source code.                                                             | Correctness, performance      |

## Project Conventions (Source of Truth)

- **Tests location**: all test code must live in the root-level `test/` directory.
