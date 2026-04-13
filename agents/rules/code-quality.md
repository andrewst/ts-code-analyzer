# Code Quality Rules

| ID | Rule | Why |
|----|------|-----|
| R01 | **Strict TypeScript**: `strict: true` always | Type safety |
| R02 | **No `any`**: use `unknown` or proper types | Type system integrity |
| R03 | **ESM only**: `import`/`export` syntax | Matches tsconfig |
| R04 | **Named exports preferred**: no `export default` unless required | Tree-shaking, symbol tracking |
| R05 | **File < 300 lines, function < 50 lines** | Testability |
| R06 | **No `console.log` in core logic**: use proper error handling | Clean CLI output |
| R07 | **JSDoc on all exported functions/types** | Self-documenting |

---
*See: [Architecture Rules](architecture.md) | [Testing Rules](testing.md) | [Git Rules](git-workflow.md)*
