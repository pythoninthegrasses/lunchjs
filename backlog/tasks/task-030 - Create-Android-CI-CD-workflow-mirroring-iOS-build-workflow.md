---
id: task-030
title: Create Android CI/CD workflow mirroring iOS build workflow
status: In Progress
assignee:
  - '@claude'
created_date: '2026-02-02 23:31'
updated_date: '2026-02-03 00:06'
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
**Build Failure (Run #21610962763)**

Error:
```
Android NDK not found. Make sure the NDK is installed and the NDK_HOME environment variable is set.
```

**Root Cause:**
Tauri CLI expects `NDK_HOME` environment variable, but the workflow only sets `ANDROID_NDK_HOME`. The Fastfile also sets `ANDROID_NDK_HOME` but Tauri doesn't read that variable.

**Proposed Fix:**
Add `NDK_HOME` to the workflow environment variables alongside `ANDROID_NDK_HOME`:

```yaml
env:
  ANDROID_HOME: /opt/homebrew/share/android-commandlinetools
  ANDROID_NDK_HOME: /opt/homebrew/share/android-commandlinetools/ndk/28.2.13676358
  NDK_HOME: /opt/homebrew/share/android-commandlinetools/ndk/28.2.13676358  # Required by Tauri CLI
```

**Reference:**
- GitHub Actions run: https://github.com/pythoninthegrass/lunchjs/actions/runs/21610962763/job/62279365776
- Fastfile line 460: `sh("cd #{ROOT_DIR}/src-tauri && npx tauri android build --aab true")`
<!-- SECTION:NOTES:END -->
