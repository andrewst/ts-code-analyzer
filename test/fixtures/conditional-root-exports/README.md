# Fixture: conditional-root-exports

Scenario coverage:

- top-level `package.json` `exports` uses condition keys directly
- resolver should normalize it to the `"."` subpath and prefer the runtime import target
