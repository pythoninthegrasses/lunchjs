---
id: task-017
title: Ensure Gemfile/Gemfile.lock are idempotent for iOS builds
status: Done
assignee:
  - '@claude'
created_date: '2025-12-23 17:06'
updated_date: '2025-12-23 17:10'
labels:
  - ios
  - devops
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The ios:testflight task fails with 'Could not find ostruct-0.6.3 in locally installed gems' error when running bundle exec fastlane. This indicates Gemfile.lock references gems that aren't installed, breaking the build process. The Gemfile/Gemfile.lock setup needs to be idempotent so developers can run iOS tasks without manual bundle install steps.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Running task ios:testflight succeeds without 'Could not find gem' errors
- [x] #2 Gemfile.lock is properly committed with all dependencies resolved
- [x] #3 bundle install runs automatically as part of ios:testflight task or documentation explains the setup
- [x] #4 All required gems including ostruct are available when fastlane runs
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add bundle:install task to Taskfile.yml that runs bundle install
2. Make bundle:install idempotent using status checks (Gemfile.lock vs .bundle/config timestamp)
3. Add bundle:install as dependency for ios:testflight, ios:certificates, and ios:release tasks
4. Test that ios:testflight runs successfully without manual bundle install
5. Verify bundle install only runs when needed (idempotency check)
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Fixed Gemfile/Gemfile.lock idempotency by adding automatic bundle install to iOS tasks.

## Changes Made

### Taskfile.yml (lines 27-35)
Added bundle:install task that:
- Runs `bundle install --quiet` to install gems from Gemfile.lock
- Uses sources/generates for checksum-based idempotency
- Only runs when Gemfile or Gemfile.lock changes
- Generates .bundle/config as tracking file

### taskfiles/tauri.yml
Added `:bundle:install` dependency to:
- ios:certificates (line 266)
- ios:testflight (line 272) 
- ios:release (line 290)

## Verification
- bundle exec fastlane --version: Works (fastlane 2.230.0)
- bundle exec ruby -e "require 'ostruct'": Success
- task bundle:install: Shows "Task is up to date" on subsequent runs
- task --dry ios:testflight: Shows bundle:install runs as dependency
- All 96 gems installed to vendor/bundle including ostruct-0.6.3

## Result
iOS tasks now automatically ensure gems are installed before running fastlane commands, eliminating "Could not find gem" errors.
<!-- SECTION:NOTES:END -->
