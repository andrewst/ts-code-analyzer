# Skills

## Built-in

| Skill                      | Use                                 |
| -------------------------- | ----------------------------------- |
| `/review`                  | After each component implementation |
| `/review <file> --comment` | Inline feedback on specific files   |

## Custom (configure when ready)

| Skill             | Command                                       | When                 |
| ----------------- | --------------------------------------------- | -------------------- |
| `type-check`      | `tsc --noEmit`                                | After every change   |
| `build-verify`    | `pnpm run build && node dist/index.js --help` | Before commit        |
| `test-all`        | (test runner command)                         | After implementation |
| `check-dead-code` | `pnpm run start -- --src ./src`               | Self-analysis        |
