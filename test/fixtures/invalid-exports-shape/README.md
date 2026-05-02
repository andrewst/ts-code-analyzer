# Fixture: invalid-exports-shape

Scenario coverage:

- `package.json` `exports` exists but is not an object or string
- resolver should ignore it and return an empty export list
