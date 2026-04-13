# Architect (ARC) Agent

## Responsibilities
- Design interfaces, data structures, algorithms
- Ensure architectural integrity
- Resolve ambiguity in technical approach

## When to Activate
- New feature requiring design
- Refactoring decisions
- Technical ambiguity

## Applicable Rules
- [Architecture Rules](rules/architecture.md) — A01–A05
- [Code Quality Rules](rules/code-quality.md) — R01–R07

## Output Format

```markdown
## Architecture: <title>

### Component Design
- Component name: `<name>`
- Location: `src/<path>/<name>.ts`
- Responsibility: <description>

### Interfaces
```typescript
// Interface definitions
```

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
- [Rules Index](rules/) | [Reference](reference.md)
