---
id: task-035
title: Optimize Android CI build time
status: In Progress
assignee:
  - '@claude'
created_date: '2026-02-04 20:47'
updated_date: '2026-02-04 20:53'
labels:
  - ci
  - android
  - performance
dependencies: []
priority: medium
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Android CI builds take ~8 minutes compared to iOS's ~2 minutes. Two optimizations can significantly reduce this:

1. **Cache Rust target directories**: Add Android Rust target directories to the GitHub Actions cache. Currently only `src-tauri/gen/android/app/build` is cached, but the Rust compilation artifacts in `src-tauri/target/*-linux-android*` are rebuilt from scratch each run.

2. **Reduce target architectures**: Build only arm64 and armv7, dropping i686 and x86_64. Most modern Android devices are arm64, and armv7 covers older devices. The x86/x64 targets are primarily for emulators and rare Chrome OS devices.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Android Rust target directories are included in GHA cache
- [x] #2 Android builds target only aarch64-linux-android and armv7-linux-androideabi
- [x] #3 i686-linux-android and x86_64-linux-android targets are removed from CI builds
- [ ] #4 Android CI build time is reduced (target: under 5 minutes)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Modify setup-tauri-build action to add Android Rust target directories to cache path
2. Reduce Android Rust targets from 4 to 2 (arm64 + armv7 only)
3. Update cache key to include only the relevant target directories
4. Test by examining the resulting configuration
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Modified `.github/actions/setup-tauri-build/action.yml`:

- Added Rust target directories to Android cache path (`src-tauri/target/aarch64-linux-android`, `src-tauri/target/armv7-linux-androideabi`)
- Reduced Android targets from 4 to 2: removed `i686-linux-android` and `x86_64-linux-android`

AC #4 (build time reduction) must be verified after CI runs.
<!-- SECTION:NOTES:END -->
