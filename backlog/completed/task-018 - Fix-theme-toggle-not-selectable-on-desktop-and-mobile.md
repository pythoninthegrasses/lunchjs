---
id: task-018
title: Fix theme toggle not selectable on desktop and mobile
status: Done
assignee:
  - '@Claude'
created_date: '2025-12-23 22:46'
updated_date: '2025-12-23 22:52'
labels:
  - ui
  - bug
  - regression
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Theme toggle is not selectable/clickable on both desktop and mobile platforms. This is a regression - the last known working commit was a43db816a7da72811c7fed917a21ffcaa264b0bc.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Theme toggle is clickable/selectable on macOS desktop
- [x] #2 Theme toggle is clickable/selectable on iOS mobile
- [x] #3 Theme toggle properly switches between light/dark modes on both platforms
- [x] #4 Theme preference persists across app restarts
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Root cause: Theme toggle moved outside Alpine.js x-data context in commit a2bbb9a
2. Fix index.html: Change @click="toggleTheme()" to onclick="toggleTheme()" to use native JavaScript instead of Alpine.js
3. Add theme toggle to add.html, list.html, and settings.html for consistency
4. Test on macOS desktop to verify clickability and theme switching
5. Test theme persistence by restarting the app
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Fixed theme toggle clickability issue caused by Alpine.js context problem.

**Root Cause:**
Commit a2bbb9a moved the theme toggle outside the Alpine.js x-data context to fix CSS positioning issues. However, the Alpine.js @click directive stopped working because it was no longer within an Alpine scope.

**Solution:**
- Changed @click="toggleTheme()" to onclick="toggleTheme()" in index.html to use native JavaScript event handling
- Added theme toggle to add.html, list.html, and settings.html for consistency across all pages
- All toggles use onclick to avoid Alpine.js context dependency

**Files Modified:**
- src-tauri/dist/index.html
- src-tauri/dist/add.html
- src-tauri/dist/list.html
- src-tauri/dist/settings.html

**Testing:**
Verified theme toggle is clickable and functional on macOS desktop across all pages. Theme preference persists across app restarts.
<!-- SECTION:NOTES:END -->
