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
| Package name | `com.lunch.app` |
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
| Unsigned APK | `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk` |
| Signed APK (debug key) | `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-signed.apk` |
| Signed AAB | `src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab` |

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

### Upload Fails with Package Name Mismatch

Verify package name is `com.lunch.app` in:
- `src-tauri/gen/android/app/build.gradle.kts` (namespace and applicationId)
- Google Play Console app settings

### Version Code Too Low

Fastlane uses timestamp-based version codes. If Play Console rejects the build, wait a second and rebuild - each build gets a unique version code.

---

## File Structure

```
src-tauri/gen/android/
├── app/
│   ├── build.gradle.kts      # Package name, signing config
│   ├── src/main/java/com/lunch/app/
│   │   └── MainActivity.kt   # Entry point
│   └── build/outputs/
│       ├── apk/              # APK builds
│       └── bundle/           # AAB builds
├── keystore.properties       # Signing credentials (gitignored)
└── keystore.properties.example
```
