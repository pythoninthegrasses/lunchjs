---
id: task-023
title: Configure Android emulator to use desktop keyboard instead of virtual keyboard
status: Done
assignee:
  - '@claude'
created_date: '2026-01-05 16:49'
updated_date: '2026-01-05 17:17'
labels:
  - android
  - emulator
  - dx
  - configuration
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Investigate and configure the Android emulator to accept input from the host computer's physical keyboard instead of requiring the on-screen virtual keyboard. This would improve developer experience by matching iOS Simulator behavior where typing uses the Mac keyboard directly.

The Android emulator supports hardware keyboard input via the `hw.keyboard=yes` AVD setting, but this needs to be verified and potentially automated in the project's Android emulator setup.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Verify current Android emulator keyboard behavior
- [x] #2 Research AVD hardware keyboard configuration options (hw.keyboard setting)
- [x] #3 Document how to enable hardware keyboard in AVD Manager GUI
- [x] #4 Test if hardware keyboard input works with Tauri webview text fields
- [x] #5 Update android.yml or project docs with emulator keyboard configuration if needed
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Research Android AVD hw.keyboard configuration
2. Check current emulator config location
3. Document GUI and CLI methods to enable hardware keyboard
4. Update README or create emulator setup docs
5. Verify configuration works
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added automatic hardware keyboard configuration for Android emulator.

**Tasks added to `taskfiles/android.yml`:**

| Task | Purpose | When |
|------|---------|------|
| `emulator:keyboard` | Sets `hw.keyboard=yes` and `hw.keyboard.lid=no` in AVD config | Auto (dep of dev) |
| `emulator:hide-soft-keyboard` | Runs `adb shell settings put secure show_ime_with_hard_keyboard 0` | Auto (background in dev) |
| `emulator:setup` | Runs both tasks, handles emulator not running gracefully | Manual convenience |

**How it works:**
- `task android:dev` automatically configures both settings
- AVD config is applied before emulator starts (precondition + status checks)
- Soft keyboard setting is applied via background process after emulator boots
- Both settings persist across restarts

**Configuration applied:**
```ini
# ~/.android/avd/<name>.avd/config.ini
hw.keyboard=yes
hw.keyboard.lid=no
```
```bash
# Runtime setting (persists in emulator data)
adb shell settings put secure show_ime_with_hard_keyboard 0
```
<!-- SECTION:NOTES:END -->
