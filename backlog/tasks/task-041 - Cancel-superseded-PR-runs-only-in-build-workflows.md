---
id: TASK-041
title: Cancel superseded PR runs only in build workflows
status: To Do
assignee: []
created_date: '2026-10-22T14:56:00Z'
labels:
  - ci
dependencies: []
references:
  - .github/workflows/build-ios-app.yml
  - .github/workflows/build-android-app.yml
priority: low
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Both build workflows use cancel-in-progress: true with a per-ref group. A release run called from release-please.yml or a manual dispatch on main can be cancelled by a newer run mid-upload. timecard-style fix: cancel only pull_request runs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 cancel-in-progress is conditional on github.event_name == pull_request in build-ios-app.yml and build-android-app.yml
- [ ] #2 Release and workflow_dispatch runs are never cancelled by a newer run, confirmed with a dispatch test
- [ ] #3 The concurrency behavior is recorded in docs/ci.md
<!-- AC:END -->
