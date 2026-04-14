# TypeScript Code Analyzer

> ⚠️ **Early Development**: This project is in its initial stages of development. Features, APIs, and documentation are subject to change.

> 📖 **Documentation & Roadmap**: Detailed design documents, ideas, and development plans are available in the [`docs`](docs) directory.

A static analysis utility in TypeScript libraries.

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
