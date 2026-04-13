# Reference

## Target File Structure

```
src/
├── index.ts
├── cli/
│   ├── args.ts
│   ├── config.ts
│   └── output.ts
├── core/
│   ├── scanner/
│   │   ├── scanner.ts
│   │   ├── types.ts
│   │   └── scanner.test.ts
│   ├── parser/
│   │   ├── parser.ts
│   │   ├── exports.ts
│   │   ├── imports.ts
│   │   ├── types.ts
│   │   └── parser.test.ts
│   ├── api-builder/
│   │   ├── api-builder.ts
│   │   ├── types.ts
│   │   └── api-builder.test.ts
│   ├── graph-builder/
│   │   ├── graph-builder.ts
│   │   ├── graph.ts
│   │   ├── types.ts
│   │   └── graph-builder.test.ts
│   └── detector/
│       ├── detector.ts
│       ├── rules.ts
│       ├── types.ts
│       └── detector.test.ts
├── types/
│   └── index.ts
└── utils/
    ├── path.ts
    └── errors.ts
```

## Commands

| Command                    | Purpose                    |
| -------------------------- | -------------------------- |
| `pnpm run dev`             | Type-check watch (no emit) |
| `pnpm run build`           | Compile                    |
| `pnpm run start -- <args>` | Run with tsx               |

## Key Files

| File                                 | Purpose               |
| ------------------------------------ | --------------------- |
| `docs/rfc_of_project_rus.md`         | Architecture          |
| `docs/description_of_project.md` | Task description      |
| `tsconfig.json`                      | TypeScript config     |
| `package.json`                       | Dependencies, scripts |

## Key RFC Sections

| Section | Topic                                         |
| ------- | --------------------------------------------- |
| 3       | Dead code definition, public API, valid usage |
| 4       | Component architecture                        |
| 5       | Data flow                                     |
| 6       | Implementation strategy                       |
| 7       | Output format                                 |
| 9       | Edge cases and limitations                    |
