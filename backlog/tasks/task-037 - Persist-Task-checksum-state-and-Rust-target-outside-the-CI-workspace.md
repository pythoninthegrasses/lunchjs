---
id: TASK-037
title: Persist Task checksum state and Rust target outside the CI workspace
status: To Do
assignee: []
created_date: '2026-10-22T14:56:00Z'
labels:
  - ci
  - ios
  - android
dependencies: []
references:
  - docs/ci.md
  - docs/fastlane.md
  - .github/actions/setup-tauri-build/action.yml
priority: medium
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
timecard sets TASK_TEMP_DIR and CARGO_TARGET_DIR under a cache dir outside the workspace and checks out with clean: false, so fingerprints and build caches survive between runs. Here the location of the Task checksum state on the runner is unknown, so whether a CI run rebuilds or reports 'up to date' cannot be predicted from the diff (iOS run 39667041225 was skipped while 39650542433 built). See docs/fastlane.md Gotchas and docs/ci.md.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Task checksum state lives at a known path outside the workspace and the path is documented in docs/ci.md
- [ ] #2 actions/checkout uses clean: false in both build workflows and the Rust target dir persists between runs
- [ ] #3 A CI run with unchanged task sources is skipped and a run with changed sources builds, both confirmed from run logs
- [ ] #4 The Cache Task checksums actions/cache step is removed or its purpose is documented
<!-- AC:END -->
