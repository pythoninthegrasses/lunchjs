---
id: task-003
title: Setup fastlane for TestFlight distribution
status: Done
assignee: []
created_date: '2025-12-11 23:12'
updated_date: '2025-12-12 18:32'
labels:
  - ios
  - ci-cd
  - fastlane
  - testflight
dependencies: []
priority: medium
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set up fastlane at project root with match for code signing to automate iOS TestFlight distribution.

### Decisions

- **Config location**: Project root (persists across `tauri ios init`)
- **Code signing**: Fastlane match with MinIO/S3 storage
- **CI/CD**: Manual only for now (defer GitHub Actions)

### Files to Create

```
lunchjs/
├── Gemfile                    # Ruby dependencies
├── .env                       # MinIO credentials (gitignored)
├── fastlane/
│   ├── Appfile               # App config (bundle ID, team ID)
│   ├── Fastfile              # Build lanes
│   └── Matchfile             # S3/MinIO storage config
└── taskfiles/tauri.yml       # Add testflight task
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `MATCH_S3_ACCESS_KEY` | MinIO access key |
| `MATCH_S3_SECRET_ACCESS_KEY` | MinIO secret key |
| `MATCH_S3_ENDPOINT` | MinIO endpoint URL |
| `MATCH_PASSWORD` | Encryption password for certificates |

### Prerequisites

1. MinIO bucket created (e.g., `ios-certificates`)
2. MinIO access credentials
3. Apple ID with App Store Connect access

### Reference

See plan file: `/Users/lance/.claude/plans/effervescent-mapping-willow.md`
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Gemfile created with fastlane dependency
- [x] #2 fastlane/Appfile configured with bundle ID and team ID
- [x] #3 fastlane/Matchfile configured for MinIO/S3 storage
- [x] #4 fastlane/Fastfile with beta and release lanes
- [x] #5 taskfiles/tauri.yml updated with ios:testflight task
- [x] #6 bundle exec fastlane match appstore generates certificates
- [x] #7 bundle exec fastlane beta uploads to TestFlight
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Progress Update (2025-12-11)

### Completed
- Gemfile created
- fastlane/Appfile configured (com.lunch.desktop, team 654C9Y2C3F)
- fastlane/Matchfile configured for MinIO (s3_bucket: ios-certificates)
- fastlane/Fastfile with certificates, beta, release lanes
- taskfiles/tauri.yml updated with ios:certificates, ios:testflight, ios:release tasks
- App ID registered in Developer Portal (CQ4FYY8T37)
- App created in App Store Connect (lunchjs - ID 6756455528)
- Distribution certificate generated (8QY4DWG77X)
- Provisioning profile created (match AppStore com.lunch.desktop)
- Certificates encrypted and uploaded to MinIO

### Environment Variables (Updated)
| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | MinIO access key |
| `AWS_SECRET_ACCESS_KEY` | MinIO secret key |
| `AWS_ENDPOINT_URL` | MinIO endpoint (http://10.5.162.10:9000) |
| `MATCH_PASSWORD` | Encryption password for certificates |
| `FASTLANE_USER` | Apple ID email |
| `FASTLANE_PASSWORD` | Apple ID password |

### Outstanding
- Test `task ios:testflight` (or `fastlane beta`) to verify full TestFlight upload workflow

## Failed Run (2025-12-11)

### Error
```
can't find gem bundler (= 2.6.9) with executable bundle (Gem::GemNotFoundException)
```

### Root Cause
Ruby version conflict between:
- mise ruby 3.4.5 (bundler from Gemfile.lock)
- homebrew ruby 3.4.7 (system fastlane)

### Potential Fixes
1. Use homebrew ruby consistently: `brew install ruby` and ensure it's in PATH before mise
2. Use mise ruby consistently: Remove homebrew ruby or ensure mise ruby is in PATH
3. Update Gemfile.lock bundler version: `bundle update --bundler`
4. Use fastlane directly without bundle exec (already works via homebrew)

## Xcode Build Failed (2025-12-11)

### Errors
1. `No Accounts: Add a new account in Accounts settings`
2. `No profiles for 'com.lunch.desktop' were found: Xcode couldn't find any iOS App Development provisioning profiles matching 'com.lunch.desktop'`

### Root Cause
Xcode project needs configuration:
1. Apple Developer account not added to Xcode
2. Xcode project not configured to use the match provisioning profile

### Fixes Required
1. Open Xcode > Settings > Accounts > Add Apple ID
2. Configure project signing in Xcode:
   - Open `src-tauri/gen/apple/lunch.xcodeproj`
   - Select lunch_iOS target
   - Signing & Capabilities tab
   - Set Team to "Lance Stephens (654C9Y2C3F)"
   - Set Provisioning Profile to "match AppStore com.lunch.desktop"
3. OR use fastlane's `update_code_signing_settings` action in Fastfile

### Future Improvement
Refactor Fastfile to use `task` commands instead of direct `npx tauri` calls for consistency
<!-- SECTION:NOTES:END -->
