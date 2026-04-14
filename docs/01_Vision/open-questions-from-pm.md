# Open Questions from PM

**Date**: 2026-04-14  
**Status**: ⏳ Awaiting user input

---

## Active Questions

### Q1: Package name for npm publishing

**Context**: Stories CLI-01 and all user-facing documentation reference the tool by name. The discovery document uses `ts-analyzer` as the CLI command, but this may already be taken on npm.

- [ ] **Option A**: `ts-analyzer` — short, memorable (if available on npm)
- [ ] **Option B**: `ts-code-analyzer` — more descriptive, less likely to conflict
- [ ] **Option C**: `tsca` — acronym, shortest option
- [ ] **Option D**: Other (specify below)

---

### Q2: Default cyclomatic complexity threshold (CHECK-03)

**Context**: Story CHECK-03 flags functions exceeding a complexity threshold. The story mentions `10` as a possible default, but this affects the out-of-the-box experience.

- [ ] **Option A**: `10` — industry standard (e.g., Code Climate default)
- [ ] **Option B**: `15` — more lenient, fewer false positives for large existing codebases
- [ ] **Option C**: `20` — very lenient, only flags truly problematic functions
- [ ] **Option D**: No default — tool reports all scores but never exits non-zero unless user sets `--max-complexity`

---

### Q3: Diff working tree safety (DIFF-01)

**Context**: Story DIFF-01 requires checking out git refs to analyze both versions. If the user has uncommitted changes, this could lose work.

- [ ] **Option A**: Require clean working tree — refuse to run unless tree is clean (user must commit or stash manually)
- [ ] **Option B**: Auto-stash — automatically `git stash` before checkout, `git stash pop` after, with clear console messages
- [ ] **Option C**: Auto-stash with `--force` — default is Option A, but `--force` enables Option B behavior
- [ ] **Option D**: Use git worktrees — create temporary worktrees for each ref, never touch the working directory

---

### Q4: "Undocumented" JSDoc definition (CHECK-05)

**Context**: Story CHECK-05 flags exports without JSDoc. The exact definition of "documented" affects false positive rates.

- [ ] **Option A**: Any non-empty JSDoc counts (`/** anything */` → documented)
- [ ] **Option B**: JSDoc must be at least 10 characters of description text (filters out `/** todo */` noise)
- [ ] **Option C**: JSDoc must include at least one of: `@param`, `@returns`, `@description` tag
- [ ] **Option D**: Any JSDoc including `/** */` counts (empty JSDoc = intentionally marked for documentation)

---

### Q5: Config file format and discovery order (CI-03)

**Context**: Story CI-03 mentions multiple possible config file names. The exact format and priority order affects both implementation and user documentation.

- [ ] **Option A**: `.ts-analyzerrc.json` only — single format, simplest implementation
- [ ] **Option B**: `.ts-analyzerrc` (JSON) + `.ts-analyzerrc.json` — standard dotfile convention
- [ ] **Option C**: `.ts-analyzerrc.json` + `ts-analyzer` key in `package.json` — convenience for projects that want config alongside other tool settings
- [ ] **Option D**: All of B + C + YAML variants (`.ts-analyzerrc.yaml`, `.ts-analyzerrc.yml`)

---

## Answered Questions

_(none)_
