---
id: task-015
title: Seed mobile app with restaurants on first launch
status: Done
assignee:
  - '@claude'
created_date: '2025-12-23 16:56'
updated_date: '2025-12-23 17:02'
labels:
  - ios
  - database
dependencies: []
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Users need starter data when first launching the mobile app. Without seed data, the app starts empty and users must manually add all restaurants before they can use the roll feature. Pre-seeding with a curated list of cheap and normal restaurants provides immediate value and demonstrates app functionality.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 App detects first launch and seeds database with restaurants from lunch_list.csv
- [x] #2 Seeded data includes both cheap and normal category restaurants
- [x] #3 Seed operation only runs once on first app launch
- [x] #4 Existing user data is never overwritten by seeding logic
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add csv crate dependency to Cargo.toml
2. Copy lunch_list.csv to src-tauri/ directory for embedding
3. Implement seed_database() method in Database struct:
   - Check if lunch_list table is empty (first launch detection)
   - Parse embedded CSV using include_str\!() macro
   - Insert all restaurants into database
4. Call seed_database() after init_tables() in Database::with_connection()
5. Add unit test to verify seeding logic
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented restaurant seeding for first app launch using embedded CSV data.

## Changes Made

### Dependencies
- Added csv crate v1 to Cargo.toml for CSV parsing
- Copied lunch_list.csv to src-tauri/ directory for compile-time embedding

### Database Logic (src-tauri/src/db.rs:58-100)
- Added seed_database() method that:
  - Checks if lunch_list table is empty (first launch detection)
  - Parses embedded CSV using include_str\!() macro
  - Inserts all restaurants into database with proper error handling
  - Returns early if database already contains data (prevents overwrites)

- Modified Database::with_connection() to call seed_database() automatically
- Added with_connection_internal() helper with should_seed flag
- Updated in_memory() to skip seeding for test databases

### Testing (src-tauri/src/db.rs:219-273)
- test_seed_database_on_first_launch: Verifies CSV parsing and insertion
- test_seed_database_does_not_overwrite: Confirms existing data is preserved

## Verification
- All 17 unit/integration tests passing
- Manual testing confirmed:
  - Fresh database seeded with 18 restaurants (1 cheap, 17 normal)
  - Second launch preserves existing data without duplicates
  - Works on macOS; will work on iOS via include_str\!() embedding
<!-- SECTION:NOTES:END -->
