---
id: task-007
title: Fix iOS app icon (replace default Tauri icon)
status: Done
assignee: []
created_date: '2025-12-12 18:50'
updated_date: '2025-12-17 16:43'
labels:
  - ios
  - assets
dependencies: []
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The iOS app shows the default Tauri swirl icon instead of the custom "LUNCH" icon. The correct icons exist in `src-tauri/icons/ios/` but the Xcode asset catalog at `src-tauri/gen/apple/Assets.xcassets/AppIcon.appiconset/` has the default icons.

**Solution:** Run `npx tauri icon icons/icon.png` to regenerate and copy icons to all platform locations including iOS.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 iOS app displays custom LUNCH icon
- [x] #2 Icon appears correctly in TestFlight builds
<!-- AC:END -->
