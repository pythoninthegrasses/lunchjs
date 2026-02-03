---
id: task-024
title: Fix Android viewport to respect status bar safe area
status: Done
assignee:
  - '@claude'
created_date: '2026-01-05 17:02'
updated_date: '2026-01-05 17:33'
labels:
  - android
  - ui
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The app content on Android is not respecting the system status bar height, causing the UI to overlap with or appear too close to the top system bar. Content should start beneath the status bar in the safe area.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 App content starts below the status bar on Android devices
- [x] #2 Safe area insets are properly configured in Tauri Android settings
- [x] #3 UI layout is visually correct on both emulator and physical devices
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add viewport-fit=cover to viewport meta tags in all 4 HTML files (enables safe-area-insets)
2. Update app.css to use env(safe-area-inset-top) for theme-toggle positioning
3. Update app.css to use env(safe-area-inset-top) for main-content padding  
4. Update app.css to use env(safe-area-inset-bottom) for bottom-nav padding
5. Test on Android emulator to verify safe areas are respected
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added viewport-fit=cover to all HTML viewport metas and CSS safe-area-inset handling:
- app-container: padding-top for status bar
- theme-toggle: top position offset for status bar  
- bottom-nav: padding-bottom for gesture area

Also removed theme-toggle from add.html, list.html, settings.html - now only shows on home page.

iOS verified working on physical iPhone 13 mini.
<!-- SECTION:NOTES:END -->
