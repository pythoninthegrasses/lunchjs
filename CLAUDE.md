# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LunchJS is a cross-platform restaurant selector app built with Tauri v2 + Alpine.js, targeting macOS desktop and iOS mobile. The app randomly selects restaurants from a user-maintained list, with category filtering (cheap/normal).

## Development Commands

```bash
# Development (macOS) - uses nightly + parallel frontend (~10% faster)
task dev

# Development (macOS) - stable toolchain fallback
task tauri:dev:stable

# Development (iOS simulator)
task ios

# Development (physical iOS device)
task ios:device

# Run tests
task test

# Build (macOS - current architecture)
task build

# Build (macOS - Apple Silicon)
task build:arm64

# Build (macOS - Intel)
task build:x64

# Build (iOS for App Store - requires device/provisioning)
task ios:build

# Build (iOS Simulator - no provisioning required)
task ios:build:sim

# Sync code signing certificates
task certs

# Upload to TestFlight
task ios:testflight

# Upload to App Store
task ios:release

# Clean build artifacts
task clean
```

## Architecture

**Frontend**: Static HTML pages with Alpine.js for reactivity in `src-tauri/dist/`
- Alpine.js directives (`x-data`, `x-model`, `@click`) handle all UI state
- Tauri IPC via `window.__TAURI__.core.invoke()` for backend calls
- Basecoat CSS framework for styling

**Backend**: Rust Tauri commands in `src-tauri/src/`
- `db.rs` - SQLite database operations using rusqlite
- `lib.rs` - Tauri command handlers (`list_restaurants`, `add_restaurant`, `delete_restaurant`, `roll_lunch`)

**Communication**: Tauri IPC (not HTTP) - no localhost server needed

## Database

SQLite database stored at:
- macOS: `~/Library/Application Support/Lunch/lunch.db`
- iOS: App data directory

Tables:
- `lunch_list` - restaurants with name and category (cheap/normal)
- `recent_lunch` - tracks last 14 selections to avoid immediate repeats

## Key Files

- `docs/architecture.md` - Full migration plan from FastHTML with code examples
- `lunch_list.csv` - Seed data for importing restaurants
- `src-tauri/dist/js/app.js` - Shared theme toggle and navigation logic

## Current Status

**Migration Complete** - All code implementation done:
- Frontend: 4 HTML pages with Alpine.js (`index.html`, `add.html`, `list.html`, `settings.html`)
- Backend: Rust Tauri commands in `db.rs` and `lib.rs`
- macOS dev build tested and working

**iOS Setup Complete**:
- Rust targets installed (`aarch64-apple-ios`, `x86_64-apple-ios`, `aarch64-apple-ios-sim`)
- iOS project initialized with Team ID
- Xcode project at `src-tauri/gen/apple/lunch.xcodeproj`

**Next Steps**:
- Download iOS simulator runtime from Xcode → Settings → Platforms
- Test on simulator: `npx tauri ios dev`
- Or test on physical device: `npx tauri ios dev --open --host`

## Context

- Context7 mcp libraries
  - fastlane/docs
  - rohanadwankar/oxdraw
  - taskfile_dev
  - websites/basecoatui_com
  - websites/v2_tauri_app

<!-- BACKLOG.MD MCP GUIDELINES START -->

<CRITICAL_INSTRUCTION>

## BACKLOG WORKFLOW INSTRUCTIONS

This project uses Backlog.md MCP for all task and project management activities.

**CRITICAL GUIDANCE**

- If your client supports MCP resources, read `backlog://workflow/overview` to understand when and how to use Backlog for this project.
- If your client only supports tools or the above request fails, call `backlog.get_workflow_overview()` tool to load the tool-oriented overview (it lists the matching guide tools).

- **First time working here?** Read the overview resource IMMEDIATELY to learn the workflow
- **Already familiar?** You should have the overview cached ("## Backlog.md Overview (MCP)")
- **When to read it**: BEFORE creating tasks, or when you're unsure whether to track work

These guides cover:
- Decision framework for when to create tasks
- Search-first workflow to avoid duplicates
- Links to detailed guides for task creation, execution, and completion
- MCP tools reference

You MUST read the overview resource to understand the complete workflow. The information is NOT summarized here.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD MCP GUIDELINES END -->
