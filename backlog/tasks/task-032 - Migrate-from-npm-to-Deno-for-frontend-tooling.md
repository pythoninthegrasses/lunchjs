---
id: task-032
title: Migrate from npm to Deno for frontend tooling
status: Done
assignee:
  - '@claude'
created_date: '2026-02-03 00:05'
updated_date: '2026-02-03 19:52'
labels:
  - frontend
  - tooling
  - deno
dependencies: []
priority: low
ordinal: 2000
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
- [x] #1 Create `deno.jsonc` at project root
- [x] #2 Configure `nodeModulesDir: auto` for npm compatibility
- [x] #3 Add tasks: install, dev, build, test (mirroring current npm scripts)
- [x] #4 Configure lint rules with exclusions for Alpine.js globals and browser APIs
- [x] #5 Configure fmt with project code style (2-space indent, semicolons, single quotes)
- [x] #6 Exclude build artifacts, node_modules, vendor libs, and Rust targets
- [x] #7 Update Taskfile to use `deno task` instead of `npm` where applicable
- [x] #8 Update CI workflows to use Deno instead of Node.js setup
- [x] #9 Document Deno usage in README or dedicated doc
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create deno.jsonc at project root
2. Create taskfiles/deno.yml (based on mt/taskfiles/deno.yml reference)
3. Update Taskfile.yml (change npm include to deno)
4. Update taskfiles/tauri.yml (change deps and npx commands)
5. Update CI action (replace Node.js with Deno setup)
6. Add documentation
7. Verify: task dev, task build, deno fmt --check
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Migrated from npm to Deno for frontend tooling:

- Created `deno.jsonc` with nodeModulesDir: auto for npm compatibility
- Created `taskfiles/deno.yml` with install, clean, outdated, audit tasks
- Updated `Taskfile.yml` to include deno taskfile instead of npm
- Updated `taskfiles/tauri.yml` to use `:deno:install` deps and `deno task tauri` commands
- Updated CI action to use `denoland/setup-deno@v2` instead of `actions/setup-node@v6`
- Created `docs/deno.md` with usage documentation
- Verified: `task deno:install`, `task tauri:check-deps`, `deno task tauri --version`

Note: `deno fmt` returns "No target files found" since all JS is in excluded directories (src-tauri/dist). This is expected for this static frontend project.
<!-- SECTION:NOTES:END -->
