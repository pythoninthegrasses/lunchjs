---
id: TASK-042
title: Raise the iOS minimum version to 18.7.8
status: To Do
assignee: []
created_date: '2026-10-22T14:56:00Z'
labels:
  - ios
dependencies: []
references:
  - src-tauri/tauri.conf.json
  - src-tauri/gen/apple/project.yml
priority: medium
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Apple sends an email on every TestFlight upload about the app's minimum iOS version. The minimum is currently the Tauri default 14.0: bundle.iOS.minimumSystemVersion is unset in tauri.conf.json, project.yml has deploymentTarget iOS 14.0, and project.pbxproj has IPHONEOS_DEPLOYMENT_TARGET = 14.0. Tauri CLI 2.10.0 maps bundle.iOS.minimumSystemVersion to IPHONEOS_DEPLOYMENT_TARGET. The generated project must be updated as well as the config, and the committed tauri.conf.json value matters because the iOS lanes restore it after each build. 18.7.8 is a point release: confirm Xcode and App Store Connect accept a three-part minimum before relying on it, and note this drops every device that cannot run iOS 18.7.8.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 tauri.conf.json sets bundle.iOS.minimumSystemVersion to 18.7.8 and the value survives the post-build restore hook
- [ ] #2 project.yml deploymentTarget and the regenerated project.pbxproj use the same minimum
- [ ] #3 Xcode and App Store Connect accept the three-part value, or the fallback value used is recorded in the task notes
- [ ] #4 The next TestFlight upload no longer triggers the minimum version email, with evidence recorded
- [ ] #5 docs/ios.md records the minimum version and the devices it excludes
<!-- AC:END -->
