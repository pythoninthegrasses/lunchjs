---
id: task-028
title: Leverage Taskfile fingerprinting in CI to skip unchanged builds
status: To Do
assignee: []
created_date: '2026-01-06 17:32'
updated_date: '2026-01-06 17:32'
labels:
  - ci
  - performance
  - taskfile
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The iOS CI workflow currently rebuilds everything on each run even when source files haven't changed. Taskfile supports fingerprinting via `sources`, `generates`, and `method: checksum` to skip up-to-date tasks.

The `ios:testflight` task already has fingerprinting configured, but CI doesn't properly persist the `.task` checksum directory between runs, causing unnecessary rebuilds.

Goal: Configure CI to properly cache and restore Task's checksum state so that unchanged builds are skipped, significantly reducing CI time and costs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 CI caches .task directory between workflow runs
- [ ] #2 Unchanged source files result in skipped build (task reports 'up to date')
- [ ] #3 Changed source files trigger full rebuild as expected
- [ ] #4 Build artifacts (IPA) are cached and restored when sources unchanged
- [ ] #5 CI logs show 'Task X is up to date' for unchanged tasks
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Verify .task cache is properly restored (current cache key may be too specific)
2. Cache build artifacts (IPA) alongside checksums so skipped builds have artifacts
3. Consider using `task --status` to check if rebuild needed before running
4. Add status checks using CHECKSUM variable for remote artifacts
5. Test with consecutive runs - first should build, second should skip
<!-- SECTION:PLAN:END -->
