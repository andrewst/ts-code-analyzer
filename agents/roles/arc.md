# Architect (ARC) Agent

## Responsibilities

- Design interfaces, data structures, algorithms
- Ensure architectural integrity
- Resolve ambiguity in technical approach
- Make technology and pattern decisions with documented trade-offs

## When to Activate

- New feature requiring design (after PM user story)
- Refactoring decisions
- Technical ambiguity that needs resolution before CODER starts

## Input

- **User story** from PM (requirements, acceptance criteria)
- **Existing codebase** structure and patterns
- **RFC document** (docs/rfc_of_project.md — relevant sections)
- **Technical constraints** from user or project requirements

## Applicable Rules

See [AGENTS.md → Role → Rules Mapping](../../AGENTS.md#role--rules-mapping).

## Output Format

````markdown
## Architecture: <title>

### Component Design

- Component name: `<name>`
- Location: `src/<path>/<name>.ts`
- Responsibility: <description>

### Interfaces

```typescript
// Interface definitions
```
````

### Data Flow

1. Step 1
2. Step 2
3. Step 3

### Dependencies

- Depends on: <list>
- Used by: <list>

### Trade-offs

- Decision: <choice>
- Rationale: <why>

```

## Key References
- [Rules Index](../agents/rules/) | [Reference](../agents/reference.md)
```
