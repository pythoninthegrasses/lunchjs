---
id: task-020
title: Add Android tasks to taskfile.yml and taskfiles/tauri.yml
status: Done
assignee:
  - '@claude'
created_date: '2026-01-05 15:39'
updated_date: '2026-01-05 15:44'
labels:
  - android
  - taskfile
  - build
  - mobile
dependencies:
  - task-019
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update taskfile configuration to support Android development workflows, mirroring the iOS task patterns. This enables developers to use simple `task android:*` commands instead of verbose `npx tauri android` commands, following established project conventions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Add android:init task to initialize Android project with Rust targets
- [x] #2 Add android:dev task to run on Android emulator in development mode
- [x] #3 Add android:dev:device task to run on physical Android device
- [x] #4 Add android:build task to build production APK and AAB
- [x] #5 Add android:build:apk task to build APK only for testing
- [x] #6 Add android:build:aab task to build AAB only for Google Play
- [x] #7 Add android:testflight task alias for uploading to Google Play beta (Fastlane)
- [x] #8 Add android:release task for uploading to Google Play production (Fastlane)
- [x] #9 Add top-level android task in taskfile.yml that runs android:dev
- [x] #10 Add clean:android task to clean Android build artifacts
- [x] #11 Add Android variables (ANDROID_ARM64_TARGET, ANDROID_X64_TARGET, etc.) to tauri.yml vars section
- [x] #12 Update taskfile.yml includes section documentation to reference Android tasks
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add Android Rust target variables to taskfiles/tauri.yml vars section
2. Add android:init task to initialize Android project with Rust targets
3. Add android:dev task to run on Android emulator
4. Add android:dev:device task to run on physical Android device
5. Add android:build task to build both APK and AAB
6. Add android:build:apk task to build APK only
7. Add android:build:aab task to build AAB only
8. Add android:testflight task (alias for Fastlane beta lane)
9. Add android:release task (Fastlane production lane)
10. Add clean:android task to clean Android build artifacts
11. Add top-level android task in taskfile.yml that delegates to tauri:android:dev
12. Update info task to document Android targets
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added Android development tasks to taskfiles mirroring iOS task patterns:

**taskfiles/tauri.yml changes:**
- Added Android Rust target variables (ANDROID_ARM64_TARGET, ANDROID_ARMV7_TARGET, ANDROID_X86_TARGET, ANDROID_X64_TARGET)
- Added android:init task to initialize Android project with all 4 Rust targets
- Added android:dev task for emulator development
- Added android:dev:device task for physical device development
- Added android:build task for full APK+AAB builds
- Added android:build:apk and android:build:aab tasks for targeted builds
- Added android:testflight and android:release tasks for Fastlane integration
- Added clean:android task to clean Android build artifacts
- Updated info task to document Android targets and output locations

**taskfile.yml changes:**
- Added top-level android, android:device, android:build, android:build:apk, android:build:aab, android:testflight, and android:release tasks that delegate to tauri: namespace

All tasks follow existing iOS patterns with appropriate dependencies and source/generates declarations.
<!-- SECTION:NOTES:END -->
