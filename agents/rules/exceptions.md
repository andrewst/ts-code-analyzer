# Rule Exceptions

This file defines the process for requesting and documenting exceptions to rules in `agents/rules/`.

## When to use

An exception is required whenever code intentionally violates a rule and the justification cannot fit in a code comment alone (e.g. exceeding R05 size limits, allowing I/O in a non-adapter module, dropping coverage below the T02 threshold for a specific module).

## Exception request template

Copy the block below into your PR description or into this file (for long-lived exceptions):

```
### Exception Request

| Field          | Value                                      |
| -------------- | ------------------------------------------ |
| Rule           | <ID and short name, e.g. R05 Size limits>  |
| Location       | <file path or module>                      |
| Reason         | <why the rule cannot be followed here>     |
| Impact         | <what risk or trade-off this introduces>   |
| Time horizon   | <permanent / until <date or milestone>>    |
| Owner          | <GitHub handle of the responsible person>  |
```

## Long-lived exceptions

Document permanent or long-running exceptions below so they are visible to all contributors.

<!-- Example:
### Exception: R05 — src/visitors/TypeChecker.ts

| Field        | Value                                                         |
| ------------ | ------------------------------------------------------------- |
| Rule         | R05 Size guidelines                                           |
| Location     | src/visitors/TypeChecker.ts                                   |
| Reason       | Visitor pattern requires handling every node kind in one place; mechanical splitting degrades readability |
| Impact       | Harder to navigate; mitigated by internal section comments    |
| Time horizon | Permanent unless visitor is split into sub-visitors           |
| Owner        | @andrewst                                                     |
-->
