# Android Build & Release

This document covers building and releasing LunchJS for Android using Task and Fastlane.

---

## Prerequisites

### Environment Variables

Add to `~/.bash_profile` or `~/.zshrc`:

```bash
# Java
export PATH="/opt/homebrew/opt/openjdk@24/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@24"

# Android SDK
export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

# Android NDK
export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/28.2.13676358"
```

### Rust Targets

```bash
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

---

## Project Configuration

| Setting | Value |
|---------|-------|
| Application ID | `com.lunch.app` (used for install/uninstall) |
| Namespace | `com.lunch.desktop` (used for class paths) |
| Min SDK | 24 (Android 7.0) |
| Target SDK | 36 |
| Build location | `src-tauri/gen/android/` |

---

## Development

### Emulator

```bash
# Run on Android emulator (default: pixel_7)
task android:dev

# Configure emulator keyboard settings
task android:emulator:setup
```

### Physical Device

```bash
# Hot-reload development on connected device
task android:dev:device

# Build release APK, sign with debug key, install on device
task android:run:device
```

---

## Building

### Debug Builds

```bash
# Build APK for testing/sideloading
task android:build:apk
```

Output: `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk`

### Release Builds

```bash
# Build signed AAB for Google Play
task android:build:aab
```

Output: `src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab`

### Full Distribution Build

```bash
# Build both APK and AAB
task android:build
```

---

## Release Signing

### Create Keystore (One-Time Setup)

```bash
λ keytool -genkey -v -keystore ~/lunchjs-release.jks \
    -keyalg RSA -keysize 2048 -validity 10000 -alias lunch \
    -dname "CN=Lunch App, OU=Mobile, O=LunchJS, L=Unknown, ST=Unknown, C=US"
Enter keystore password:  
Re-enter new password: 
Generating 2048-bit RSA key pair and self-signed certificate (SHA384withRSA) with a validity of 10,000 days
        for: CN=Lunch App, OU=Mobile, O=LunchJS, L=Unknown, ST=Unknown, C=US
[Storing ~/lunchjs-release.jks]
```

### Configure Signing

1. Add to `.env`:
   ```
   ANDROID_KEYSTORE_PASSWORD=<your-password>
   ANDROID_KEYSTORE_PATH=/path/to/lunchjs-release.jks
   ```

2. Generate `keystore.properties`:
   ```bash
   task android:keystore:setup
   ```

This creates `src-tauri/gen/android/keystore.properties` with your credentials.

### Verify Signature

```bash
jarsigner -verify src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab
```

---

## Google Play Release

### Prerequisites

1. Create app in [Google Play Console](https://play.google.com/console) with package name `com.lunch.app`
2. Create service account for API access:
   - Go to Setup > API access > Service accounts
   - Create new service account with "Release Manager" permissions
   - Download JSON key file
3. Add to `.env`:
   ```
   SUPPLY_JSON_KEY=/path/to/service-account.json
   ```

### First Release (Manual)

The first AAB must be uploaded manually through Google Play Console:

1. Build signed AAB: `task android:build:aab`
2. Go to Play Console > Release > Production > Create new release
3. Upload `app-universal-release.aab`
4. Complete store listing, content rating, and pricing

### Automated Releases

After the first manual upload, use Fastlane for subsequent releases:

```bash
# Upload to internal testing track
task android:internal

# Upload to beta track
task android:testflight

