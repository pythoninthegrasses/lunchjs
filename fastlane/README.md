fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios certificates

```sh
[bundle exec] fastlane ios certificates
```

Sync code signing certificates

### ios build_only

```sh
[bundle exec] fastlane ios build_only
```

Build only (no upload) - for testing

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Build and upload to TestFlight

### ios release

```sh
[bundle exec] fastlane ios release
```

Upload to App Store

----


## Android

### android build

```sh
[bundle exec] fastlane android build
```

Build Android release (AAB and APK)

### android beta

```sh
[bundle exec] fastlane android beta
```

Build and upload to Google Play Store beta track

### android internal

```sh
[bundle exec] fastlane android internal
```

Build and upload to Google Play Store internal testing track

### android release

```sh
[bundle exec] fastlane android release
```

Upload to Google Play Store production

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
