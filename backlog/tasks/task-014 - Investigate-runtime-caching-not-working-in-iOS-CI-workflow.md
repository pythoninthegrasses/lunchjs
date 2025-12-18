---
id: task-014
title: Investigate runtime caching not working in iOS CI workflow
status: To Do
assignee: []
created_date: '2025-12-18 00:11'
labels:
  - ci
  - performance
  - github-actions
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The GitHub Actions iOS build workflow has caching configured for Ruby (bundler-cache), Node.js (npm cache), and Rust (Cargo cache), but they may not be working effectively.

## Current caching setup in `.github/workflows/build-ios-app.yml`:
- **Ruby:** `ruby/setup-ruby@v1` with `bundler-cache: true`
- **Node.js:** `actions/setup-node@v4` with `cache: 'npm'`
- **Rust/Cargo:** Manual `actions/cache@v4` for `~/.cargo/` and `src-tauri/target/`

## Investigation needed:
1. Check GitHub Actions logs for cache hit/miss status
2. Verify cache keys are stable across runs
3. Confirm cached paths exist and contain expected content
4. Check if `macos-latest` runner changes affect cache invalidation
5. Review Cargo cache - may need to exclude incremental compilation artifacts
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Ruby gems cache shows 'cache hit' in subsequent runs
- [ ] #2 Node modules cache shows 'cache hit' in subsequent runs
- [ ] #3 Cargo cache shows 'cache hit' in subsequent runs
- [ ] #4 Build times improve on cache hits vs cold builds
<!-- AC:END -->
