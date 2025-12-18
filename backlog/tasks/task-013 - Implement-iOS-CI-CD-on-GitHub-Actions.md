---
id: task-013
title: Implement iOS CI/CD on GitHub Actions
status: In Progress
assignee: []
created_date: '2025-12-17 22:59'
updated_date: '2025-12-18 00:08'
labels:
  - ci
  - ios
  - github-actions
  - fastlane
dependencies: []
priority: medium
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update `.github/workflows/build-ios-app.yml` to mirror the local `task ios:testflight` workflow.

## Current State
The existing workflow is a skeleton that only runs `fastlane beta` with `MATCH_PASSWORD`.

## Local Workflow Analysis
`task ios:testflight` → `fastlane beta` lane which:
1. Configures MinIO (custom S3 endpoint for match storage)
2. Runs `match(type: "appstore")` to sync certificates from S3
3. Updates Xcode code signing settings
4. Builds with `npx tauri ios build --export-method app-store-connect`
5. Uploads IPA to TestFlight via App Store Connect API

## Required GitHub Secrets
From `.env.example`, these are needed:

| Secret | Purpose |
|--------|---------|
| `AWS_ACCESS_KEY_ID` | MinIO/S3 auth for match certificate storage |
| `AWS_SECRET_ACCESS_KEY` | MinIO/S3 auth for match certificate storage |
| `AWS_ENDPOINT_URL` | Custom MinIO endpoint (e.g., `https://minio.example.com:9000`) |
| `MATCH_PASSWORD` | Decrypts certificates stored in match |
| `APP_STORE_CONNECT_API_KEY_KEY_ID` | API Key ID for App Store Connect |
| `APP_STORE_CONNECT_API_KEY_ISSUER_ID` | Issuer ID for App Store Connect |
| `APP_STORE_CONNECT_API_KEY_KEY` | Base64-encoded .p8 key content |

**NOT needed:** `FASTLANE_USER`, `FASTLANE_PASSWORD`, `MATCH_KEYCHAIN_PASSWORD`

## Workflow Updates Needed
1. Add all required secrets as environment variables
2. Install Rust toolchain with iOS targets
3. Install Node.js for Tauri CLI
4. Setup Ruby/Bundler for fastlane
5. Consider caching (Cargo, npm, Ruby gems)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 GitHub Actions workflow successfully syncs certificates from MinIO via match
- [ ] #2 Workflow builds iOS app using Tauri
- [ ] #3 Workflow uploads IPA to TestFlight
- [x] #4 All 7 required secrets documented and configured
- [x] #5 Workflow triggers on push to main/master

- [x] #6 Workflow only triggers on source code changes (html, css, js, rs, toml, swift, etc.) - not docs or config
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## CI Run Progress (2025-12-18)

### Run 20321265112 - Failed

**Root cause:** Xcode project missing at `src-tauri/gen/apple/lunch.xcodeproj`

The iOS project (`src-tauri/gen/apple/`) is gitignored and doesn't exist in CI.

`update_code_signing_settings` fails because there's no `.xcodeproj` to configure.

**Fix needed:** Add `npx tauri ios init` step before `fastlane beta`

### Previous fixes applied:

- ✅ Changed `fastlane beta` → `bundle exec fastlane beta`

- ✅ Removed redundant `bundle install` (bundler-cache handles it)

- ✅ Fixed AWS_ENDPOINT_URL (removed :9000 port)

- ✅ Added `readonly: true` to match calls (skip Dev Portal verification)
<!-- SECTION:NOTES:END -->
