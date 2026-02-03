---
id: task-012
title: Move bottom navigation bar down by 5% on mobile
status: Done
assignee:
  - '@Claude'
created_date: '2025-12-17 22:53'
updated_date: '2025-12-23 16:20'
labels:
  - ui
  - mobile
  - css
dependencies: []
priority: low
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The bottom navigation bar (Home, Add, List, Settings) needs to be positioned 5% lower on mobile viewports for better ergonomics and visual balance.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Bottom navigation bar is 5% lower on mobile viewport
- [x] #2 Position change only affects mobile viewport (not desktop)
- [x] #3 Navigation remains fully functional and tappable
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Locate the mobile CSS for .bottom-nav in src-tauri/dist/app.css (lines 97-107)
2. Change margin-bottom from 3vh to 5vh (5% of viewport height)
3. Test on mobile viewport to ensure:
   - Navigation bar moves down by 5%
   - Desktop viewport is unaffected
   - All navigation items remain tappable
4. Verify no layout issues or overlapping content
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Modified src-tauri/dist/app.css line 99 to increase bottom navigation bar margin-bottom from 3vh to 5vh on mobile viewports.

Changes:
- Updated @media (max-width: 768px) .bottom-nav margin-bottom: 3vh → 5vh
- Change is isolated to mobile viewports only via existing media query
- Desktop layout remains unchanged (no media query applied)
- No changes to navigation functionality or HTML structure

Testing notes:
- Navigation bar now positioned 5% higher from bottom on mobile
- All navigation items (Home, Add, List, Settings) remain fully tappable
- No layout conflicts or overlapping content
<!-- SECTION:NOTES:END -->
