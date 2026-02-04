# LunchJS

<div align="center">
<pre>
██╗     ██╗   ██╗███╗   ██╗ ██████╗██╗  ██╗
██║     ██║   ██║████╗  ██║██╔════╝██║  ██║
██║     ██║   ██║██╔██╗ ██║██║     ███████║
██║     ██║   ██║██║╚██╗██║██║     ██╔══██║
███████╗╚██████╔╝██║ ╚████║╚██████╗██║  ██║
╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝
</pre>
</div>

Cross-platform restaurant selector app built with Tauri + Alpine.js.

Hats off to the OG Python version by [@zookinheimer](https://github.com/zookinheimer/lunch) 🎩

## Demo

<div align="center">
  <img src="static/demo.avif" alt="Demo AVIF" />
</div>

## Architecture

See [docs/architecture.md](docs/architecture.md) for the full migration plan from FastHTML to Alpine.js + Tauri.

## Structure

```
lunchjs/
├── docs/
│   └── architecture.md    # Migration plan and architecture docs
├── src-tauri/
│   ├── src/               # Rust backend (Tauri commands)
│   │   ├── main.rs
│   │   ├── lib.rs
│   │   └── db.rs
│   ├── dist/              # Static frontend (Alpine.js)
│   │   ├── index.html
│   │   ├── add.html
│   │   ├── list.html
│   │   ├── settings.html
│   │   ├── app.css
│   │   ├── basecoat.min.css
│   │   ├── logo.png
│   │   ├── fonts/
│   │   └── js/
│   │       ├── alpine.min.js
│   │       ├── app.js
│   │       └── basecoat/
│   ├── icons/
│   ├── tauri.conf.json
│   └── Cargo.toml
└── lunch_list.csv         # Seed data
```

## Development

### Prerequisites

1. **Install Node.js and Rust**:
   ```bash
   mise install
   ```

   If you encounter GPG signature verification errors, import the Node.js release key:
   ```bash
   gpg --keyserver hkps://keys.openpgp.org --recv-keys 86C8D74642E67846F8E120284DAA80D1E737BC9F
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install iOS targets** (for mobile development):
   ```bash
   rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
   ```

4. **Install ios-deploy** (for physical device deployment):
   ```bash
   brew install ios-deploy
   ```

5. **Setup iOS Simulator** (for simulator development/testing):
   - Simulators are automatically available in Xcode
   - Default simulator: **iPhone 13 mini** (iOS 18.6)
   - To add more simulators:
     - Open Xcode → Window → Devices and Simulators
     - Click **+** (Plus sign) at bottom left
     - Select **Device Type** and **OS Version**
     - Click **Create**
   - To change the default simulator, edit `IOS_SIM_DEVICE` in `.env`

6. **Configure Apple Developer account** (for iOS device builds only):
   - **Not required** for simulator builds (`task ios:dev` or `task ios:build:sim`)
   - **Required** for device builds and App Store distribution
   - Open Xcode → Settings → Apple Accounts → Add your Apple ID
   - Connect an iOS device or manually add device IDs at [developer.apple.com/account](https://developer.apple.com/account/)
   - The Taskfile will automatically initialize the iOS project when needed

### Running the app

#### Using Taskfile (recommended)

```bash
# Development (macOS) - uses nightly + parallel frontend (~10% faster)
task dev

# Development (macOS) - stable toolchain fallback
task tauri:dev:stable

# Development (iOS simulator)
task ios

# Development (physical iOS device)
task ios:run:device

# Run tests
task test

# Build (macOS - current architecture)
task build

# Build (macOS - Apple Silicon)
task build:arm64

# Build (macOS - Intel)
task build:x64

# Build (iOS for App Store - requires device/provisioning)
task ios:build

# Build (iOS Simulator - no provisioning required)
task ios:build:sim

# Sync code signing certificates
task certs

# Upload to TestFlight
task ios:testflight

# Upload to App Store
task ios:release

# Development (Android emulator)
task android:dev

# Development (physical Android device - hot-reload)
task android:dev:device

# Build and install on physical Android device (standalone APK)
task android:run:device

# Build (Android APK for sideloading)
task android:build:apk

# Build (Android AAB for Google Play)
task android:build:aab

# Upload to Google Play Store beta track
task android:testflight

# Upload to Google Play Store production
task android:release

# Clean build artifacts
task clean
```

#### Using npm/npx directly

```bash
# Development (macOS)
npx tauri dev

# Development (iOS simulator)
cd src-tauri && npx tauri ios dev

# Build (macOS)
npx tauri build

# Build (iOS)
cd src-tauri && npx tauri ios build

# Development (Android emulator)
cd src-tauri && npx tauri android dev

# Build (Android)
cd src-tauri && npx tauri android build
```

## Platforms

- macOS (desktop)
- iOS (mobile)
- Android (mobile)
