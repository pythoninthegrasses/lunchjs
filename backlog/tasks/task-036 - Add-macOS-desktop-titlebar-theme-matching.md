---
id: task-036
title: Add macOS desktop titlebar theme matching
status: In Progress
assignee:
  - '@claude'
created_date: '2026-02-04 21:33'
updated_date: '2026-02-04 21:35'
labels:
  - desktop
  - macos
  - ui
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set the desktop titlebar to match the app's theme color on macOS using Tauri's overlay titlebar style and window.setTheme() JavaScript API. This will make the traffic light buttons (close/minimize/maximize) match the app's dark/light theme.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 macOS titlebar uses overlay style with hidden title
- [ ] #2 Traffic light buttons match current theme (dark/light)
- [ ] #3 Theme changes update titlebar in real-time
- [ ] #4 System theme preference correctly applies to titlebar
- [ ] #5 No regression on iOS or Android builds
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Update tauri.conf.json - Add titleBarStyle: Overlay and hiddenTitle: true
2. Update js/app.js - Add syncTauriTheme() function and call it from theme handlers
3. Update app.css - Add titlebar safe area padding for macOS
4. Test on macOS with task dev
5. Verify iOS builds still work
<!-- SECTION:PLAN:END -->
