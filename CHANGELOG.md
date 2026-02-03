# Changelog

## [0.14.0](https://github.com/pythoninthegrasses/lunchjs/compare/v0.13.0...v0.14.0) (2026-02-03)


### Features

* **android:** add JAVA_HOME and NDK_HOME to taskfile env ([9f3ae02](https://github.com/pythoninthegrasses/lunchjs/commit/9f3ae020176db9cee390121934b352054b4f094f))
* **android:** add setup task for installing dependencies ([1ae12f7](https://github.com/pythoninthegrasses/lunchjs/commit/1ae12f71ef6f88353fcc6e1acd59e1eac5b61af0))
* **android:** use GOOGLE_PLAY_TRACK env var for upload track ([aba2700](https://github.com/pythoninthegrasses/lunchjs/commit/aba27004c549b58e97e383e4ccdb296432dd03a0))


### Bug Fixes

* **android:** add JDK to setup task dependencies ([a342c55](https://github.com/pythoninthegrasses/lunchjs/commit/a342c5546486792ccfce334986cc45018918c4ff))
* **android:** use openjdk@21 LTS instead of [@24](https://github.com/24) ([588d161](https://github.com/pythoninthegrasses/lunchjs/commit/588d1615cc50c3ba815127725357312844e13bbc))
* **ci:** add JAVA_HOME for Android Gradle build ([c3b0437](https://github.com/pythoninthegrasses/lunchjs/commit/c3b043702753f15e2ba5b69e9b8966ce3b92c2e2))
* **fastlane:** inherit Android env vars from workflow ([1d156f1](https://github.com/pythoninthegrasses/lunchjs/commit/1d156f1af9db9dd112b5cf7b57c77fc6ccf1e836))
* **taskfile:** auto-accept Android SDK license in setup ([e560ac6](https://github.com/pythoninthegrasses/lunchjs/commit/e560ac6f9bcaaf26f02b73c15118955c4cf66bad))
* **taskfile:** make android:setup idempotent ([c99c88b](https://github.com/pythoninthegrasses/lunchjs/commit/c99c88b6022b582f8bd4cb433ba425845c5087ed))

## [0.13.0](https://github.com/pythoninthegrasses/lunchjs/compare/v0.12.0...v0.13.0) (2026-02-02)


### Features

* android version ([4d2aec5](https://github.com/pythoninthegrasses/lunchjs/commit/4d2aec543b84494aa66de99ab903936b12c1d20a))


### Bug Fixes

* **deps:** bundle renovate dependency updates ([#35](https://github.com/pythoninthegrasses/lunchjs/issues/35)) ([b0bd90e](https://github.com/pythoninthegrasses/lunchjs/commit/b0bd90e3d7bc59914abb72663d36de5214122a0a))
* **deps:** update dependency com.android.tools.build:gradle to v8.13.2 ([#25](https://github.com/pythoninthegrasses/lunchjs/issues/25)) ([516236d](https://github.com/pythoninthegrasses/lunchjs/commit/516236dc04af5e1158c89959fbe098a58d63ba0d))
* **fastlane:** restrict CI keychain to GitHub Actions only ([f5ae481](https://github.com/pythoninthegrasses/lunchjs/commit/f5ae4815968c8d0493742e2cc97a815a4244f51a))
* **ios:** cleanup CI keychain after workflow completion ([4ecfd66](https://github.com/pythoninthegrasses/lunchjs/commit/4ecfd66b795289492a772490174bcde5d73cb8c5))

## [0.12.0](https://github.com/pythoninthegrass/lunchjs/compare/v0.11.0...v0.12.0) (2026-01-06)


### Features

* **android:** add run:device task for standalone APK install ([150bd0f](https://github.com/pythoninthegrass/lunchjs/commit/150bd0ff8f5a341da89069ff0d11e329f0fce111))
* **ci:** add path filtering and fix Task cache for skip optimization ([562a000](https://github.com/pythoninthegrass/lunchjs/commit/562a00097d65441e724af85203d56db71fc96f63))
* **ci:** cache iOS build artifacts for full skip optimization ([a2c269c](https://github.com/pythoninthegrass/lunchjs/commit/a2c269c9bb29f67f48175d1081b004f52a29347b))


### Bug Fixes

* **ci:** add explicit npm ci for clean node_modules ([8d7e9e1](https://github.com/pythoninthegrass/lunchjs/commit/8d7e9e14223da0932596686aeb90a477fcb31292))
* **ci:** run tauri icon from root to find node_modules ([44e1199](https://github.com/pythoninthegrass/lunchjs/commit/44e1199e729e0940762fe6f14951c03fc109476f))
* **ci:** set RUNNER_TOOL_CACHE for self-hosted runner ([5ff61cc](https://github.com/pythoninthegrass/lunchjs/commit/5ff61cc104babea0e273b3d616226a0a363236e0))
* **ci:** simplify Homebrew deps for self-hosted runner ([5bdf64f](https://github.com/pythoninthegrass/lunchjs/commit/5bdf64f006463d72cd85d3a246115c1c52a2dc19))


### Reverts

* remove RUNNER_TOOL_CACHE (created /Users/runner instead) ([5d2c413](https://github.com/pythoninthegrass/lunchjs/commit/5d2c4132b4de6b6fbe962e8953dc703304f7183a))

## [0.11.0](https://github.com/pythoninthegrass/lunchjs/compare/v0.10.0...v0.11.0) (2026-01-06)


### Features

* android builds ([dbc7ab2](https://github.com/pythoninthegrass/lunchjs/commit/dbc7ab23a28e14d6022b6cef5cc8e90a27bc3bf8))
* seed db ([aa327da](https://github.com/pythoninthegrass/lunchjs/commit/aa327dad8036cd57a7917156e3d2d14d920c84bc))


### Bug Fixes

* **ios:** improve viewport handling and disable zoom ([88dc107](https://github.com/pythoninthegrass/lunchjs/commit/88dc107aefd663f664f8480fb092ddeab25da338))
* theme toggle location on desktop ([a2bbb9a](https://github.com/pythoninthegrass/lunchjs/commit/a2bbb9a1eaaae87a34620f8338829e99962ef338))
* theme toggle not responding ([d684a5f](https://github.com/pythoninthegrass/lunchjs/commit/d684a5fc5929728a3aff14885ec0308087cfb858))
* **ui:** remove jarring Roll Lunch button animation ([9d6ecc1](https://github.com/pythoninthegrass/lunchjs/commit/9d6ecc1763a780b7d6a226eff2c87149ab772ce1))

## [0.10.0](https://github.com/pythoninthegrass/lunchjs/compare/v0.9.2...v0.10.0) (2025-12-23)


### Features

* **ci:** add concurrency control to cancel stale builds ([9bbfd94](https://github.com/pythoninthegrass/lunchjs/commit/9bbfd94b46dd73add19b748abdb365e89ab793e4))
* **ci:** implement hybrid caching with Task fingerprinting ([b0f8b0b](https://github.com/pythoninthegrass/lunchjs/commit/b0f8b0b9ec18a7d3526d2694292a4ac0f687055e))


### Bug Fixes

* **ci:** expand homebrew cache paths for actions/cache compatibility ([2c27bc9](https://github.com/pythoninthegrass/lunchjs/commit/2c27bc97792d6c37cb4c2b4e6bd7fffd4b737ef8))
* **ci:** suppress fastlane telemetry warning ([38a5843](https://github.com/pythoninthegrass/lunchjs/commit/38a58439f1ff8f42d18f071bb96a3054a3ca6ddf))
* **deps:** update Gemfile.lock with ostruct gem ([37dac8b](https://github.com/pythoninthegrass/lunchjs/commit/37dac8b86ffce91bea89683e4a2834dc78763ec5))
* **deps:** update rust crate rusqlite to 0.38 ([#6](https://github.com/pythoninthegrass/lunchjs/issues/6)) ([4b18140](https://github.com/pythoninthegrass/lunchjs/commit/4b18140c7f2766cd1d0f944ca68814a3eae4b322))
* **ios:** track empty assets directory with .gitkeep ([9a062f5](https://github.com/pythoninthegrass/lunchjs/commit/9a062f597ddcac3e671aeebdb8df851b49b8fc22))
* **taskfile:** use bundle exec for fastlane commands ([6879aa6](https://github.com/pythoninthegrass/lunchjs/commit/6879aa611f8aeef345642c0a2eefad6f6b2a2e39))

## [0.9.2](https://github.com/pythoninthegrass/lunchjs/compare/v0.9.1...v0.9.2) (2025-12-17)


### Bug Fixes

* **deps:** update rust crate rand to 0.9 ([9e16e50](https://github.com/pythoninthegrass/lunchjs/commit/9e16e50f87df32aa1dd000e5499688e97a3a3869))
* **deps:** update rust crate rand to 0.9 ([c0b0c3b](https://github.com/pythoninthegrass/lunchjs/commit/c0b0c3b314ed6bd9452c5ade1d2dcd3aae6ab95b))
