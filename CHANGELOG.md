# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-16

### Added

- Full CLI pipeline implementation for TypeScript codebase analysis.
- End-to-end orchestration: project loading, compiler snapshot extraction, analysis, and report presentation.
- Workflow modes: `structure`, `public-api`, and `full` (including change-impact and hotspots).
- TypeScript Compiler API integration for deep static analysis.
- Observational report formatting for CLI output.
- Support for `tsconfig.json` discovery and project resolution.
- Support for change impact analysis via `--changes` file.
- Heuristic-based maintenance hotspot identification.

### Changed

- Promoted to `0.1.0` to mark the completion of the first development iteration.

## [0.0.1] - 2026-04-15

### Added

- Initial project foundation with TypeScript 6.0+ and ESM.
- AI-driven development infrastructure (`agents/` directory and `AGENTS.md`).
- Multi-role workflow (PD, PM, ARC, PLAN, QA, CODER, REV, DOC).
- Core documentation including Vision, Discovery, User Stories, and Architecture.
- Initial task breakdown for the first iteration.
- Testing setup using Vitest with coverage thresholds.
- Linting and formatting configuration with oxlint and Prettier.
- GitHub Actions CI workflow for automated testing and type-checking.
