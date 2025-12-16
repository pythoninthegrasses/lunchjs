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

```bash
# Install iOS targets
rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim

# Development (macOS)
cd src-tauri && npx tauri dev

# Development (iOS simulator)
cd src-tauri && npx tauri ios dev

# Build (macOS)
cd src-tauri && npx tauri build

# Build (iOS)
cd src-tauri && npx tauri ios build
```

## Platforms

- macOS (desktop)
- iOS (mobile)
