---
id: task-033
title: Add edit functionality to restaurant list view
status: Done
assignee:
  - '@claude'
created_date: '2026-02-03 21:05'
updated_date: '2026-02-03 21:50'
labels:
  - feature
  - frontend
  - backend
dependencies: []
priority: medium
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add an edit button (pencil icon) to each restaurant in the list view that opens a modal for updating name and category.

## Requirements
- Edit button: pencil icon matching existing icons (monochrome black/white)
- Hover effect: turn yellow (not red like delete)
- Modal/overlay: opens on edit click with form for name and category
- Close modal: X button and click outside to close
- Form: edit name (text input) and category (radio: cheap/normal)
- Backend: create `update_restaurant` Tauri command
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Edit button (pencil icon) appears next to delete button on each restaurant card
- [x] #2 Edit button turns yellow (#eab308) on hover/tap with 0.2s transition
- [x] #3 Clicking edit opens a centered modal overlay
- [x] #4 Modal contains: name text input, category radio buttons (cheap/normal), Cancel and Save buttons
- [x] #5 Modal closes when clicking X button
- [x] #6 Modal closes when clicking outside the dialog
- [x] #7 Saving updates the restaurant name and/or category via Tauri IPC
- [x] #8 Error message displays in modal if duplicate name attempted
- [x] #9 List refreshes automatically after successful edit
- [x] #10 Works in both light and dark themes
- [x] #11 Rust unit tests pass for update method
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Files to Modify

| File | Changes |
|------|---------|
| `src-tauri/src/db.rs` | Add `update()` method + unit tests |
| `src-tauri/src/lib.rs` | Add `update_restaurant` Tauri command |
| `src-tauri/dist/list.html` | Add edit button, modal HTML, Alpine.js state |
| `src-tauri/dist/app.css` | Add edit button + modal styles |

## Phase 1: Backend (Rust) - TDD

### 1.1 Add `update()` method to db.rs (after `delete()` on line 153)

```rust
pub fn update(&self, original_name: &str, new_name: &str, new_category: &str) -> Result<()> {
    let conn = self.conn.lock().unwrap();

    // Check for name conflict if renaming
    if original_name != new_name {
        let exists: bool = conn.query_row(
            "SELECT EXISTS(SELECT 1 FROM lunch_list WHERE restaurants = ?)",
            [new_name],
            |row| row.get(0),
        )?;
        if exists {
            return Err(rusqlite::Error::SqliteFailure(
                rusqlite::ffi::Error::new(rusqlite::ffi::SQLITE_CONSTRAINT),
                Some(format!("Restaurant '{}' already exists", new_name)),
            ));
        }
    }

    conn.execute(
        "UPDATE lunch_list SET restaurants = ?, option = ? WHERE restaurants = ?",
        [new_name, new_category, original_name],
    )?;

    // Update recent_lunch if name changed
    conn.execute(
        "UPDATE recent_lunch SET restaurants = ? WHERE restaurants = ?",
        [new_name, original_name],
    )?;

    Ok(())
}
```

### 1.2 Add unit tests to db.rs

- `test_update_restaurant_same_name` - update category only
- `test_update_restaurant_new_name` - rename restaurant
- `test_update_restaurant_conflict` - duplicate name error
- `test_update_restaurant_updates_recent` - recent_lunch table updated

### 1.3 Add Tauri command to lib.rs (after line 32)

```rust
#[tauri::command]
fn update_restaurant(original_name: String, new_name: String, new_category: String) -> Result<(), String> {
    get_db().update(&original_name, &new_name, &new_category).map_err(|e| {
        if e.to_string().contains("already exists") {
            format!("Restaurant '{}' already exists", new_name)
        } else {
            e.to_string()
        }
    })
}
```

Register in invoke_handler (line 69-74).

## Phase 2: Frontend (HTML/Alpine.js)

### 2.1 Add edit button to restaurant card in list.html

```html
<button class="edit-btn" @click="openEditModal(r)">
  <i class="fas fa-pencil"></i>
</button>
```

### 2.2 Add modal HTML after the card div

Modal with: overlay backdrop, dialog box, close X button, form with name input + category radios, error display, Cancel/Save buttons.

### 2.3 Extend Alpine.js listView()

State: `editModalOpen`, `editingRestaurant`, `editName`, `editCategory`, `editError`, `editLoading`

Methods: `openEditModal(r)`, `closeEditModal()`, `submitEdit()`

## Phase 3: Styling (CSS)

### 3.1 Edit button styles

Same pattern as delete-btn but yellow (#eab308) on hover instead of red.

### 3.2 Modal styles

- `.modal-overlay` - fixed fullscreen, semi-transparent black backdrop
- `.modal-dialog` - centered white box with border
- `.modal-close` - absolute positioned X button
- `.modal-form`, `.form-group`, `.form-label`, `.modal-input`
- `.modal-error`, `.modal-actions`, `.btn-secondary`

## Verification

1. Run tests: `cd src-tauri && cargo test`
2. Dev build: `task dev`
3. Test all scenarios manually
4. Mobile: `task ios` and `task android:dev`
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Summary

Added full CRUD update functionality to the restaurant list view with edit button and modal dialog.

## Changes

**Backend (Rust)**
- `src-tauri/src/db.rs`: Added `update()` method with duplicate name detection and recent_lunch table sync
- `src-tauri/src/lib.rs`: Added `update_restaurant` Tauri command, registered in invoke_handler
- 4 new unit tests for update functionality (same name, new name, conflict detection, recent table sync)

**Frontend**
- `src-tauri/dist/list.html`: Added edit button (pencil icon), modal overlay with form, Alpine.js state/methods
- `src-tauri/dist/app.css`: Added edit button styles (yellow hover), modal styles (overlay, dialog, form, error)

**Testing**
- `src-tauri/dist/tests/global-setup.js`: Updated Tauri mock with `update_restaurant` command + conflict detection
- `src-tauri/dist/tests/list.spec.js`: Added 9 E2E tests for edit functionality

## Test Results
- 21 Rust tests passing (4 new update tests)
- 10 frontend unit tests passing
- 58 E2E tests passing (9 new edit tests)

## Verification
- Edit button appears with pencil icon, turns yellow on hover
- Modal opens/closes correctly (X button, click outside, Cancel)
- Name and category updates work via Tauri IPC
- Duplicate name shows error in modal
- List refreshes after successful edit
- Works in both light and dark themes
<!-- SECTION:NOTES:END -->
