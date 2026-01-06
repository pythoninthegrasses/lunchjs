---
id: task-028
title: Leverage Taskfile fingerprinting in CI to skip unchanged builds
status: To Do
assignee: []
created_date: '2026-01-06 17:32'
updated_date: '2026-01-06 21:00'
labels:
  - ci
  - performance
  - taskfile
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The iOS CI workflow currently rebuilds everything on each run even when source files haven't changed.

Preferred approach:
- Use GitHub Actions built-in `paths` / `paths-ignore` filters for `push` / `pull_request` to avoid starting the workflow when changes are unrelated to iOS build/TestFlight.

Fallback / complementary approach:
- Use Taskfile fingerprinting (`sources`, `generates`, `method: checksum`) plus caching to skip expensive work for triggers where path filters do not apply (`workflow_dispatch`, `workflow_call`) and for fine-grained step skipping.

Note: The `ios:testflight` task already has fingerprinting configured. CI currently caches `.task`, but the cache key includes source file hashes, which defeats reuse across runs. Goal is to configure CI so unchanged builds are skipped and artifacts are reused where possible.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 CI caches .task directory between workflow runs
- [ ] #2 Unchanged source files result in skipped build (task reports 'up to date')
- [ ] #3 Changed source files trigger full rebuild as expected
- [ ] #4 Build artifacts (IPA) are cached and restored when sources unchanged
- [ ] #5 CI logs show 'Task X is up to date' for unchanged tasks

- [ ] #6 For push/PR triggers, workflow/job does not run when only non-build paths change (docs/ etc.)
- [ ] #7 For workflow_dispatch/workflow_call triggers, Taskfile fingerprinting + cache can skip rebuilds when sources unchanged
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add `push` and `pull_request` triggers with `paths` filters covering only iOS/TestFlight-relevant files (Taskfile.yml, taskfiles/**, src-tauri/**, fastlane/**, Gemfile*, package*.json, etc.) and exclude docs-only changes.
2. Ensure release flow still works: if release-please uses `workflow_call`, apply filtering in the caller workflow (only call build workflow when relevant paths changed).
3. For `workflow_dispatch` and `workflow_call`, keep Taskfile fingerprinting as a fallback: cache `.task` with a stable key (not including the same sources being fingerprinted) and consider caching generated IPA output.
4. Optionally add a pre-step `task --status ios:testflight` to short-circuit before expensive setup when up-to-date.
5. Validate behavior with: (a) docs-only commit, (b) Rust-only commit, (c) rerun workflow on same SHA, (d) release-please triggered run.
<!-- SECTION:PLAN:END -->
