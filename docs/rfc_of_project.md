# RFC: TypeScript Library Dead Code Detection Utility

## 1. Overview

This document describes the architectural design of a static analysis utility for detecting dead code in TypeScript library exports. The utility identifies exported symbols that are not consumed by the library's public API, unit tests, or demonstration code.

## 2. Problem Statement

Large TypeScript libraries accumulate exported symbols over time without a clear understanding of which exports are actually used. Exports that exist only in internal files but are not re-exported through public API entry points, or are used only in tests/demo code, represent dead code that increases maintenance costs and bundle size.

## 3. Core Concepts

### 3.1 Dead Code Definition

An exported symbol is considered **dead code** when:

- It is exported from a TypeScript file within the library
- It is NOT re-exported through any public API entry point (files in the `src/` root)
- It is NOT used in the library's production code (excluding the file where it is defined)
- Usage ONLY in tests (`./tests`) or demo (`./demo`) does NOT count as valid usage

### 3.2 Public API Definition

The public API consists of:

- All files in the `src/` root directory that contain exports (e.g., `src/index.ts`, `src/utils.ts`)
- All symbols transitively exported through these entry points
- Re-export chains: if file A exports from file B, and file B exports from file C, all three symbols are part of the public API

### 3.3 Valid Usage Definition

A symbol has valid usage when:

- It is consumed in the library's source code (not just in tests/demo)
- It is part of the public API (directly or transitively)
- Internal usage within the same file does NOT count as valid usage

## 4. System Architecture

### 4.1 High-Level Components

The utility consists of five core components:

1. **Project Scanner**: Discovers and catalogs all TypeScript files in the library
2. **AST Parser and Analyzer**: Parses TypeScript files and extracts export/import relationships using abstract syntax tree analysis
3. **Public API Builder**: Constructs the complete public API surface by analyzing entry point files and their re-export chains
4. **Usage Graph Builder**: Builds a directed graph of symbol usage across the entire codebase
5. **Dead Code Detector**: Cross-references exported symbols against usage patterns to identify dead code

### 4.2 Component Responsibilities

#### 4.2.1 Project Scanner

**Responsibilities:**

- Recursively scan the library's `src/` directory for all `.ts` and `.tsx` files
- Scan the `tests/` directory for test files
- Scan the `demo/` directory for demonstration files
- Identify public API entry points (all files containing exports in the `src/` root)
- Normalize file paths and handle path aliases from `tsconfig.json`

**Outputs:**

- Complete file inventory categorized by type (library source, tests, demo, public API entry points)
- TypeScript configuration parameters (paths, baseUrl, etc.)

#### 4.2.2 AST Parser and Analyzer

**Responsibilities:**

- Parse each TypeScript file into an abstract syntax tree
- Extract all export declarations (named exports, default exports, re-exports)
- Extract all import declarations and their usage patterns
- Handle various export forms:
  - `export const/function/class/interface/type`
  - `export { name }`
  - `export { name } from './path'`
  - `export * from './path'`
  - `export default`
- Resolve symbol references to their definitions
- Track which imported symbols are actually used within the file body

**Outputs:**

- Export manifest for each file with all exported symbols and their types
- Import manifest for each file with all imported symbols and their usage status
- Symbol definition locations for cross-file resolution

#### 4.2.3 Public API Builder

**Responsibilities:**

- Start from identified public API entry points
- Recursively trace all re-export chains
- Build the complete set of symbols that form the public API
- Handle cyclic re-exports and detect infinite loops
- Resolve aliased exports (e.g., `export { foo as bar } from './path'`)
- Track the source file for each publicly exported symbol

**Algorithm:**

1. Collect all entry point files from the `src/` root
2. For each entry point, parse its exports
3. For re-exports (`export ... from`) — recursively process the source file
4. Build a mapping: symbol name → source file → is part of public API
5. Continue until all re-export chains are fully resolved

**Outputs:**

- Complete set of public API symbols with source file mappings
- Re-export chain graph for debugging/visualization

#### 4.2.4 Usage Graph Builder

**Responsibilities:**

- Build a directed graph of all symbol usage across the codebase
- Nodes: symbols (functions, classes, constants, types, interfaces)
- Edges: usage relationships (file A uses symbol from file B)
- Categorize edges by context (library source, tests, demo)
- Track cross-file dependencies

