# CI

This document covers the self-hosted runner environment, what triggers each workflow, the secrets and variables in use, and how to verify CI changes before pushing. Platform details are in [ios.md](ios.md), [android.md](android.md), [fastlane.md](fastlane.md), and [release-please.md](release-please.md).

---

## Self-hosted Runner (`mini`)

The iOS, Android, and distribute workflows run on the self-hosted runner `mini`. The runner service does not load a login shell: its stored PATH (`~/actions-runner-pythoninthegrasses/.path`) is exactly `/usr/bin:/bin:/usr/sbin:/sbin`. Nothing from mise, Homebrew, rustup, or the JDK is on it.

| Tool | Where it lives on `mini` | How CI gets it |
|------|--------------------------|----------------|
| node, npm | mise, `~/.local/share/mise/installs/node/24.12.0/bin` (version from `.tool-versions`) | `Add Homebrew and mise Node.js to PATH` step in `.github/actions/setup-tauri-build` |
| brew, xcodegen | `/opt/homebrew/bin` | same step |
| JDK 21 | `/opt/homebrew/opt/openjdk@21` | `Add JDK to PATH` step in `build-android-app.yml` |
| ruby | installed per run | `ruby/setup-ruby` |
| deno, task | installed per run | `denoland/setup-deno`, `go-task/setup-task` |
| cargo, rustup | `~/.cargo/bin` | `dtolnay/rust-toolchain` |
| Android SDK and NDK | `/opt/homebrew/share/android-commandlinetools` (NDK `28.2.13676358`) | `ANDROID_HOME`, `NDK_HOME` job env in `build-android-app.yml` |
| Xcode | `/Applications/Xcode.app`, selected with `xcode-select` | see [ios.md](ios.md#known-issues) |

Rules that came out of debugging this:

- Add to PATH by appending to `$GITHUB_PATH`. Entries are prepended, so write the entry that must win last (mise node goes after Homebrew, whose own node would otherwise shadow it).
- Never set `PATH: ${{ env.X }}/bin:${{ env.PATH }}` in a step `env` block. The `env` context only holds variables the workflow set, so `env.PATH` is empty and the step runs without `/usr/bin` (`spawn sh ENOENT`). See [android.md](android.md#cicd-github-actions).
- The pinned `@tauri-apps/cli` in `package.json`, `package-lock.json`, and `deno.lock` must agree: the setup action runs `deno install` and then `npm install <native module> --no-save`, and the second step reconciles `node_modules` to `package-lock.json`. See [android.md](android.md#error-a-value-is-required-for---aab-aab).
- The `task` build tasks skip themselves when their sources' checksum is unchanged, and the job still finishes green. See [fastlane.md](fastlane.md#gotchas).

---

## What Runs When

| Event | Workflows |
|-------|-----------|
| Push to `main` | `Release Please`, `Test Suite`. The build workflows have no `push` trigger. |
| Release PR created or updated | `Build iOS App` (internal TestFlight only), `Build Android App` (Play `alpha`), `Test Suite`, when the PR touches their paths |
| Release PR merged | `Release Please` tags and releases, then calls `Build iOS App` (external `uat` submission). It does not call Android. |
| Every 6 hours | `Distribute TestFlight` retries the external submission |
| `workflow_dispatch` | `Build iOS App`, `Build Android App`, `Distribute TestFlight` |
| Push to a non-`main` branch | Nothing |

A push to `main` with a releasable commit (`feat` or `fix`) therefore leads to a build through the release PR, not directly. Docs-only pushes are ignored by Release Please.

---

## Secrets and Variables

All names referenced by the workflows exist on the repository. Secret values cannot be read back, so "proven" means a CI run used them successfully.

| Name | Kind | Used by | Proven in CI |
|------|------|---------|--------------|
| `APP_STORE_CONNECT_API_KEY_KEY_ID`, `_ISSUER_ID`, `_KEY` | secret | iOS, Distribute | yes |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL` | secret | iOS (match certificates on MinIO) | yes |
| `MATCH_PASSWORD` | secret | iOS | yes |
| `TESTFLIGHT_REVIEW_PHONE`, `TESTFLIGHT_REVIEW_EMAIL`, `TESTFLIGHT_FEEDBACK_EMAIL` | secret | iOS, Distribute | yes |
| `TESTFLIGHT_REVIEW_FIRST_NAME`, `TESTFLIGHT_REVIEW_LAST_NAME`, `TESTFLIGHT_GROUPS` | variable | iOS, Distribute | yes |
| `ANDROID_KEY_BASE64`, `ANDROID_KEY_PASSWORD`, `GOOGLE_PLAY_JSON_KEY` | secret | Android | yes (2026-10-21, after being reset from `.env`) |
| `GOOGLE_PLAY_TRACK` | variable | Android | yes, `alpha` |
| `RELEASE_PLEASE_TOKEN` | secret | Release Please | yes |

List what exists with `gh secret list` and `gh variable list`. How the Android secrets were set is in [android.md](android.md#cicd-github-actions).

---

## Verifying CI Changes Before Pushing

Pushing `main` starts real builds and uploads, so verify first. In order of cost:

1. **Validate and unit-test pieces locally.** `yq` the workflow, run the extracted `run:` script of a step under `env -i`, and run the fastlane lane against the real services where it is safe. The `distribute` lane and an internal-only run are safe to repeat.
2. **`act` for step logic.** Limits and the trimmed-action recipe are in [release-please.md](release-please.md#testing-workflows-locally-with-act). `act` cannot load `node24` actions, leaves `runner.environment` empty, and fills `env.PATH` from the host, so it cannot reproduce the `env.PATH` failure.
3. **Run the real commands on `mini`.** This is the only place that has the runner's real PATH and tools:
   - `rsync` the repo to a temp directory on `mini` (exclude `.git`, `vendor`, `node_modules`, `src-tauri/target`, `.env`), and copy secrets into that temp directory only. Delete it afterwards.
   - Run a script with `env -i` and the runner PATH plus the entries the workflow adds, detached with `nohup` and a log file, and poll the log. An SSH drop would otherwise kill the build.
   - Clone the runner workspace's `src-tauri/target` into the copy with `cp -cR` (APFS copy-on-write) so host dependencies are not recompiled. Do not build in the runner's own workspace.
   - To test Android signing without the real key, create a throwaway keystore with `keytool` and a `keystore.properties` with the same keys (`keyAlias`, `password`, `storeFile`).
   - Pitfalls: mise's Ruby has a rubygems plugin that runs `mise reshim`, so `~/.local/bin` must be on PATH for `bundle install`; some mise deno version directories are empty, so check `bin/deno` exists; `rg` is a mise tool and is not on a plain SSH PATH.
4. **Dispatch from a branch.** A `workflow_dispatch` workflow that already exists on `main` can run against an unmerged branch: `git push origin HEAD:refs/heads/<branch>`, then `gh workflow run <file> --ref <branch>`. Branch pushes start no workflows, so this avoids Release Please and the release PR chain. Delete the branch afterwards. A brand-new workflow file cannot be dispatched until it is on `main`.
5. **Push `main`.** Expect the chain in the table above.

Always check a run's real result, not a pipe's: `task`'s exit code is hidden by `| tail`, and a green CI run can still be a skipped build (look for the upload line in the log).
