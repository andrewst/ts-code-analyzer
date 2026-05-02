# Fixture: read-error-tsconfig

Scenario coverage:

- `tsconfig.json` path exists but is not a readable file
- resolver should surface a typed `TSCONFIG_INVALID` read error
