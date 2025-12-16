---
id: task-002
title: Migrate taskfiles from upstream lunch repo
status: Done
assignee: []
created_date: '2025-12-11 22:11'
updated_date: '2025-12-11 22:17'
labels:
  - devops
  - taskfile
  - automation
dependencies: []
priority: medium
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Migrate and adapt relevant taskfiles from the upstream FastHTML lunch repo (`~/git/lunch`) to lunchjs. The taskfiles provide task automation for development, building, and deployment.

### Files to migrate

From `~/git/lunch/`:
- `taskfile.yml` - Main taskfile with includes
- `taskfiles/tauri.yml` - Tauri build tasks (needs adaptation for Alpine.js, no sidecar)
- `taskfiles/npm.yml` - NPM tasks

### Files to skip (no longer needed)

- `taskfiles/pex.yml` - Python PEX sidecar builds (replaced by Rust backend)
- `taskfiles/docker.yml` - Docker tasks (may not be needed)
- `taskfiles/flet.yml` - Flet-specific (not used)
- `taskfiles/uv.yml` - Python uv tasks (no Python in lunchjs)

### Adaptation needed

The `tauri.yml` needs significant changes:
- Remove all sidecar-related tasks (sidecar, sidecar:arm64, sidecar:x64)
- Remove sidecar deps from build tasks
- Add iOS-specific tasks (ios:dev, ios:build, ios:init)
- Update paths (no more `SIDECAR_DIR`)
- Keep: dev, build, build:arm64, build:x64, icons, clean, doctor, check-deps
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 taskfile.yml created in lunchjs root
- [x] #2 taskfiles/tauri.yml adapted for Alpine.js (no sidecar)
- [x] #3 taskfiles/npm.yml migrated
- [x] #4 iOS tasks added (ios:dev, ios:build, ios:init)
- [x] #5 task tauri:dev runs successfully
- [x] #6 task tauri:build produces macOS app
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2025-12-11: Created taskfile.yml, taskfiles/npm.yml, taskfiles/tauri.yml

2025-12-11: All tasks verified working: task --list, tauri:info, tauri:check-deps

2025-12-11: task build produces Lunch.app and Lunch_1.0.0_aarch64.dmg
<!-- SECTION:NOTES:END -->
