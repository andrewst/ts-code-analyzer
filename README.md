# TypeScript Code Analyzer

> ⚠️ **Early Development**: This project is in its initial stages of development. Features, APIs, and documentation are subject to change.

> 📖 **Documentation & Roadmap**: Detailed design documents, ideas, and development plans are available in the [`docs`](docs) directory.

A CLI project for analyzing TypeScript codebases and surfacing decision-oriented maintenance insights.

The long-term goal is to help engineers and maintainers inspect a codebase, understand what it exposes publicly, and identify what deserves attention first without relying on slow manual exploration.

## Current Status

- Version: `0.0.1`
- Status: active early development
- Current CLI entry point exists, but analyzer functionality is not implemented yet
- CLI commands, output format, and analysis scope are still evolving

## Why This Project

As TypeScript codebases grow, it becomes harder to understand their structure, public surface, and likely maintenance hotspots. This project aims to turn static analysis into concise CLI output that helps users inspect a repository faster than by reading the code manually.

## Questions It Aims to Answer

- What does this codebase expose publicly?
- Which parts of the codebase are most important to understand first?
- What changed, and what may be affected by those changes?
- Where are the likely maintenance hotspots?
- How can a maintainer inspect the codebase faster than by manual reading alone?

## Planned Capabilities

- Public API summary for exported declarations and re-exports
- Maintenance-risk signal based on public surface size relative to codebase size
- Concise CLI overview that points to the most important areas for manual inspection
- Practical analysis workflow that fits local CLI-based engineering usage

## Requirements

- Node.js 20+
- `pnpm` `10.33.0+`

## Installation

```bash
pnpm install
```

## Usage

```bash
pnpm run start
```

At the moment, the entry point is a development stub in [src/index.ts](src/index.ts). The production CLI interface and analysis commands are not finalized yet.

## Development

```bash
pnpm run dev           # Watch mode: type-check without emitting
pnpm run dev-go        # Watch mode using TypeScript native preview
pnpm run start         # Run the application with tsx (no build required)
```

## Build

```bash
pnpm run build         # Compile TypeScript to JavaScript
pnpm run build-go      # Compile using TypeScript native preview
```

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

- **TypeScript 6.0+** with TypeScript Compiler API for AST parsing
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
- [Discovery](docs/02_Discovery/discovery.md) - problem framing and analysis
- [Stories](docs/03_Stories/stories.md) - current scope and user stories
- [Architecture](docs/03_Stories/architecture.md) - proposed technical design
- [Project documentation](docs) - complete documentation index

## License

MIT
