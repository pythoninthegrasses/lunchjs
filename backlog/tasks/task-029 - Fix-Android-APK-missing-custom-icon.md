---
id: task-029
title: Fix Android APK missing custom icon
status: To Do
assignee: []
created_date: '2026-01-06 23:48'
updated_date: '2026-02-03 00:01'
labels:
  - android
  - bug
dependencies: []
priority: medium
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
When building and installing the APK via `task android:run:device`, the app displays the default Tauri icon instead of the custom Lunch app icon. The icon generation may not be running or the Android project may not be picking up the generated icons.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 App displays custom Lunch icon on Android home screen after install
- [ ] #2 App displays custom icon in Android app drawer
- [ ] #3 App displays custom icon in Android recent apps view
<!-- AC:END -->
