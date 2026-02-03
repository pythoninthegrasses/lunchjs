---
id: task-010
title: Add unit and integration tests for Rust backend
status: Done
assignee: []
created_date: '2025-12-17 21:03'
updated_date: '2025-12-17 21:06'
labels:
  - testing
  - rust
  - quality
dependencies: []
priority: medium
ordinal: 500
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add comprehensive test coverage for the Rust backend code to prevent regressions. Currently there are no tests for the database operations or Tauri commands.

## Files to test

- `src/db.rs` - Database operations (CRUD for restaurants, roll logic, recent_lunch tracking)
- `src/lib.rs` - Tauri command handlers

## Test categories

1. **Unit tests** - Test individual functions in isolation
   - `Database::new()` - initialization and table creation
   - `Database::add()` - adding restaurants
   - `Database::delete()` - removing restaurants
   - `Database::list_all()` - listing all restaurants
   - `Database::list_by_category()` - filtering by category
   - `Database::roll()` - random selection with recent exclusion

2. **Integration tests** - Test full workflows
   - Add restaurant → list → verify present
   - Add restaurant → delete → verify removed
   - Roll multiple times → verify recent exclusion works
   - Empty database edge cases
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Unit tests for all Database methods in db.rs
- [x] #2 Integration tests for key workflows
- [ ] #3 Tests pass on both macOS and iOS targets
- [x] #4 Documentation in docs/testing.md
- [x] #5 Tests can be run via task command
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Implementation Steps

1. **Set up test infrastructure**
   - Add `#[cfg(test)]` module in `db.rs`
   - Create temp database for tests (use `:memory:` or tempfile)
   - Add test utilities for setup/teardown

2. **Write unit tests for db.rs**
   - `test_database_initialization`
   - `test_add_restaurant`
   - `test_add_duplicate_restaurant` (should fail/replace)
   - `test_delete_restaurant`
   - `test_delete_nonexistent`
   - `test_list_all_empty`
   - `test_list_all_with_data`
   - `test_list_by_category`
   - `test_roll_single_restaurant`
   - `test_roll_excludes_recent`
   - `test_roll_empty_category`

3. **Write integration tests**
   - Create `tests/` directory for integration tests
   - `test_full_crud_workflow`
   - `test_roll_distribution` (statistical test for randomness)

4. **Add Taskfile command**
   - Add `test` task to run `cargo test`
   - Add `test:coverage` if coverage tooling desired

5. **Document in docs/testing.md**
   - How to run tests
   - Test file locations
   - Writing new tests
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Test Database Strategy

Use in-memory SQLite for tests to avoid file system side effects:
```rust
let conn = Connection::open_in_memory()?;
```

Or use tempfile crate for tests that need persistent storage behavior.
<!-- SECTION:NOTES:END -->
