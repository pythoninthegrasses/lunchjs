---
id: task-035
title: Optimize Android CI build time
status: To Do
assignee: []
created_date: '2026-02-04 20:47'
labels:
  - ci
  - android
  - performance
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Android CI builds take ~8 minutes compared to iOS's ~2 minutes. Two optimizations can significantly reduce this:

1. **Cache Rust target directories**: Add Android Rust target directories to the GitHub Actions cache. Currently only `src-tauri/gen/android/app/build` is cached, but the Rust compilation artifacts in `src-tauri/target/*-linux-android*` are rebuilt from scratch each run.

2. **Reduce target architectures**: Build only arm64 and armv7, dropping i686 and x86_64. Most modern Android devices are arm64, and armv7 covers older devices. The x86/x64 targets are primarily for emulators and rare Chrome OS devices.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Android Rust target directories are included in GHA cache
- [ ] #2 Android builds target only aarch64-linux-android and armv7-linux-androideabi
- [ ] #3 i686-linux-android and x86_64-linux-android targets are removed from CI builds
- [ ] #4 Android CI build time is reduced (target: under 5 minutes)
<!-- AC:END -->
