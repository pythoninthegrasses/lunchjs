---
id: TASK-040
title: Add actionlint and upgrade act
status: To Do
assignee: []
created_date: '2026-10-22T14:56:00Z'
labels:
  - ci
  - tooling
dependencies: []
references:
  - .tool-versions
  - docs/ci.md
priority: low
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
timecard runs actionlint with a config file and pins act 0.2.89. lunchjs has no workflow linting and uses act 0.2.80, which cannot load node24 actions (setup-ruby, setup-deno, actions/cache v5), so the full composite action cannot be tested locally (docs/release-please.md, act section).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 actionlint is pinned in .tool-versions with a .github/actionlint.yaml and runs as a task or pre-commit hook
- [ ] #2 All workflows and composite actions pass actionlint
- [ ] #3 act is upgraded and retested against the setup-tauri-build action, and whether node24 actions now load is recorded
- [ ] #4 docs/ci.md and docs/release-please.md act sections reflect the new limits
<!-- AC:END -->
