---
id: task-031
title: Consolidate shared CI workflow steps between iOS and Android builds
status: In Progress
assignee: []
created_date: '2026-02-03 00:00'
updated_date: '2026-02-03 00:01'
labels:
  - ci
  - github-actions
  - refactor
dependencies: []
priority: low
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Both `build-ios-app.yml` and `build-android-app.yml` share significant common setup steps:

- Checkout repository
- Ruby setup with bundler-cache
- Node.js setup with npm cache
- npm ci
- Rust toolchain setup (only targets differ)
- Rust cache configuration
- Task checksums cache
- Task installation

This duplication increases maintenance burden and risks drift between workflows. Consider consolidating via GitHub's reusable workflows or composite actions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Identify shared steps between iOS and Android workflows
- [ ] #2 Choose consolidation approach: reusable workflow vs composite action
- [ ] #3 Extract common setup into shared workflow/action
- [ ] #4 iOS workflow uses shared setup
- [ ] #5 Android workflow uses shared setup
- [ ] #6 Both workflows still function correctly after refactor
- [ ] #7 Document the shared workflow/action usage
<!-- AC:END -->
