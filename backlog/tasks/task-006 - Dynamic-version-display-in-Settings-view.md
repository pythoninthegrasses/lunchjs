---
id: task-006
title: Dynamic version display in Settings view
status: Done
assignee: []
created_date: '2025-12-12 18:50'
updated_date: '2025-12-15 17:00'
labels:
  - ui
  - bug
dependencies: []
priority: medium
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Settings view shows hardcoded "Version 1.0.0" but the actual version in tauri.conf.json is "0.9.0". The version should be dynamically fetched from Tauri at runtime.

**File:** `src-tauri/dist/settings.html` (line 44)

Use `window.__TAURI__.app.getVersion()` to fetch the version dynamically.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Settings view displays version from tauri.conf.json
- [ ] #2 Version updates automatically when tauri.conf.json version changes
<!-- AC:END -->
