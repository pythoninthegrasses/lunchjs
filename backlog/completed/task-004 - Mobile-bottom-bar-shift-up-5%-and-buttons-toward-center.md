---
id: task-004
title: 'Mobile bottom bar: shift up 5% and buttons toward center'
status: Done
assignee: []
created_date: '2025-12-12 18:50'
updated_date: '2025-12-15 16:37'
labels:
  - ui
  - mobile
  - css
dependencies: []
priority: medium
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
On mobile viewport, adjust the bottom navigation bar positioning:
- Shift the bar up by 5%
- Move individual buttons 5% toward center (add padding)

**File:** `src-tauri/dist/app.css`

Add mobile media query after `.bottom-nav` styles (~line 95)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Bottom nav bar shifted up 5% on mobile viewports
- [x] #2 Nav buttons have increased horizontal padding on mobile
<!-- AC:END -->
