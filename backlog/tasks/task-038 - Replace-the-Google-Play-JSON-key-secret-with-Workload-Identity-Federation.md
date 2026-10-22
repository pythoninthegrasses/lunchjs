---
id: TASK-038
title: Replace the Google Play JSON key secret with Workload Identity Federation
status: To Do
assignee: []
created_date: '2026-10-22T14:56:00Z'
labels:
  - ci
  - android
dependencies: []
references:
  - docs/android.md
  - .github/workflows/build-android-app.yml
priority: low
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
timecard authenticates Play uploads with google-github-actions/auth and Workload Identity Federation (no long-lived key). lunchjs uses the GOOGLE_PLAY_JSON_KEY secret, which had to be reset by hand on 2026-10-21. Removes a secret to rotate and a service account key file on disk.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 build-android-app.yml authenticates with WIF (id-token: write) and a Play upload to the alpha track succeeds in CI
- [ ] #2 The GOOGLE_PLAY_JSON_KEY secret is deleted after the successful upload
- [ ] #3 docs/android.md and docs/ci.md describe the WIF setup and drop the secret reset instructions
- [ ] #4 The local flow with SUPPLY_JSON_KEY pointing at a key file still works and is documented
<!-- AC:END -->
