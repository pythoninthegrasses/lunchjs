# Testing

This document describes how to run and write tests for the LunchJS Rust backend.

## Running Tests

```bash
# Run all tests
task test

# Run tests directly with cargo
cd src-tauri && cargo test

# Run tests with output
cd src-tauri && cargo test -- --nocapture

# Run a specific test
cd src-tauri && cargo test test_add_restaurant

# Run tests matching a pattern
cd src-tauri && cargo test roll
```

## Test Structure

Integration tests are located in `src-tauri/tests/` as separate test files. This follows Rust's convention of separating integration tests from source code.

### Tests

| Test | Description |
|------|-------------|
| `test_database_initialization` | Verifies empty database starts with no restaurants |
| `test_add_restaurant` | Tests adding a single restaurant |
| `test_add_duplicate_restaurant` | Verifies duplicate names are rejected |
| `test_delete_restaurant` | Tests removing a restaurant |
| `test_delete_nonexistent` | Verifies deleting non-existent restaurant doesn't error |
| `test_list_all_empty` | Tests listing when database is empty |
| `test_list_all_with_data` | Tests listing with multiple restaurants |
| `test_list_all_sorted_alphabetically` | Verifies alphabetical ordering |
| `test_list_by_category` | Tests filtering by cheap/normal category |
| `test_list_by_category_case_insensitive` | Verifies case-insensitive category matching |
| `test_roll_single_restaurant` | Tests roll with one option |
| `test_roll_empty_category` | Verifies error when category has no restaurants |
| `test_roll_excludes_recent` | Tests that recent selection is excluded |
| `test_roll_with_single_option_allows_repeat` | Verifies single option can repeat |
| `test_full_crud_workflow` | Integration test for create/read/update/delete |

## Writing New Tests

### Test Database

Tests use an in-memory SQLite database to avoid file system side effects:

```rust
use lunch::db::Database;

fn test_db() -> Database {
    Database::in_memory().expect("Failed to create in-memory database")
}

#[test]
fn test_example() {
    let db = test_db();
    // Each test gets a fresh, isolated database
    db.add("Test", "cheap").unwrap();
    assert_eq!(db.list_all().unwrap().len(), 1);
}
```

### Test Guidelines

1. Each test should be independent and not rely on state from other tests
2. Use descriptive test names that explain what's being tested
3. Test both success and error cases
4. Use `unwrap()` for operations expected to succeed
5. Use `assert!(result.is_err())` for operations expected to fail

### Adding Tests

Add new tests to `src-tauri/tests/db_tests.rs` or create a new file in `src-tauri/tests/`:

```rust
use lunch::db::Database;

fn test_db() -> Database {
    Database::in_memory().expect("Failed to create in-memory database")
}

#[test]
fn test_your_new_feature() {
    let db = test_db();
    // Test implementation
}
```
