# TypeScript Code Analyzer

[![CI](https://github.com/andrewst/ts-code-analyzer/actions/workflows/ci.yml/badge.svg)](https://github.com/andrewst/ts-code-analyzer/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/andrewst/ts-code-analyzer/graph/badge.svg?token=KRMTRYHI64)](https://codecov.io/github/andrewst/ts-code-analyzer)

> ⚠️ **Early Development**: This project is in its initial stages of development. Features, APIs, and documentation are subject to change.

> 📖 **Documentation & Roadmap**: Detailed design documents, ideas, and development plans are available in the [`docs`](docs) directory.

A CLI project for analyzing TypeScript codebases and surfacing decision-oriented maintenance insights.

The long-term goal is to help engineers and maintainers inspect a codebase, understand what it exposes publicly, and identify what deserves attention first without relying on slow manual exploration.

## Current Status

- **Version**: `0.1.0`
- **Stage**: active early development (CLI flags, heuristics, and report wording may change)
- **Implemented**: an end-to-end CLI pipeline — resolve the target directory and `tsconfig.json`, build a TypeScript Compiler API snapshot (file inventory, module graph, export/re-export graph, diagnostics), run analyzers, and print an observational text report to standard output
- **Workflow modes** (`--workflow`): `structure` (layout metrics only), `public-api` (public surface only), `full` (structure, public API, change-impact, and hotspots). Change-impact and hotspots are produced only in `full`; change-impact additionally requires `--changes` with a newline-delimited list of paths
- **Scope**: CLI-only distribution (`ts-code-analyzer` → `dist/index.js`); using the package as a stable programmatic library API is not a goal for this phase

## Why This Project

As TypeScript codebases grow, it becomes harder to understand their structure, public surface, and likely maintenance hotspots. This project aims to turn static analysis into concise CLI output that helps users inspect a repository faster than by reading the code manually.

## Questions It Aims to Answer

- What does this codebase expose publicly?
- Which parts of the codebase are most important to understand first?
- What changed, and what may be affected by those changes?
- Where are the likely maintenance hotspots?
- How can a maintainer inspect the codebase faster than by manual reading alone?

## Capabilities

**Available today**

- Structure overview (file and directory counts, dominant module-type heuristics, path depth)
- Public API observations prioritizing `package.json` `exports`, then common entry files (for example `src/index.ts`), with re-export reachability used for related signals
- Change-impact neighbors for explicitly listed changed files (module and export edges), when running `full` with `--changes`
- Hotspot candidates from static topology (fan-in, fan-out, public exposure, dependency concentration), top-ranked in `full` mode
- Observational CLI output (descriptive language; no prescriptions)

**Roadmap / follow-ups**

- Deeper maintenance-risk metrics and calibration (for example size-relative public surface)
- Richer or optional output formats and stability guarantees as the tool matures
- Broader project-layout and package-edge cases

## Agent-Driven Development

This project is developed using an **agent-driven approach**. We use a structured multi-role AI workflow to ensure high quality, maintainability, and clear documentation.

Detailed information about the roles, rules, and workflow can be found in the [**`agents/`**](agents/README.md) directory and the [**`AGENTS.md`**](AGENTS.md) file.

## Requirements

- Node.js 20+
- `pnpm` `10.33.0+`

## Installation

```bash
pnpm install
```

## Usage

```bash
pnpm run start -- --help
```

The CLI binary name is `ts-code-analyzer` (mapped to `dist/index.js` in packaged builds).

When you run through `pnpm run start`, everything **after** the first `--` is forwarded to the CLI (`pnpm` otherwise treats flags as its own). Installed or built binaries are invoked directly: `ts-code-analyzer …` or `node dist/index.js …`.

### Running in development (no build)

```bash
# Show help
pnpm run start -- --help

# Analyze the current directory
pnpm run start

# Analyze a specific repository path (positional)
pnpm run start -- ../some-repo

# Equivalent using --target
pnpm run start -- --target ../some-repo
```

### Running a production build

```bash
pnpm run build
node dist/index.js --help
```

### CLI arguments (reference)

| Flag           | Short | Required | Default  | Purpose                                                                                                                                                                                        |
| -------------- | ----- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _(positional)_ | —     | No       | `.`      | Directory of the TypeScript project to analyze (same meaning as `--target`). Only the **first** non-option argument is accepted as the target; additional bare tokens are rejected as unknown. |
| `--target`     | `-t`  | No       | `.`      | Explicit project root. Cannot be combined with a second target: once the target is set (positional or `-t`), another path without a flag is an error.                                          |
| `--workflow`   | `-w`  | No       | `full`   | Which slices of the report to compute and print (see **Workflow modes** below).                                                                                                                |
| `--changes`    | `-c`  | No       | _(none)_ | Path to a UTF-8 text file listing changed source paths (see **Changes file** below). Parsed at startup; invalid paths or missing files fail the run before analysis.                           |
| `--help`       | `-h`  | No       | —        | Print usage and exit with status `0`.                                                                                                                                                          |

**Target directory**

- Must exist and be a **directory** (not a single file).
- The loader looks for **`tsconfig.json` directly under** that directory (`<target>/tsconfig.json`). Extend or compose projects via your tsconfig (references, paths); the CLI does not accept a separate `--project` path yet.
- Paths may be relative (resolved from the current working directory) or absolute.

**Workflow modes**

| Mode         | Report sections                                | Notes                                                                                                                                                                            |
| ------------ | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `structure`  | Structure only                                 | Fast layout-oriented snapshot (counts, depth, module-type heuristics).                                                                                                           |
| `public-api` | Public API only                                | Entry discovery (`package.json` `exports` first, then common entry files such as `src/index.ts`) and observed export names.                                                      |
| `full`       | Structure, Public API, Change impact, Hotspots | Change-impact observations appear **only** when `--changes` is provided (otherwise that section is empty). Hotspots are always computed in this mode from the snapshot topology. |

Using `--changes` with `structure` or `public-api` is allowed but **has no effect** on the printed report today (those workflows never emit change-impact or hotspots).

**Changes file (`--changes`)**

- Plain text, **one path per line**; Windows (`\r\n`) and Unix (`\n`) newlines are accepted.
- Empty lines are skipped; leading/trailing whitespace on a line is trimmed.
- Paths are typically **relative to the project root** (for example `src/app.ts`). Absolute paths under the project root are normalized when possible; paths outside the analyzed file list yield empty neighbor sets for that row but do not abort the run.

**Parsing rules**

- Options that take a value (`--target`, `--workflow`, `--changes`) require the value to **follow immediately** as the next argv token; omitting the value is an error.
- Unknown flags or unexpected positional arguments (after the target is already fixed) produce an error message on stderr and exit code `1`.
- Flags may be mixed in any order relative to the positional target, except that the first bare non-flag argument only sets the target while it is still the default (`.`).

Examples:

```bash
# Full analysis (default): structure, public API, change-impact (if --changes), hotspots
pnpm run start -- ../some-repo

# Public API only (no structure / change-impact / hotspots sections)
pnpm run start -- ../some-repo --workflow public-api

# Changed-files list (one path per line); affects output only with --workflow full
pnpm run start -- ../some-repo --workflow full --changes ./changed-files.txt

# Explicit target and workflow (equivalent to positional target)
pnpm run start -- --target ../some-repo --workflow structure

# Built binary (after pnpm run build)
node dist/index.js . --workflow public-api --changes /tmp/changed.txt
```

## Development

```bash
pnpm run dev           # Watch mode: type-check without emitting
pnpm run dev-go        # Watch mode using TypeScript native preview
pnpm run start         # Run the application with tsx (no build required)
pnpm run typecheck     # Run a one-off TypeScript check
```

## Build

```bash
pnpm run clean         # Remove dist/
pnpm run build         # Bundle + minify into dist/index.js (single-file)
pnpm run build-go      # Compile using TypeScript native preview
```

Package builds use `pnpm run prepack` automatically before packaging so that the CLI binary is compiled into `dist/`.

## Testing

```bash
pnpm run test          # Run tests once
pnpm run test:watch    # Run tests in watch mode
pnpm run test:coverage # Run tests with coverage report
```

## Linting & Formatting

```bash
pnpm run lint          # Run oxlint and prettier (check mode)
pnpm run lint:fix      # Run oxlint and prettier (fix mode)
pnpm run oxlint        # Run oxlint only
pnpm run oxlint:fix    # Run oxlint with auto-fix
pnpm run format        # Format code with prettier
pnpm run format:check  # Check formatting with prettier
```

## Tech Stack

- **TypeScript 6.0+** with TypeScript Compiler API (programs, type checker, module resolution)
- **ES2022** target with NodeNext module resolution
- **ES modules (ESM)**
- **pnpm** package manager (v10.33.0)
- **Vitest** for testing with V8 coverage
- **oxlint** for fast linting
- **Prettier** for code formatting
- **concurrently** for parallel script execution

## Documentation

- [Idea](docs/00_Idea/idea.md) - original product idea
- [Vision](docs/01_Vision/vision.md) - product direction and goals
- [Project documentation](docs) - complete documentation index

## License

MIT
