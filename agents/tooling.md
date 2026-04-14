# Tooling & Configuration

## Runtime & Package Metadata

- **Package type**: CLI-only package
- **Binary name**: `ts-code-analyzer`
- **Runtime**: Node.js `20+`
- **Package manager**: `pnpm@10.33.0`

## Linting

| Tool         | Config File                        | Purpose                                                |
| ------------ | ---------------------------------- | ------------------------------------------------------ |
| **Oxlint**   | [`.oxlintrc.json`](.oxlintrc.json) | TypeScript linting (correctness, suspicious, pedantic) |
| **Prettier** | [`.prettierrc`](.prettierrc)       | Code formatting                                        |

### Key Settings

- **Oxlint plugins**: `typescript`, `unicorn`, `oxc`, `import`
- **Categories**: `correctness: error`, `suspicious: warn`, `pedantic: warn`
- **Rules**: `no-unused-vars: error`, `no-console: warn`
- **Prettier**: `semi: true`, `singleQuote: true`, `trailingComma: all`, `printWidth: 100`, `tabWidth: 2`, `arrowParens: always`, `endOfLine: lf`

### Commands

```bash
pnpm lint          # Run oxlint + format check (parallel)
pnpm lint:fix      # Auto-fix lint + format issues
pnpm oxlint        # Run oxlint only
pnpm oxlint:fix    # Run oxlint with auto-fix
pnpm format        # Format all ts/js/json/md files
pnpm format:check  # Check formatting only
```

## Testing

| Tool       | Config File                            | Purpose                    |
| ---------- | -------------------------------------- | -------------------------- |
| **Vitest** | [`vitest.config.ts`](vitest.config.ts) | Unit & integration testing |

### Key Settings

- **Environment**: `node`
- **Test files**: `test/**/*.test.ts`
- **Coverage provider**: `v8`
- **Coverage thresholds**: `branches: 95`, `functions: 95`, `lines: 95`, `statements: 95`
- **Reporters**: `text`, `json`, `html`

### Commands

```bash
pnpm test            # Run tests once
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Run tests with coverage report
```

## TypeScript

| Config File                      | Key Settings                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| [`tsconfig.json`](tsconfig.json) | `target: ES2022`, `module: NodeNext`, `strict: true`, `rootDir: src`, `outDir: dist` |

### Commands

```bash
pnpm build         # Compile TypeScript (tsc)
pnpm dev           # Watch mode (tsc --watch --noEmit)
pnpm typecheck     # One-off TypeScript check (no emit)
```

## Packaging

### Commands

```bash
pnpm prepack       # Build dist/ before package packing or publishing
```
