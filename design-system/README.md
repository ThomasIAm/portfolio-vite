# Design system source

`project/` is the source of the Portfolio design system (published as a Claude Design System artifact).

- `project/tokens.json` is **generated** from `src/index.css` and `tailwind.config.ts`. Never hand-edit it.
- Everything else under `project/` (README, `components/*`, index) is hand-written.

```bash
npm run design-system        # regenerate tokens.json
npm run design-system:check  # fails if tokens.json is stale (use in CI)
```

To publish, ask Claude Code to "publish design-system/project to the Portfolio design system artifact". It sends the changed files to the existing artifact; the script itself makes no network calls.