**Graph Construction:**

1. For each file, identify all imported symbols
2. For each import, verify whether the symbol is used within the file body
3. Create edges from the usage location to the symbol's definition
4. Label edges with usage context (source/test/demo)
5. Exclude self-references (symbol used in its own definition file)

**Outputs:**

- Complete usage graph with context-labeled edges
- Detection of import/export mismatches (imported but not used locally)

#### 4.2.5 Dead Code Detector

**Responsibilities:**

- Query the usage graph and public API set to identify dead code
- Apply dead code detection rules
- Generate detection reports with actionable information

**Detection Rules:**

A symbol is **dead code** if ANY of these conditions are met:

- Symbol is exported but NOT in the public API AND NOT used in library source code
- Symbol is exported and in the public API, but has no external consumers (edge case for recently added exports)
- Symbol is used ONLY in tests or demo (regardless of public API status)

A symbol is **valid** if:

- Symbol is in the public API AND is used in at least one non-test/demo file
- Symbol is used in library source code by other files (internal utility)

**Outputs:**

- List of dead code symbols with metadata
- Classification of why each symbol is considered dead
- Remediation suggestions

## 5. Data Flow

```
[TypeScript Files]
       ↓
[Project Scanner] → File Inventory
       ↓
[AST Parser & Analyzer] → Export/Import Manifests
       ↓
       ├─────────────────┬──────────────────┐
       ↓                 ↓                  ↓
[Public API Builder]  [Usage Graph Builder] [Context Classifier]
       ↓                 ↓                  ↓
[Public API Set]      [Usage Graph]        [Source/Test/Demo Labels]
       ↓                 ↓                  ↓
       └─────────────────┴──────────────────┘
                         ↓
              [Dead Code Detector]
                         ↓
                 [Detection Report]
```

## 6. Implementation Strategy

### 6.1 Technology Stack

**Recommended Approach:**

- Use the TypeScript Compiler API or a specialized AST parsing library (e.g., `ts-morph`, `@typescript-eslint/typescript-estree`)
- These libraries provide high-level APIs for:
  - Parsing TypeScript files with full type information
  - Traversing AST nodes
  - Resolving symbol references
  - Handling TypeScript-specific constructs (generics, namespaces, modules)

**Alternative Approach:**

- Use simpler text-based pattern matching with regex (not recommended due to complexity and unreliability)

### 6.2 Phase 1: Project Scanning and File Discovery

**Steps:**

1. Read `tsconfig.json` to understand project structure
2. Resolve path aliases and compiler options
3. Traverse `src/`, `tests/`, `demo/` directories
4. Categorize files by type and location
5. Identify public API entry points (files in `src/` root with exports)

**Considerations:**

- Handle `exclude` and `include` patterns from `tsconfig.json`
- Support monorepo structures if needed
- Properly handle `.d.ts` declaration files

### 6.3 Phase 2: AST Parsing and Symbol Extraction

**Steps:**

1. Parse each TypeScript file using the chosen parser
2. Extract all export declarations with metadata:
   - Symbol name
   - Symbol type (function, class, constant, interface, type, etc.)
   - Export kind (named, default, re-export)
   - Source location (file path, line number)
3. Extract all import declarations:
   - Imported symbol names
   - Source module
   - Import kind (named, default, namespace)
4. Analyze file body to determine which imported symbols are actually used
5. Build symbol tables for each file

**Edge Cases to Handle:**

- Dynamic imports (`import()`)
- Namespace imports (`import * as ns from './path'`)
- Namespace exports (`export as namespace ns`)
- Ambient declarations
- Declaration merging
- Generic types and type aliases
- Type-only imports (`import type { ... }`)

### 6.4 Phase 3: Public API Construction

**Steps:**

1. Start from entry point files in the `src/` root
2. For each entry point:
   - Parse all exports
   - For re-exports — recursively process source files
   - Track re-export chains to avoid infinite loops
3. Build the complete set of public API symbols
4. Map each public symbol to its source file

**Key Algorithm Points:**

- Detect cycles in re-export chains (use a visited set)
- Properly handle aliased exports
- Distinguish between `export * from` (barrel) and `export { name } from` (selective)
- Track which symbols are truly public vs. internal utilities leaking through exports

### 6.5 Phase 4: Usage Graph Construction

