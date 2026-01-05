---
id: task-022
title: Investigate and fix Android APK crashes on database operations
status: To Do
assignee: []
created_date: '2026-01-05 16:07'
updated_date: '2026-01-05 16:09'
labels:
  - bug
  - android
  - database
  - debugging
  - critical
dependencies:
  - task-021
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Debug and resolve crashes occurring in the Android APK when performing core database operations (Roll Lunch, view List, add restaurant). The app crashes suggest database connection or initialization issues on Android. Setup CrabNebula devtools for proper debugging capabilities before investigation.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Setup CrabNebula devtools following context7 crabnebula-dev/devtools
- [ ] #2 Enable devtools in Android debug build configuration
- [ ] #3 Reproduce crash when tapping 'Roll Lunch' button and capture logs
- [ ] #4 Reproduce crash when selecting 'List' navigation and capture logs
- [ ] #5 Reproduce crash when adding a restaurant and capture logs
- [ ] #6 Identify root cause of database connection failure on Android
- [ ] #7 Verify database initialization path works on Android platform
- [ ] #8 Verify SQLite database file is created in correct Android app data directory
- [ ] #9 Fix database connection/initialization issues causing crashes
- [ ] #10 Test 'Roll Lunch' functionality works without crashing on Android
- [ ] #11 Test 'List' navigation works without crashing on Android
- [ ] #12 Test adding restaurants works without crashing on Android
- [ ] #13 Verify database persists data correctly across app restarts on Android
- [ ] #14 Document Android-specific database configuration changes in implementation notes
<!-- AC:END -->
