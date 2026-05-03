# Fixture: resolver-exports-branches

Scenario coverage:

- Root export points at `./dist/index.d.ts`; resolver strips `.d.ts`, maps `dist/` candidates to `src/`, and resolves `resolvedFile` to `src/index.ts`.
- Subpath `./feature` uses a nested object with only a non-priority condition key (`custom-key`), exercising fallback resolution via `Object.values`.
- Subpath `./skip-null-import` sets `"import": null`; `findPreferredExportTarget` yields nothing and the entry is omitted from `packageExports`.
