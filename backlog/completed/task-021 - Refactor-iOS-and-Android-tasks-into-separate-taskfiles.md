---
id: task-021
title: Refactor iOS and Android tasks into separate taskfiles
status: Done
assignee:
  - '@claude'
created_date: '2026-01-05 15:47'
updated_date: '2026-01-05 16:14'
labels:
  - refactor
  - taskfile
  - ios
  - android
  - organization
dependencies:
  - task-020
priority: medium
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Refactor taskfile organization to improve maintainability by separating platform-specific tasks into dedicated taskfiles (ios.yml, android.yml) while keeping shared Tauri commands in tauri.yml. This follows Taskfile best practices for organizing complex multi-platform projects and makes it easier to maintain platform-specific logic independently.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Create taskfiles/ios.yml with all iOS-specific tasks (ios:init, ios:dev, ios:dev:device, ios:build, ios:build:sim, ios:build:appstore, ios:certificates, ios:testflight, ios:release)
- [x] #2 Create taskfiles/android.yml with all Android-specific tasks (android:init, android:dev, android:dev:device, android:build, android:build:apk, android:build:aab, android:testflight, android:release)
- [x] #3 Keep shared tasks in taskfiles/tauri.yml (build, dev, icons, clean, test-app, doctor)
- [x] #4 Configure ios.yml to include tauri.yml for accessing shared commands
- [x] #5 Configure android.yml to include tauri.yml for accessing shared commands
- [x] #6 Update taskfile.yml includes section to reference ios.yml and android.yml
- [x] #7 Move platform-specific variables (IOS_*, ANDROID_*) to respective platform files
- [x] #8 Keep shared variables (APP_NAME, APP_VERSION, BUNDLE_ID, TAURI_DIR, MACOS_*) in tauri.yml
- [x] #9 Verify all iOS tasks work after refactor with task ios:dev test
- [x] #10 Verify all Android tasks work after refactor with task android:dev test
- [x] #11 Update taskfiles/tauri.yml info task to reflect new organization
- [x] #12 Add clean:ios task to ios.yml if not already present
- [x] #13 Add clean:android task to android.yml if not already present
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create taskfiles/ios.yml with iOS-specific tasks and variables
2. Create taskfiles/android.yml with Android-specific tasks and variables  
3. Update taskfiles/tauri.yml - remove iOS/Android tasks, keep shared tasks
4. Update taskfile.yml includes section to reference ios.yml and android.yml
5. Configure ios.yml and android.yml to include tauri.yml for shared vars
6. Update tauri.yml info task to reflect new organization
7. Verify iOS tasks work with task --dry-run
8. Verify Android tasks work with task --dry-run
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Refactored taskfile organization by splitting iOS and Android tasks into dedicated files:

**Files created:**
- `taskfiles/ios.yml` - All iOS-specific tasks (init, boot, dev, dev:device, build, build:sim, build:appstore, certificates, testflight, release, clean) and variables (IOS_*_TARGET, IOS_SIM_DEVICE)
- `taskfiles/android.yml` - All Android-specific tasks (init, dev, dev:device, build, build:apk, build:aab, testflight, release, clean), variables (ANDROID_*_TARGET, ANDROID_EMULATOR), and env (ANDROID_HOME, ANDROID_NDK_HOME)

**Files updated:**
- `taskfiles/tauri.yml` - Kept only shared tasks (build, dev, icons, clean, test, doctor) and variables (APP_NAME, APP_VERSION, BUNDLE_ID, TAURI_DIR, MACOS_*). Updated info task to reflect new organization.
- `taskfile.yml` - Added includes for ios.yml and android.yml. Simplified by removing redundant forwarding tasks (direct access via ios:* and android:* namespaces). Clean task now calls all platform clean tasks.

**Design decisions:**
- Each platform file defines its own TAURI_DIR to avoid nested include variable resolution issues
- Removed forwarding tasks from main taskfile.yml since included tasks are directly accessible (e.g., `task ios:build` works directly)
- Added `certs` as convenience alias for `task ios:certificates`
<!-- SECTION:NOTES:END -->
