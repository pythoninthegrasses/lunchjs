---
id: task-025
title: Investigate iOS simulator viewport regression - content shifted up
status: Done
assignee:
  - '@claude'
created_date: '2026-01-05 17:36'
updated_date: '2026-01-06 16:24'
labels:
  - ios
  - bug-investigation
  - viewport
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The iOS simulator (iPhone 13 mini) shows content shifted toward the top of the screen with excessive empty white space at the bottom. The main content (LUNCH logo, radio buttons, Roll Lunch button) is vertically imbalanced.

Need to determine if this is:
1. A simulator-only visual artifact
2. A real regression that affects physical iOS devices
3. A CSS/layout issue introduced in recent changes

Reference screenshots:
- Simulator: /Users/lance/Desktop/Simulator Screenshot - iPhone 13 mini - 2026-01-05 at 11.23.10.png
- Comparison: /Users/lance/Desktop/Screenshot 2026-01-05 at 11.24.13 AM.jpeg
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Tested on physical iOS device to confirm if issue reproduces
- [x] #2 Compared viewport behavior between simulator and real device
- [x] #3 Root cause identified (simulator bug vs actual regression)
- [x] #4 If regression: fix implemented and verified on both simulator and device
- [ ] #5 If simulator-only: documented as known simulator quirk
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Analyze current CSS layout logic for vertical centering
2. Check git history for recent CSS changes that might have caused regression
3. Test on physical device via `task ios:device` to confirm issue reproduces (AC #1, #2)
4. Compare layout behavior between simulator and device
5. Identify root cause (AC #3)
6. Fix if regression, document if simulator-only quirk (AC #4 or #5)
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Fixed Xcode build PATH issue: npm not found because Xcode's restricted PATH doesn't include mise shims
- Solution: Modified `src-tauri/gen/apple/lunch.xcodeproj/project.pbxproj` shellScript to prepend `$HOME/.local/share/mise/shims` to PATH
- iOS simulator build now succeeds

- Analyzed CSS layout: `.main-content` has `justify-content: center` but content appears top-aligned on iOS simulator
- Root cause hypothesis: iOS WKWebView doesn't handle `height: 100%` correctly for viewport calculations
- CSS Fix applied: Added `min-height: 100dvh` to `.app-container` with `@supports` for `100svh` (small viewport height for iOS)
- iOS simulator build succeeds with the fix
- **NEEDS TESTING**: User should verify on simulator and physical device to confirm fix

**Physical Device Install Error:**

Attempted to test on physical iPhone 13 mini (iPhone14,4, iOS 18.7.1) but installation failed with entitlement error:

```
Unable to Install "Lunch"
Domain: IXUserPresentableErrorDomain
Code: 14
Recovery Suggestion: Failed to install embedded profile for com.lunch.desktop : 0xe800801f (Attempted to install a Beta profile without the proper entitlement.)
```

Error details:
- MIInstallerErrorDomain Code 13
- LibMISErrorNumber: -402620385
- ApplicationVerificationFailed: "This app cannot be installed because its integrity could not be verified"
- Root cause: Missing entitlement for beta/development profile installation

Blocking: Cannot test viewport fix on physical device until provisioning/entitlement issue is resolved

Environment:
- macOS 15.7.1 (Build 24G231)
- Xcode 16.4 (23792)
- Device: iPhone 13 mini, iOS 18.7.1 (22H31)

**Provisioning Fix Applied:**
- User opened Xcode and enabled "Automatically manage signing"
- Logged into Apple Developer account
- Entitlement error resolved

**New Error: WebSocket Connection Refused**
```
failed to read CLI options: Context("failed to build WebSocket client", Io(Os { code: 61, kind: ConnectionRefused }))
```

**Root Cause:** Building directly from Xcode instead of using CLI.

**Correct Workflow:**
1. NEVER build directly from Xcode's Build button
2. ALWAYS use `task ios:device` from terminal
3. This starts the Tauri dev server (WebSocket) → then opens Xcode → Xcode builds with server running

The Tauri iOS dev workflow requires the CLI to start a WebSocket server that Xcode's build script connects to for passing configuration.

**WebKit Sandbox Fix Applied:**

Root cause: WKWebView on physical iOS devices requires explicit sandbox extension to read app bundle files. The strictly sandboxed webview process fails without App Groups entitlement.

Fixes applied:
1. `src-tauri/Info.ios.plist` - Added NSAppTransportSecurity with NSAllowsArbitraryLoads and NSLocalNetworkUsageDescription
2. `src-tauri/gen/apple/lunch_iOS/lunch_iOS.entitlements` - Added App Groups entitlement (group.com.lunch.desktop)

**MANUAL STEP REQUIRED:**
User must register the App Group in Apple Developer Portal:
1. Go to https://developer.apple.com/account/resources/identifiers/list/applicationGroup
2. Click + to add new App Group
3. Enter: `group.com.lunch.desktop`
4. In Xcode, go to Signing & Capabilities > + Capability > App Groups
5. Enable the `group.com.lunch.desktop` group

Then rebuild: `task ios:device`

**Corrected command:** `task ios:dev:device` (not `task ios:device`)

**Resolution:**

- Tauri iOS dev mode has WebKit sandbox issues on physical devices
- Release builds work correctly - bundled assets avoid dev server network/sandbox complications
- Created new task `task ios:run:device` that builds release and installs via devicectl
- `task ios:dev:device` kept for reference but has known issues (WebSocket connection, WebKit sandbox)

**Files modified:**
- `taskfiles/ios.yml` - Added `run:device` task
- `CLAUDE.md` - Updated to recommend `ios:run:device` for physical device testing

**Final cleanup:**
- Removed `task ios:dev:device` (unreliable due to Tauri dev mode WebKit sandbox issues)
- Renamed workflow to `task ios:run:device` (release build approach)
- Updated CLAUDE.md and README.md

**Final Resolution:**

- Root cause: CSS viewport height issue - iOS WKWebView doesn't handle `height: 100%` correctly
- Fix: Added `min-height: 100dvh` to `.app-container` with `@supports` for `100svh` (small viewport height)
- Verified working on both iOS simulator and physical device (iPhone 13 mini)
- AC #5 N/A - was a real CSS regression, not simulator-only quirk

**Additional fixes during investigation:**
- Fixed Xcode build PATH issue (mise shims not in PATH)
- Added ENABLE_USER_SCRIPT_SANDBOXING: false to project.yml
- Fixed device ID extraction in ios:run:device task
- Created reliable physical device workflow via release builds
<!-- SECTION:NOTES:END -->
