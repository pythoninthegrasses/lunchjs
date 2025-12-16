---
id: task-005
title: Title case category in Add Restaurant success message
status: Done
assignee: []
created_date: '2025-12-12 18:50'
updated_date: '2025-12-15 16:02'
labels:
  - ui
  - bug
dependencies: []
priority: low
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The success message after adding a restaurant shows the category as lowercase ("cheap" or "normal"). It should display as title case ("Cheap" or "Normal").

**File:** `src-tauri/dist/add.html` (line 89)

Change the message template to capitalize the first letter of the category.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Success message shows 'Cheap' instead of 'cheap'
- [x] #2 Success message shows 'Normal' instead of 'normal'
<!-- AC:END -->
