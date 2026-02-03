---
id: task-031
title: Consolidate shared CI workflow steps between iOS and Android builds
status: To Do
assignee:
  - '@claude'
created_date: '2026-02-03 00:00'
updated_date: '2026-02-03 19:38'
labels:
  - ci
  - github-actions
  - refactor
dependencies: []
priority: low
ordinal: 3000
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
- [x] #1 Identify shared steps between iOS and Android workflows
- [x] #2 Choose consolidation approach: reusable workflow vs composite action
- [x] #3 Extract common setup into shared workflow/action
- [x] #4 iOS workflow uses shared setup
- [x] #5 Android workflow uses shared setup
- [ ] #6 Both workflows still function correctly after refactor
- [x] #7 Document the shared workflow/action usage
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create composite action `.github/actions/setup-tauri-build/action.yml`
2. Update iOS workflow to use composite action
3. Update Android workflow to use composite action
4. Update release-please.yml to use Blacksmith runner
5. Test via PR to verify both workflows function correctly
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Created composite action `.github/actions/setup-tauri-build/action.yml` with 9 shared setup steps
- Updated iOS workflow to use composite action (reduced from 106 to 66 lines)
- Updated Android workflow to use composite action (reduced from 109 to 70 lines)
- Updated release-please.yml to use Blacksmith runner (`blacksmith-4vcpu-ubuntu-2404`)
- Added documentation to `docs/architecture.md` for composite action and Blacksmith
- All YAML files validated

Remaining: AC #6 requires PR/workflow trigger to verify both workflows function correctly
<!-- SECTION:NOTES:END -->
