# Backlog

**Project**: TypeScript Code Analyzer
**Date**: 2026-04-16
**Status**: drafting
**Source**: `docs/02_Discovery/discovery.md`

## 1. Feature Groups Overview

Future features and improvements beyond v0.1.0:

- Deeper maintenance-risk metrics
- Richer output formats
- Stability and library API

## 2. User Stories

### Feature Group: Deeper maintenance-risk metrics

#### User Story: See size-relative public surface metrics

As a maintainer, I want to see how much of my codebase is exposed relative to its total size, so that I can identify "leaky" abstractions or overly large public surfaces.

- **Acceptance Criteria**:
  - [ ] Analysis computes ratio of public exports to total symbols.
  - [ ] Analysis identifies modules with disproportionately high exposure.
  - [ ] Output remains observational.

### Feature Group: Richer output formats

#### User Story: Export analysis results to JSON

As a developer, I want to export analysis results to a machine-readable JSON file, so that I can integrate it into other tools or custom dashboards.

- **Acceptance Criteria**:
  - [ ] CLI supports a `--format json` flag.
  - [ ] JSON schema is documented and stable.
  - [ ] All observations (Structure, Public API, etc.) are included in the JSON output.

## 3. Dependencies

- `Export analysis results to JSON` depends on core analyzers from v0.1.0.

## 4. Open Questions

None at this stage.

## 5. Out of Scope

- Real-time monitoring or IDE plugins (for now).

## Done Criteria

PM's work is complete when ALL of the following are satisfied:

- [x] Stories file exists and follows this template structure
- [ ] Every feature group from discovery has corresponding user stories
- [ ] Each story follows format: "As a [user], I want to [action], so that [outcome]"
- [ ] Each story has at least 3 measurable, verifiable acceptance criteria
- [ ] Dependencies between stories are explicitly listed
- [ ] Out of scope items are explicitly listed
- [ ] All blocking open questions are answered (no questions with `Status: blocking` remain unanswered)
- [ ] Open questions file is created or synchronized with correct statuses
