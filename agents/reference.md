# Reference

## Commands

| Command                    | Purpose                    |
| -------------------------- | -------------------------- |
| `pnpm run dev`             | Type-check watch (no emit) |
| `pnpm run typecheck`       | One-off type check         |
| `pnpm run build`           | Compile                    |
| `pnpm run start -- <args>` | Run with tsx               |
| `pnpm run prepack`         | Build CLI before packing   |

## Key Files

| File                              | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `AGENTS.md`                       | Central agent configuration, roles, and rule mapping |
| `CLAUDE.md`                       | Claude-specific project entry point                  |
| `package.json`                    | Package metadata and scripts                         |
| `tsconfig.json`                   | TypeScript compiler configuration                    |
| `vitest.config.ts`                | Vitest test configuration                            |
| `src/index.ts`                    | Development CLI entry point                          |
| `test/*.test.ts`                  | Test coverage for project behavior                   |
| `docs/01_Vision/vision.md`        | Product vision source                                |
| `docs/02_Discovery/discovery.md`  | PD output                                            |
| `docs/03_Stories/stories.md`      | PM output                                            |
| `docs/03_Stories/architecture.md` | ARC output                                           |
| `docs/04_Tasks/tasks.md`          | PLAN output                                          |