**Steps:**

1. For each file in the codebase:
   - Get all imported symbols
   - Check which imported symbols are actually used in the file body
   - Create directed edges from usage location to symbol definition
2. Label each edge with context (source/test/demo)
3. Build an adjacency list representation of the graph

**Usage Detection Logic:**

- For each import, search the file's AST for references to the imported name
- Handle destructuring (`const { foo } = bar`)
- Handle property access (`obj.method()`)
- Handle type references (when analyzing types, not just values)

### 6.6 Phase 5: Dead Code Detection

**Steps:**

1. For each exported symbol in the codebase:
   - Check if the symbol is in the public API set
   - Check if the symbol has usage edges in library source code
   - Check if the symbol has ONLY usage edges in tests/demo
2. Apply detection rules:
   - If NOT in public API AND NOT used in source code → dead code
   - If used ONLY in tests/demo → dead code
   - Otherwise → valid code
3. Generate report with classifications

**Report Fields per Symbol:**

- Symbol name
- Symbol type (function, class, constant, etc.)
- File path where defined
- Export type (named, default, re-export)
- Classification reason (why it is dead code or valid)
- List of files where it is used (for context)
- Line number in the source file

## 7. Output Format

The utility should produce reports in multiple formats:

### 7.1 Console Output (Human-Readable)

```
Dead Code Detection Report
==========================

DEAD CODE (3 symbols):

1. src/utils/internal.ts:15
   Symbol: helperFunction (function)
   Reason: Not part of public API, used only in tests

   Used in:
   - tests/utils.test.ts:42

2. src/models/legacy.ts:8
   Symbol: OldModel (class)
   Reason: Not part of public API, no usage in source code

   No usage detected

3. src/api/deprecated.ts:22
   Symbol: deprecatedMethod (function)
   Reason: Used only in demo code

   Used in:
   - demo/example.ts:15

SUMMARY:
  Total exports analyzed: 156
  Dead code symbols: 3 (1.9%)
  Valid symbols: 153 (98.1%)
```

### 7.2 JSON Output (Machine-Readable)

```json
{
  "summary": {
    "totalExports": 156,
    "deadCode": 3,
    "validCode": 153
  },
  "deadCode": [
    {
      "symbol": "helperFunction",
      "symbolType": "function",
      "file": "src/utils/internal.ts",
      "line": 15,
      "exportType": "named",
      "reason": "Not in public API, used only in tests",
      "usedIn": ["tests/utils.test.ts:42"]
    }
  ],
  "validCode": [...]
}
```

### 7.3 Exit Codes

- `0`: No dead code detected
- `1`: Dead code detected (for CI/CD integration)
- `2`: Error during analysis

## 8. Configuration

The utility should support configuration via:

### 8.1 CLI Arguments

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

### 8.2 Configuration File

Support for `.deadcoderc.json` or similar:

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

## 9. Edge Cases and Limitations

### 9.1 Known Limitations

1. **Dynamic exports/imports**: Cannot detect dynamically generated exports or imports
2. **Reflection-based usage**: Cannot detect usage through reflection or runtime inspection
3. **Type-only usage**: May incorrectly identify type-only imports/exports if not explicitly marked
4. **Side-effect imports**: Cannot determine if side-effect-only imports are necessary (`import './polyfills'`)
5. **Extension/plugin points**: Symbols intended as extension points may appear unused
6. **Third-party usage**: Cannot analyze how external consumers use the library (relies on public API boundary assumption)

### 9.2 Edge Cases

1. **Re-export cycles**: Must handle A → B → A cycles without infinite loops
2. **Namespace exports**: `export * as ns from './path'` requires special handling
3. **Declaration merging**: Symbols with the same name in different contexts
4. **Conditional exports**: Exports gated by type guards or conditional types
5. **Ambient declarations**: `declare` statements in `.d.ts` files
6. **Generic type parameters**: Type parameters that appear unused in function signatures
7. **Barrel files**: Files that only re-export from other files
8. **Index files**: `index.ts` files in subdirectories (not part of public API per current spec)

## 10. Testing Strategy

### 10.1 Unit Tests

- Test each component in isolation with mocked data
- AST Parser: verify correct extraction of exports/imports from various TypeScript constructs
- Public API Builder: verify correct resolution of re-export chains
- Usage Graph Builder: verify correct graph construction
- Dead Code Detector: verify correct classification against known scenarios

