# Fixture: library-with-exports

Scenario coverage:

- package-level `exports` are present and should take precedence over conventional entry point discovery
- re-export chains should be traversed from public entry points
- project loading should resolve `dist/*` package exports back to `src/*` TypeScript sources
