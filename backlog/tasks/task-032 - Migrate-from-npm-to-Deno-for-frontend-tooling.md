---
id: task-032
title: Migrate from npm to Deno for frontend tooling
status: To Do
assignee: []
created_date: '2026-02-03 00:05'
labels:
  - frontend
  - tooling
  - deno
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace npm with Deno for frontend dependency management and development tasks. Reference implementation: `~/git/mt/deno.jsonc`.

Benefits:
- Faster dependency installation
- Built-in linting and formatting (replace eslint/prettier if used)
- TypeScript support out of the box
- Unified task runner via `deno task`

LunchJS frontend is in `src-tauri/dist/` with Alpine.js. The Deno config should use `nodeModulesDir: "auto"` for Vite/npm compatibility during transition.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Create `deno.jsonc` at project root
- [ ] #2 Configure `nodeModulesDir: auto` for npm compatibility
- [ ] #3 Add tasks: install, dev, build, test (mirroring current npm scripts)
- [ ] #4 Configure lint rules with exclusions for Alpine.js globals and browser APIs
- [ ] #5 Configure fmt with project code style (2-space indent, semicolons, single quotes)
- [ ] #6 Exclude build artifacts, node_modules, vendor libs, and Rust targets
- [ ] #7 Update Taskfile to use `deno task` instead of `npm` where applicable
- [ ] #8 Update CI workflows to use Deno instead of Node.js setup
- [ ] #9 Document Deno usage in README or dedicated doc
<!-- AC:END -->
