---
id: task-030
title: Create Android CI/CD workflow mirroring iOS build workflow
status: Done
assignee:
  - '@claude'
created_date: '2026-02-02 23:31'
updated_date: '2026-02-03 17:08'
labels:
  - ci
  - android
  - github-actions
dependencies: []
priority: medium
ordinal: 500
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create `.github/workflows/build-android-app.yml` that mirrors the structure of `build-ios-app.yml` but targets Android builds and Google Play deployment.

The iOS workflow provides the template: self-hosted runner, Ruby/Node/Rust setup, caching, and fastlane deployment. The Android workflow needs equivalent setup with Android-specific tooling (SDK, NDK, keystore signing) and Google Play upload via fastlane.

Key differences from iOS:
- Android SDK/NDK instead of Xcode
- Keystore signing instead of match certificates
- Google Play upload instead of TestFlight
- Path filters should include Android paths and exclude iOS paths
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Workflow file created at `.github/workflows/build-android-app.yml`
- [x] #2 Triggers configured: workflow_call, workflow_dispatch, and PR with Android-specific path filters
- [x] #3 Path filters include `src-tauri/gen/android/**`, `fastlane/metadata/android/**`, `taskfiles/android.yml` and exclude iOS paths
- [x] #4 Concurrency group configured to cancel in-progress builds
- [x] #5 Self-hosted runner used (matching iOS workflow)
- [x] #6 Ruby setup with bundler-cache for fastlane
- [x] #7 Node.js setup with npm cache and `npm ci`
- [x] #8 Rust setup with Android targets: aarch64-linux-android, armv7-linux-androideabi, i686-linux-android, x86_64-linux-android
- [x] #9 Rust cache configured for src-tauri workspace
- [x] #10 Android SDK and NDK environment variables set
- [x] #11 Keystore signing configured from GitHub secrets (ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD, ANDROID_KEY_BASE64)
- [x] #12 Task checksums cache configured (matching iOS)
- [x] #13 Android build artifacts cache configured
- [x] #14 Task installed and `task android:testflight` executed
- [x] #15 Google Play JSON key secret (GOOGLE_PLAY_JSON_KEY) passed to fastlane
- [x] #16 Cleanup step for keystore.properties (if: always())
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create workflow file mirroring iOS structure
2. Configure Android-specific path filters
3. Add Android Rust targets
4. Set up keystore signing from secrets
5. Configure Android build caching
6. Add cleanup step
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Created `.github/workflows/build-android-app.yml` - **Android build now works**.

**Build Failures Fixed:**

1. **NDK_HOME missing** (Run #21610962763): Tauri CLI requires `NDK_HOME`, not just `ANDROID_NDK_HOME`

2. **Java 8 instead of 11+** (Run #21639247064): Gradle requires JDK 11+. Fixed by adding `JAVA_HOME: /opt/homebrew/opt/openjdk@21` and prepending to PATH.

3. **Google Play upload fails** (Run #21639691801): Build succeeded (167s) but upload fails with "Precondition check failed". This is expected - **first AAB must be manually uploaded to Google Play Console** before automated uploads work.

**Next Step:** Manually upload first AAB per `docs/android.md` instructions.

**Final Configuration:**
- Self-hosted runner with JAVA_HOME, ANDROID_HOME, ANDROID_NDK_HOME, NDK_HOME
- Keystore signing from secrets (ANDROID_KEY_PASSWORD, ANDROID_KEY_BASE64)
- Google Play upload via `SUPPLY_JSON_KEY_DATA` secret

**Required GitHub Secrets:**
- ANDROID_KEY_PASSWORD
- ANDROID_KEY_BASE64
- GOOGLE_PLAY_JSON_KEY
<!-- SECTION:NOTES:END -->
