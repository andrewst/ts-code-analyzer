# Project Description

## Overview

When a TypeScript (npm) library grows to a large size, tracking which code is actually used becomes very difficult.
When exporting objects from a file, it's not obvious whether they will be part of the public API or not.
If exported entities are not used within the library itself, in tests, or in demo examples, they can remain in the codebase for a long time as dead weight.

## Goal

Design a utility for detecting dead code among exported objects and functions in a TypeScript library.

The utility should identify:

- Files containing exported entities that are not used in the library's public API;
- Specific exported objects/functions that have no usages in the public API.

**Important:** If a function is used only in tests or demos but not in the public API or within the library itself, it is considered dead code.

## Inputs

1. TypeScript library source code;
2. The public API is defined by export files in the root of the `src/` directory (not only `index.ts`, but also other files, e.g., `src/utils.ts`);
3. External consumers of the library can only use exports from the public API (enforcement of restrictions against using internal code bypassing the public API is handled by a separate utility);
4. Unit tests are located in the `./tests` directory at the repository root;
5. Demo examples of library usage are in the `./demo` directory;
6. TypeScript configuration (`tsconfig.json`) for correct path and dependency resolution.

## Outputs

The utility should provide:

1. A list of files containing dead code (exports without usages);
2. For each file — a list of specific exported entities (functions, classes, interfaces, types, constants) that are not used;
3. Output format: console report (text/json) with the ability to export to a file.

## Dead Code Criteria

An exported entity is considered **dead code** if **all** of the following are true:

- Not imported or used in other library files (excluding tests and demos);
- Not part of the library's public API (not re-exported from files in the root of `src/`);
- Used **only** in tests (`./tests`) or demos (`./demo`), or not used at all.

## Technical Requirements

- AST-level (Abstract Syntax Tree) analysis for accurate import/export tracking;
- TypeScript syntax support (including type-only imports/exports, namespaces, re-exports);
- Recursive dependency tracking (if A exports B, and B uses C, then C is not considered dead);
- Ignore third-party dependencies (node_modules).

## Limitations

- The utility does not analyze dynamic imports (`import()`);
- Does not track reflection and metaprogramming (e.g., access via `window['funcName']`);
- Does not account for exports that may only be used at runtime via third-party tools (bundlers, plugins).
