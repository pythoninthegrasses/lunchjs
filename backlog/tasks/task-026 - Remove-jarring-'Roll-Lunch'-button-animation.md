---
id: task-026
title: Remove jarring 'Roll Lunch' button animation
status: Done
assignee:
  - '@claude'
created_date: '2026-01-06 16:25'
updated_date: '2026-01-06 16:27'
labels:
  - ui
  - ux
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The current animation on the 'Roll Lunch' button is too fast and feels jarring. Since the restaurant name appears beneath the button instantly, the animation adds no value and creates a poor user experience.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Clicking 'Roll Lunch' button no longer triggers any animation on the button itself
- [x] #2 Restaurant result still appears immediately beneath the button
- [x] #3 Button remains visually responsive (hover/active states preserved)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Remove x-show loading states from button spans
2. Remove :disabled="loading" from button
3. Keep the loading state variable for error handling but don't use it for visual changes
4. Test that button still works and result appears
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Removed loading state visual feedback from Roll Lunch button in index.html:
- Removed `:disabled="loading"` binding
- Removed x-show conditionals that toggled between "Roll Lunch" and "Rolling..." text
- Button now displays static "Roll Lunch" text
- CSS hover/active states preserved (handled by basecoat .btn class)
<!-- SECTION:NOTES:END -->