### 10.2 Integration Tests

- Test against real TypeScript libraries of varying complexity
- Verify that the end-to-end pipeline produces correct results
- Test with edge cases from Section 9

### 10.3 Test Fixtures

Create test fixtures covering:

- Simple exports with clear usage
- Re-export chains of varying depths
- Cyclic re-exports
- Symbols used only in tests
- Symbols used only in demo
- Symbols used in both source code and tests
- Barrel files
- Type-only exports
- Namespace imports/exports
- Dynamic imports (expected as unresolved)

## 11. Performance

### 11.1 Scalability

- AST parsing is resource-intensive for large codebases
- Consider parallel parsing of independent files
- Cache AST parsing results between runs if files have not changed
- Use incremental analysis (re-parse only modified files)

### 11.2 Memory Usage

- Large codebases may consume significant memory for storing ASTs
- Consider streaming/iterative processing for very large libraries
- Release ASTs after extraction to free memory

### 11.3 Expected Performance

- Small library (< 100 files): < 5 seconds
- Medium library (100-500 files): < 30 seconds
- Large library (500+ files): < 2 minutes

## 12. Integration Points

### 12.1 CI/CD Pipeline

- Run as a build step to catch dead code before merging
- Build failure when dead code is detected (configurable)
- Generate reports as build artifacts

### 12.2 IDE Integration

- Provide a language server plugin for real-time feedback
- Integrate with ESLint or similar linters
- Provide quick-fix suggestions for removing dead code

### 12.3 Related Utilities

- Works alongside the existing public API boundary enforcement utility
- That utility ensures external consumers only use the public API
- This utility ensures internal exports are actually consumed
- Complementary: one checks external usage, this one checks internal waste

## 13. Future Enhancements

### 13.1 Phase 2 Features

- **Automated cleanup suggestions**: Suggest which files to modify to remove dead code
- **Usage heatmap**: Show which symbols are used more/less frequently
- **Trend analysis**: Track dead code accumulation over time
- **Git integration**: Blame dead code to find who added it and when
- **Suppression comments**: Support `// @dead-code-ignore` comments for intentional exports

### 13.2 Advanced Analysis

- **Call graph analysis**: Not just usage, but call frequency analysis
- **Test coverage integration**: Integrate with test coverage data
- **Bundle size impact**: Estimate bundle size reduction from removing dead code
- **Dependency graph visualization**: Generate a visual graph of export/import connections
- **Machine learning**: Predict which dead code is likely to be needed in the future

## 14. Risks and Mitigations

| Risk                                   | Impact    | Mitigation                                                                     |
| -------------------------------------- | --------- | ------------------------------------------------------------------------------ |
| Incorrect AST parsing                  | High      | Use well-tested libraries (ts-morph), extensive test fixtures                  |
| False positives                        | Medium    | Provide clear explanations, allow suppression comments                         |
| Performance on large codebases         | Medium    | Parallel processing, incremental analysis                                      |
| Missed edge cases                      | Low       | Extensive testing, community feedback, iterative improvements                  |
| Breaking changes in TypeScript         | Low       | Pin TypeScript version, test against multiple versions                         |

## 15. Success Criteria

The utility is considered successful when:

1. It correctly identifies > 95% of dead code in test fixtures
2. It produces < 5% false positive rate
3. It completes analysis of a 500-file codebase in < 2 minutes
4. It provides actionable reports that reduce library maintenance costs
5. It integrates smoothly into CI/CD pipelines
6. It is adopted by library maintainers and demonstrates measurable code quality improvement

## 16. Glossary

- **Dead Code**: Exported symbols not consumed by the public API or library source code
- **Public API**: Symbols exported from entry point files in the `src/` root directory
- **Re-export**: An export that redirects symbols from another module
- **Entry Point**: A file in the `src/` root that exports symbols for public consumption
- **Usage Graph**: A directed graph of symbol usage relationships between files
- **AST**: Abstract Syntax Tree, a parsed representation of source code
- **Symbol**: Any named entity (function, class, constant, type, interface, etc.)
- **Barrel File**: A file that only re-exports from other modules without adding new exports
- **Context**: Whether a file is library source code, a test, or demo code
