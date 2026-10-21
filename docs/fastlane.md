# Fastlane & TestFlight

This document covers the iOS lanes in `fastlane/Fastfile`, how builds reach TestFlight groups, and the App Store Connect behaviors already worked out. Xcode toolchain problems are in [ios.md](ios.md).

---

## Lanes

| Lane | Task | Purpose |
|------|------|---------|
| `ios certificates` | `task ios:certificates` | Sync signing certificates with `match` |
| `ios build_only` | | Build the IPA without uploading |
| `ios beta` | `task ios:testflight` | Build, upload, wait for processing, distribute to TestFlight groups |
| `ios distribute` | | Distribute an already uploaded build without rebuilding |
| `ios release` | `task ios:release` | Upload to the App Store |

Build numbers are seconds since 2024-01-01 UTC (`get_next_build_number`), so every `beta` run produces a new build.

---

## TestFlight Groups

| Group | Type | How it receives builds |
|-------|------|------------------------|
| `dev` | Internal, `has_access_to_all_builds=true` | Automatically, as soon as processing finishes |
| `uat` | External | Assigned by the lane, requires Beta App Review |

Decisions that should not be relitigated:

- `dev` is NOT listed in `TESTFLIGHT_GROUPS`. App Store Connect rejects manual assignment to an internal group with automatic distribution (`Builds cannot be assigned to this internal group. - Cannot add internal group to a build.`). Only external groups are assigned.
- The `beta` lane uses `skip_waiting_for_build_processing: false`. With `true`, fastlane silently skips all distribution and the changelog. The cost is roughly 13 minutes of waiting for processing, on CI as well.
- `uat` builds are not installable until Apple approves the beta review. The first build of a version waits for review. Later builds are usually approved automatically.

To inspect group flags and a build's state, use spaceship with the App Store Connect API key (`Spaceship::ConnectAPI::App.find("com.lunch.desktop").get_beta_groups`, then `fetch_builds` per group).

---

## Beta App Information

Submitting to an external group requires beta app information. The lane supplies it through `testflight_distribution_options`:

- `localized_app_info` with an explicit `en-US` entry (description and feedback email). Using `beta_app_description` / `beta_app_feedback_email` alone reports success but leaves no localization on the app, and submission then fails with `Beta App Description is missing`. The explicit locale creates the localization.
- `beta_app_review_info` with the review contact (name, phone, email) and `demo_account_required: false`. The app has no authentication.
- `changelog` ("What to Test"), taken from `TESTFLIGHT_CHANGELOG` or the last 10 commit subjects.

The repo is public, so the review contact comes from environment variables and is never committed.

---

## Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| `TESTFLIGHT_FEEDBACK_EMAIL` | yes | Tester feedback address |
| `TESTFLIGHT_REVIEW_FIRST_NAME` | yes | Beta review contact |
| `TESTFLIGHT_REVIEW_LAST_NAME` | yes | Beta review contact |
| `TESTFLIGHT_REVIEW_PHONE` | yes | Beta review contact |
| `TESTFLIGHT_REVIEW_EMAIL` | yes | Beta review contact |
| `TESTFLIGHT_GROUPS` | no | Comma-separated group names, default `uat` |
| `TESTFLIGHT_CHANGELOG` | no | Overrides the git-log changelog |
| `BUILD_NUMBER` | no | `distribute` lane only, defaults to the latest build |

The `beta` lane resolves these first, so missing variables fail before the long build. Add the required ones to `.env` for local runs.

### GitHub Actions Configuration

Set on the repository and passed to the `Build and upload to TestFlight` step in `.github/workflows/build-ios-app.yml`:

- Secrets: `TESTFLIGHT_REVIEW_PHONE`, `TESTFLIGHT_REVIEW_EMAIL`, `TESTFLIGHT_FEEDBACK_EMAIL`
- Variables: `TESTFLIGHT_REVIEW_FIRST_NAME`, `TESTFLIGHT_REVIEW_LAST_NAME`, `TESTFLIGHT_GROUPS`

---

## Distributing an Existing Build

```bash
set -a; . ./.env; set +a
BUILD_NUMBER=88534888 bundle exec fastlane ios distribute
```

The lane needs `app_platform: "ios"` because there is no IPA to infer it from. Without it pilot prompts, and fastlane crashes with `Could not retrieve response as fastlane runs in non-interactive mode`.

---

## Gotchas

- `task` loads `.env` (`dotenv: ['.env']`). Running `bundle exec fastlane` directly does not, so `api_key` returns nil and fastlane falls back to interactive Apple ID login.
- A `task` run's exit status is the real result. Piping it through `tail` hides failures behind the pipe's exit code.
- `bundle exec fastlane` fails with `Could not find nkf-0.2.0, sysrandom-1.0.5, ...` when vendored gems lack native extensions. Run `bundle install`.
