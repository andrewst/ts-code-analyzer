# Problem

## Short Description

When a TypeScript npm library grows large, it becomes difficult to understand what changed, what is exposed publicly, and where maintenance risk is increasing.
Maintainers need a fast way to inspect the current state of the codebase without manually reading the entire project.

## Target Audience

Developers who maintain large TypeScript npm libraries and need a quick, reliable overview of code health and public API impact.

## Value Proposition

Helps maintainers understand and control large TypeScript libraries faster, with less manual inspection.

## Key Characteristics

- Surface accurate information about the library's public API
- Highlight meaningful changes in the codebase
- Define maintenance risk as the relationship between the size of the public API and the total size of the library's codebase
- Help identify maintenance risks early using that ratio as a signal
- Support quick codebase review for large libraries
- Focus on practical, maintainable insights rather than raw low-level data

## Primary Questions

- What is exposed by the public API?
- How large is the public API relative to the total codebase?
- Where is the codebase becoming harder to maintain?
- What parts of the library deserve attention first?

## Success Criteria

- A maintainer can understand the current state of a large library faster than by manual inspection alone
- The tool provides useful signals for API changes and maintenance risk
- The output is clear enough to support everyday library maintenance decisions
