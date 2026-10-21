# Release Please

This document covers how versions are bumped and released with Release Please, which files it edits, and the quirks already worked out. iOS lane behavior is in [fastlane.md](fastlane.md).

---

## Overview

Release Please reads conventional commits on `main` and keeps one open release PR (`chore(main): release X.Y.Z`) up to date. Merging that PR tags the release, creates the GitHub release, and calls the iOS build workflow. The Release Please workflow ignores pushes that only touch `*.md`, `docs/**`, `backlog/**`, `LICENSE*`, or `.github/*.md`.

| File | Purpose |
|------|---------|
| `release-please-config.json` | Release type (`simple`), changelog path, `extra-files` to bump |
| `.release-please-manifest.json` | Last released version (`"." : "0.16.0"` at time of writing) |
| `.github/workflows/release-please.yml` | Runs `googleapis/release-please-action@v4` on pushes to `main`, then calls `build-ios-app.yml` when a release is created |
| `CHANGELOG.md` | Generated, do not edit by hand |

Commit types that appear in the changelog and affect the bump: `feat` (minor), `fix` (patch), `BREAKING CHANGE` or `!` (major). Types like `docs`, `chore`, `ci`, `build`, and `test` do not appear. Use `ci` or `build` for tooling changes that should not show up in release notes.

---

## Files Bumped on Release

The version lives in four places and all must move together:

| File | How it is bumped |
|------|------------------|
| `.release-please-manifest.json` | Release Please itself |
| `src-tauri/Cargo.toml` | `extra-files`, toml, `$.package.version` |
| `src-tauri/Cargo.lock` | `extra-files`, toml, `$.package[?(@.name.value=='lunch')].version` |
| `src-tauri/tauri.conf.json` | `extra-files`, json, `$.version` |

`Cargo.lock` was added to `extra-files` after the 0.16.0 release, where it needed a manual follow-up bump commit. `package.json` files in this repo have no `version` field and are not tracked.

The fastlane lanes read the app version from `src-tauri/Cargo.toml` (`get_app_version` in `fastlane/Fastfile`), so a TestFlight build is labeled with the last released version until the release PR merges. Builds made between releases carry the old version number even if they contain newer commits.

---

## The Cargo.lock Selector

The selector is `$.package[?(@.name.value=='lunch')].version`, not `@.name=='lunch'`. Release Please's TOML parser wraps every parsed value as `{start, end, value}` so it can edit the text in place. A filter on `@.name` compares an object to a string and silently matches nothing, and the updater logs `No entries modified` and leaves the version unchanged. This depends on the tagged-value parser in `release-please/build/src/util/toml-edit.js`, so re-check it after a major Release Please upgrade.

### Testing the extra-files config

The updaters can be exercised locally without opening a PR. Install `release-please` in a scratch directory, then for each entry in `extra-files` instantiate `GenericToml` (toml) or `GenericJson` (json) with the entry's `jsonpath` and `Version.parse('0.17.0')`, call `updateContent` on the file's text, and assert:

- the `lunch` entry in `Cargo.lock` changes from the current version to the new one
- the line count is unchanged and exactly one line differs
- `Cargo.toml` and `tauri.conf.json` still update

Require the updaters from `node_modules/release-please/build/src/updaters/generic-toml` and `generic-json`, and `Version` from `build/src/version`. Run it from the scratch directory, not from the repo.

The authoritative check is the release PR itself: after the next push to `main`, PR files should include `src-tauri/Cargo.lock` alongside the manifest, `CHANGELOG.md`, `Cargo.toml`, and `tauri.conf.json`.

---

## CI

`build-ios-app.yml` has no `push` trigger. It runs on:

- `workflow_call`, from `release-please.yml` after a release is created
- `workflow_dispatch`, manually
- `pull_request` to `main` when iOS-relevant paths change (`src-tauri/**` except Android, `fastlane/**`, `Taskfile.yml`, `taskfiles/**`, `Gemfile*`, `package*.json`, the workflow, and the setup action)

Because Release Please pushes to its release branch, every update to the release PR that touches those paths triggers an iOS build, and that build runs `task ios:testflight`, which uploads to TestFlight. Pushing to `main` itself does not start the iOS workflow; it starts Release Please, which updates the PR, which starts the iOS workflow.

The workflow runs on the self-hosted runner `mini`. On 2026-10-21 a PR-triggered run failed in the `Setup Tauri build environment` step with `node: command not found` (exit 127) because `node` was not on the runner's PATH, before reaching fastlane. This is a runner environment problem, not a repo problem. An earlier run in June 2026 was cancelled after 24 hours, which points to the runner being offline.

---

## Releasing

1. Merge conventional commits to `main`. Release Please updates the open release PR.
2. Review the release PR: changelog entries, and files changed (manifest, `CHANGELOG.md`, `Cargo.toml`, `Cargo.lock`, `tauri.conf.json`).
3. Merge the PR. Release Please tags `vX.Y.Z`, creates the GitHub release, and calls `build-ios-app.yml`.
4. After the iOS build, builds appear in TestFlight groups per [fastlane.md](fastlane.md#testflight-groups).
