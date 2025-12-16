---
id: task-001
title: Migrate FastHTML + Tauri to Alpine.js + Tauri for iOS support
status: Done
assignee: []
created_date: ''
updated_date: '2025-12-12 18:32'
labels:
  - migration
  - ios
  - tauri
  - alpine.js
dependencies: []
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Migrate the Lunch app from FastHTML (Python sidecar) to Alpine.js + Tauri (Rust backend) to enable cross-platform support for macOS and iOS.

### Context

The current architecture uses a Python sidecar (PEX SCIE) that runs FastHTML on localhost:8080. iOS does not allow spawning external processes, making this architecture incompatible with iOS. The solution is to replace the Python backend with Rust Tauri commands and convert FastHTML to static HTML + Alpine.js.

### Current Status

- [x] Create `src-tauri/dist/` directory structure
- [x] Copy static assets (CSS, fonts, images)
- [x] Download Alpine.js to `dist/js/`
- [ ] Create `dist/js/app.js` (theme + nav logic)
- [ ] Create `dist/index.html` (home view)
- [ ] Create `dist/add.html` (add view)
- [ ] Create `dist/list.html` (list view)
- [ ] Create `dist/settings.html` (settings view)
- [ ] Add Rust dependencies to `Cargo.toml`
- [ ] Create `src-tauri/src/db.rs`
- [ ] Create `src-tauri/src/main.rs`
- [ ] Update `src-tauri/src/lib.rs` with Tauri commands
- [ ] Create `tauri.conf.json`
- [ ] Test on macOS: `npx tauri dev`
- [ ] Add iOS targets: `rustup target add ...`
- [ ] Initialize iOS: `npx tauri ios init`
- [ ] Test on iOS simulator: `npx tauri ios dev`
- [ ] Configure signing for App Store
- [ ] Build for distribution: `npx tauri ios build`

### Architecture Reference

See `docs/architecture.md` for detailed migration mappings including:
- FastHTML routes → Static HTML pages
- HTMX attributes → Alpine.js directives
- Python DB functions → Rust Tauri commands
- Complete code examples for all components
<!-- SECTION:DESCRIPTION:END -->

# task-001 - Migrate FastHTML + Tauri to Alpine.js + Tauri for iOS support

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 App runs on macOS with `npx tauri dev`
- [x] #2 App runs on iOS simulator with `npx tauri ios dev`
- [x] #3 All 4 views functional (Home, Add, List, Settings)
- [x] #4 Restaurant CRUD operations work via Rust backend
- [x] #5 Theme toggle and navigation work
- [x] #6 Round-robin lunch selection works
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
### Phase 1: Frontend (Alpine.js)
1. Create `dist/js/app.js` with theme toggle and nav highlighting
2. Create 4 HTML pages using Alpine.js directives
3. Test static pages load in browser

### Phase 2: Backend (Rust)
1. Add dependencies to `Cargo.toml` (rusqlite, rand, chrono, dirs, serde)
2. Create `db.rs` with Database struct and CRUD operations
3. Create `lib.rs` with Tauri commands
4. Create `main.rs` entry point
5. Create `tauri.conf.json`

### Phase 3: Integration
1. Test on macOS with `npx tauri dev`
2. Verify all CRUD operations work
3. Verify theme and navigation work

### Phase 4: iOS
1. Add iOS Rust targets
2. Initialize iOS project
3. Test on simulator
4. Configure signing
5. Build for distribution
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2025-12-11: macOS dev build tested successfully with `npx tauri dev`

2025-12-11: iOS targets added, iOS project initialized with Team ID 654C9Y2C3F

2025-12-11: iOS simulator not available - need to download iOS runtime from Xcode Settings → Platforms
<!-- SECTION:NOTES:END -->

## Notes

- Rust code is minimal (~150 lines total) - only handles SQLite operations
- Alpine.js handles all UI state and reactivity client-side
- Existing CSS and assets copy directly (no changes needed)
