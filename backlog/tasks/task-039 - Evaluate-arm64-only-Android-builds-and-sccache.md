---
id: TASK-039
title: Evaluate arm64-only Android builds and sccache
status: To Do
assignee: []
created_date: '2026-10-22T14:56:00Z'
labels:
  - ci
  - android
dependencies: []
references:
  - fastlane/Fastfile
  - .github/actions/setup-tauri-build/action.yml
priority: low
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
timecard builds Android with --target aarch64 only and caches compiles with sccache on a persistent local dir. lunchjs compiles four Rust targets (aarch64, armv7, i686, x86_64) on every Android build; the CI run on 2026-10-21 took about 3.5 minutes. Apple Silicon emulators run arm64, so the x86 targets may be unnecessary. Needs an owner decision on 32-bit and x86 devices.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A decision on whether armv7, i686 and x86_64 are needed is recorded in the task notes
- [ ] #2 If arm64-only: the Android Fastfile lanes, the setup action targets and docs/android.md are updated and a signed AAB still uploads
- [ ] #3 sccache is configured with a persistent local cache dir and the before and after CI durations are recorded
<!-- AC:END -->
