# LunchJS

Cross-platform restaurant selector app built with Tauri + Alpine.js.

Hats off to the OG Python version by [@zookinheimer](https://github.com/zookinheimer/lunch) 🎩

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

### Running the app

#### Using Taskfile (recommended)

```bash
# Development (macOS)
task dev

# Development (iOS simulator)
task ios

# Development (physical iOS device)
task ios:device

# Build (macOS - current architecture)
task build

# Build (macOS - Apple Silicon)
task build:arm64

# Build (macOS - Intel)
task build:x64

# Build (iOS for App Store)
task ios:build

# Upload to TestFlight
task ios:testflight

# Upload to App Store
task ios:release

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
```

## Platforms

- macOS (desktop)
- iOS (mobile)
