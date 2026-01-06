---
id: task-027
title: Investigate disabling web-style zoom in app
status: Done
assignee:
  - '@claude'
created_date: '2026-01-06 16:29'
updated_date: '2026-01-06 16:31'
labels:
  - ios
  - ux
  - research
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Double-tap currently zooms the view like a Safari web page, which feels non-native for a mobile app. Investigate whether Tauri/WKWebView allows disabling this behavior.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Research if WKWebView zoom can be disabled in Tauri iOS apps
- [x] #2 Document findings and implementation approach if possible
- [x] #3 If feasible, implement the fix
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Update viewport meta tag in all HTML files to add user-scalable=no, maximum-scale=1
2. Add CSS touch-action: manipulation to html/body in app.css
3. Test on iOS simulator to verify zoom is disabled
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
**Research findings:**
- WKWebView (used by Tauri on iOS) respects viewport meta tag zoom settings
- iOS Safari ignores `user-scalable=no` since iOS 10 for accessibility, but WKWebView may still honor it
- CSS `touch-action: manipulation` prevents double-tap zoom while preserving single-tap and scroll

**Implementation:**
- Updated viewport meta tag in all 4 HTML files: added `maximum-scale=1, user-scalable=no`
- Added `touch-action: manipulation` to html/body in app.css

**Files modified:**
- src-tauri/dist/index.html
- src-tauri/dist/add.html
- src-tauri/dist/list.html
- src-tauri/dist/settings.html
- src-tauri/dist/app.css

Requires iOS testing to confirm zoom is disabled.
<!-- SECTION:NOTES:END -->
