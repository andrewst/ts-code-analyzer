# TypeScript Code Analyzer

> ⚠️ **Early Development**: This project is in its initial stages of development. Features, APIs, and documentation are subject to change.

> 📖 **Documentation & Roadmap**: Detailed design documents, ideas, and development plans are available in the [`./docs`](./docs) directory.

A static analysis utility for detecting dead code in TypeScript libraries. This tool identifies exported symbols that are not consumed by the public API, library source code, or are only used in tests/demo code.

## Features

- **Dead Code Detection**: Identifies exported symbols that aren't used in the public API or library source code
- **Public API Analysis**: Tracks re-export chains to determine the complete public API surface
- **Usage Graph Construction**: Builds a directed graph of symbol usage across the codebase
- **Context-Aware**: Distinguishes between usage in source code, tests, and demo files
- **Multiple Output Formats**: Human-readable console output and machine-readable JSON reports
- **CI/CD Integration**: Configurable exit codes for pipeline integration
- **Configurable**: Support for CLI arguments and configuration files

## Installation

```bash
pnpm install
```

## Build

```bash
pnpm run build         # Compile TypeScript to JavaScript
pnpm run build-go      # Compile using TypeScript native preview
pnpm run dev           # Watch mode: type-check without emitting
pnpm run dev-go        # Watch mode using TypeScript native preview
pnpm run start         # Run the application with tsx (no build required)
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

## Usage

```bash
pnpm run start -- \
  --src ./src \
  --tests ./tests \
  --demo ./demo \
  --tsconfig ./tsconfig.json \
  --format json \
  --output report.json \
  --fail-on-dead-code
```

Or use the CLI binary directly (after building):

```bash
detect-dead-code \
  --src ./src \
  --tests ./tests \
  --demo ./demo \
  --tsconfig ./tsconfig.json \
  --format json \
  --output report.json \
  --fail-on-dead-code
```

## Configuration

Create a `.deadcoderc.json` file in your project root:

```json
{
  "src": "./src",
  "tests": "./tests",
  "demo": "./demo",
  "tsconfig": "./tsconfig.json",
  "exclude": ["**/*.spec.ts", "**/*.test.ts"],
  "ignoreSymbols": ["someKnownUtility"],
  "failOnDeadCode": true,
  "reportFormat": "json"
}
```

## How It Works

1. **Project Scanner**: Discovers and catalogs all TypeScript files
2. **AST Parser & Analyzer**: Extracts export/import relationships using abstract syntax tree analysis
3. **Public API Builder**: Traces re-export chains to build the complete public API surface
4. **Usage Graph Builder**: Constructs a directed graph of symbol usage
5. **Dead Code Detector**: Compares exported symbols against usage patterns to identify dead code

## Output

The tool provides both human-readable and machine-readable reports:

- Console output with detailed symbol information
- JSON output for automated processing
- Configurable exit codes (0: no dead code, 1: dead code found, 2: analysis error)

## Architecture

See [RFC Document](docs/rfc_of_project_rus.md) for detailed architectural specifications.

## Tech Stack

- **TypeScript 6.0+** with TypeScript Compiler API for AST parsing
- **ES2022** target with NodeNext module resolution
- **ES modules (ESM)**
- **pnpm** package manager (v10.33.0)
- **Vitest** for testing with V8 coverage
- **oxlint** for fast linting
- **Prettier** for code formatting
- **concurrently** for parallel script execution

## License

MIT