# Upload to production
task android:release
```

### CI/CD (GitHub Actions)

The workflow `.github/workflows/build-android-app.yml` automates builds on PR and release.

**Required GitHub Secrets:**

| Secret | Description | How to Generate |
|--------|-------------|-----------------|
| `ANDROID_KEY_PASSWORD` | Keystore password | Same as `ANDROID_KEYSTORE_PASSWORD` in `.env` |
| `ANDROID_KEY_BASE64` | Base64-encoded keystore | `base64 -i ~/lunchjs-release.jks \| tr -d '\n'` |
| `GOOGLE_PLAY_JSON_KEY` | Service account JSON contents | Copy contents of service account JSON file |

The key alias `lunch` is hardcoded in the workflow.

---

## Fastlane Lanes

| Lane | Description | Task Command |
|------|-------------|--------------|
| `android build` | Build AAB and APK | `bundle exec fastlane android build` |
| `android internal` | Upload to internal testing | `task android:internal` |
| `android beta` | Upload to beta track | `task android:testflight` |
| `android release` | Upload to production | `task android:release` |

All lanes automatically:
- Update version from `Cargo.toml`
- Generate unique build number (seconds since 2024-01-01)
- Build using Tauri CLI
- Upload to specified Play Store track

---

## Task Commands Reference

| Command | Description |
|---------|-------------|
| `task android:init` | Initialize Android project |
| `task android:dev` | Run on emulator |
| `task android:dev:device` | Run on device (hot-reload) |
| `task android:run:device` | Build and install release APK on device |
| `task android:run:emulator` | Build and install release APK on emulator |
| `task android:build` | Build APK and AAB |
| `task android:build:apk` | Build APK only |
| `task android:build:aab` | Build signed AAB |
| `task android:keystore:setup` | Generate keystore.properties from env vars |
| `task android:internal` | Upload to internal testing |
| `task android:testflight` | Upload to beta track |
| `task android:release` | Upload to production |
| `task android:clean` | Clean build artifacts |
| `task android:emulator:keyboard` | Enable hardware keyboard for emulator |
| `task android:emulator:setup` | Full emulator configuration |

---

## Build Artifacts

| Type | Path |
|------|------|
| Release APK (with keystore) | `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk` |
| Unsigned APK (no keystore) | `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk` |
| Signed APK (debug key) | `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-signed.apk` |
| Signed AAB | `src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab` |

Note: If `keystore.properties` is configured, the build produces a signed `app-universal-release.apk`. Without a keystore, it produces `app-universal-release-unsigned.apk` which `task android:run:emulator` signs with the debug key.

---

## Troubleshooting

### Build Fails with Signing Error

Ensure `keystore.properties` exists and contains valid paths:
```bash
task android:keystore:setup
```

### Emulator Keyboard Not Working

Run keyboard configuration:
```bash
task android:emulator:setup
```

### "Failed to request http://..." Error (devUrl Cached)

If the app shows "Failed to request http://X.X.X.X:1430/" on startup, the Rust build cache has a stale dev server URL baked in. Clean and rebuild:

```bash
# Clean Rust Android targets and Gradle cache
rm -rf src-tauri/target/aarch64-linux-android \
       src-tauri/target/armv7-linux-androideabi \
       src-tauri/target/i686-linux-android \
       src-tauri/target/x86_64-linux-android \
       src-tauri/gen/android/app/build \
       src-tauri/gen/android/.gradle

# Uninstall old app from emulator
adb -s emulator-5554 uninstall com.lunch.app

# Rebuild
task android:run:emulator
```

### Signature Mismatch (INSTALL_FAILED_UPDATE_INCOMPATIBLE)

If install fails with signature mismatch, uninstall the existing app first:

```bash
adb -s emulator-5554 uninstall com.lunch.app
```

### Black Screen / GPU Errors (EmulatedEglImage)

If emulator shows black screen with `Failed to find EmulatedEglImage` errors, fix the GPU config:

```bash
# Fix emulator GPU settings
cd ~/.android/avd/pixel_7.avd
sed -i '' 's/hw.gpu.enabled = no/hw.gpu.enabled = yes/' config.ini
sed -i '' 's/hw.gpu.mode = auto/hw.gpu.mode = host/' config.ini

# Remove corrupted snapshot
rm -rf snapshots/default_boot
```

### Full Android Clean (Nuclear Option)

```bash
task android:clean
rm -rf src-tauri/target/*-linux-android*
adb -s emulator-5554 uninstall com.lunch.app
```

### Upload Fails with Package Name Mismatch

Verify package name is `com.lunch.app` in:
- `src-tauri/gen/android/app/build.gradle.kts` (applicationId)
- Google Play Console app settings

Note: The namespace (`com.lunch.desktop`) is different from the applicationId (`com.lunch.app`).

### Version Code Too Low

Fastlane uses timestamp-based version codes. If Play Console rejects the build, wait a second and rebuild - each build gets a unique version code.

---

## File Structure

```
src-tauri/gen/android/
├── app/
│   ├── build.gradle.kts      # Package name, signing config
│   ├── src/main/java/com/lunch/desktop/
│   │   └── MainActivity.kt   # Entry point (namespace: com.lunch.desktop)
│   └── build/outputs/
│       ├── apk/              # APK builds
│       └── bundle/           # AAB builds
├── keystore.properties       # Signing credentials (gitignored)
└── keystore.properties.example
```
