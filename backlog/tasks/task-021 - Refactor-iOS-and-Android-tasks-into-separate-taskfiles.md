---
id: task-021
title: Refactor iOS and Android tasks into separate taskfiles
status: To Do
assignee: []
created_date: '2026-01-05 15:47'
labels:
  - refactor
  - taskfile
  - ios
  - android
  - organization
dependencies:
  - task-020
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Refactor taskfile organization to improve maintainability by separating platform-specific tasks into dedicated taskfiles (ios.yml, android.yml) while keeping shared Tauri commands in tauri.yml. This follows Taskfile best practices for organizing complex multi-platform projects and makes it easier to maintain platform-specific logic independently.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Create taskfiles/ios.yml with all iOS-specific tasks (ios:init, ios:dev, ios:dev:device, ios:build, ios:build:sim, ios:build:appstore, ios:certificates, ios:testflight, ios:release)
- [ ] #2 Create taskfiles/android.yml with all Android-specific tasks (android:init, android:dev, android:dev:device, android:build, android:build:apk, android:build:aab, android:testflight, android:release)
- [ ] #3 Keep shared tasks in taskfiles/tauri.yml (build, dev, icons, clean, test-app, doctor)
- [ ] #4 Configure ios.yml to include tauri.yml for accessing shared commands
- [ ] #5 Configure android.yml to include tauri.yml for accessing shared commands
- [ ] #6 Update taskfile.yml includes section to reference ios.yml and android.yml
- [ ] #7 Move platform-specific variables (IOS_*, ANDROID_*) to respective platform files
- [ ] #8 Keep shared variables (APP_NAME, APP_VERSION, BUNDLE_ID, TAURI_DIR, MACOS_*) in tauri.yml
- [ ] #9 Verify all iOS tasks work after refactor with task ios:dev test
- [ ] #10 Verify all Android tasks work after refactor with task android:dev test
- [ ] #11 Update taskfiles/tauri.yml info task to reflect new organization
- [ ] #12 Add clean:ios task to ios.yml if not already present
- [ ] #13 Add clean:android task to android.yml if not already present
<!-- AC:END -->
