# FastHTML + Tauri → Alpine.js + Tauri Migration Plan

## Goal

Migrate from FastHTML (Python sidecar) to Alpine.js + Tauri (Rust backend) for cross-platform support (macOS + iOS) with minimal Rust code.

---

## Architecture Comparison

| Component | Current (FastHTML) | Target (Alpine.js + Tauri) |
|-----------|-------------------|----------------------------|
| Frontend Framework | FastHTML (server-rendered) | Alpine.js (client-side) |
| Backend | Python + uvicorn | Rust Tauri commands |
| Database | Python `sqlite3` | Rust `rusqlite` |
| Reactivity | HTMX (`hx-post`, `hx-target`) | Alpine.js (`x-data`, `@click`) |
| Communication | HTTP localhost:8080 | Tauri IPC (`invoke()`) |
| Build Process | PEX SCIE + Tauri | Tauri only |
| iOS Support | ❌ (sidecar blocked) | ✅ (native) |

---

## Current File Structure

From the python [lunch repo](https://github.com/pythoninthegrass/lunch)

```
app/
├── main.py                # FastHTML server (410 lines) - routes + views
├── backend/
│   ├── db.py              # SQLite operations (423 lines)
│   └── service.py         # Business logic (187 lines)
├── static/
│   ├── app.css            # Custom styles (256 lines)
│   ├── basecoat.min.css   # UI framework
│   ├── logo.png           # App logo
│   ├── fonts/             # FontAwesome
│   └── js/
│       ├── htmx.min.js    # HTMX library
│       └── basecoat/      # Basecoat JS
src-tauri/
├── src/
│   ├── main.rs            # Entry point
│   └── lib.rs             # Sidecar spawning (104 lines)
├── tauri.conf.json        # Config with externalBin
└── bin/main               # PEX sidecar binary (31MB)
```

---

## Target File Structure

```
src-tauri/
├── src/
│   ├── main.rs            # Entry point (unchanged)
│   ├── lib.rs             # Tauri commands (simplified)
│   └── db.rs              # NEW: Rust SQLite module
├── dist/                  # NEW: Static frontend
│   ├── index.html         # Home page
│   ├── add.html           # Add restaurant page
│   ├── list.html          # Restaurant list page
│   ├── settings.html      # Settings page
│   ├── app.css            # Copied from app/static/
│   ├── basecoat.min.css   # Copied
│   ├── logo.png           # Copied
│   ├── fonts/             # Copied
│   └── js/
│       ├── alpine.min.js  # NEW: Alpine.js (~15KB)
│       ├── app.js         # NEW: Shared app logic
│       └── basecoat/      # Copied
├── tauri.conf.json        # Updated: remove externalBin
└── Cargo.toml             # Add rusqlite dependency
```

---

## Migration Mapping

### 1. FastHTML Routes → Static HTML Pages

| FastHTML Route | Static HTML File | Alpine.js Component |
|----------------|------------------|---------------------|
| `GET /` | `dist/index.html` | Home view with roll button |
| `GET /add` | `dist/add.html` | Add restaurant form |
| `GET /list` | `dist/list.html` | Restaurant list with delete |
| `GET /settings` | `dist/settings.html` | Theme settings |

### 2. HTMX Attributes → Alpine.js Directives

| HTMX (Current) | Alpine.js (Target) |
|----------------|-------------------|
| `hx-post="/roll"` | `@click="rollLunch()"` |
| `hx-target="#result"` | `x-text="result"` |
| `hx-include="[name='option']"` | `x-model="category"` |
| `hx-swap="innerHTML"` | Automatic with Alpine reactivity |

### 3. Python DB Functions → Rust Tauri Commands

| Python Function (`db.py`) | Rust Command | Lines |
|---------------------------|--------------|-------|
| `create_db_and_tables()` | `init_database()` (called on app start) | 48-110 |
| `get_all_restaurants()` | `list_restaurants()` | 113-126 |
| `get_restaurants(option)` | `list_restaurants_by_category(category)` | 129-145 |
| `add_restaurant_to_db(name, option)` | `add_restaurant(name, category)` | 156-173 |
| `delete_restaurant_from_db(name)` | `delete_restaurant(name)` | 176-194 |
| `calculate_lunch(option)` | `roll_lunch(category)` | 231-302 |
| `add_to_recent_lunch(name)` | Internal to `roll_lunch` | 197-228 |

---

## Detailed Component Migrations

### Home View (`app/main.py` lines 181-211 → `dist/index.html`)

**Current FastHTML:**
```python
def home_view(result=None):
    return Div(
        Div(
            theme_toggle_btn(),
            Img(src="logo.png", cls="banner-img"),
            cls="logo-container",
        ),
        Div(
            Label(
                Input(type="radio", name="option", value="cheap", id="cheap"),
                " Cheap",
                cls="radio-label",
            ),
            Label(
                Input(type="radio", name="option", value="normal", id="normal", checked=True),
                " Normal",
                cls="radio-label",
            ),
            cls="radio-group",
        ),
        Button(
            "Roll Lunch",
            hx_post="/roll",
            hx_include="[name='option']",
            hx_target="#result",
            cls="btn",
        ),
        Div(result or "", id="result", cls="text-center text-xl font-semibold"),
        cls="text-center home-content",
    )
```

**Target Alpine.js:**
```html
<!-- dist/index.html -->
<div x-data="homeView()" class="text-center home-content">
  <div class="logo-container">
    <div class="theme-toggle" @click="toggleTheme()">
      <i class="fas fa-sun sun-icon"></i>
      <i class="fas fa-moon moon-icon"></i>
    </div>
    <img src="logo.png" class="banner-img">
  </div>

  <div class="radio-group">
    <label class="radio-label">
      <input type="radio" x-model="category" value="cheap"> Cheap
    </label>
    <label class="radio-label">
      <input type="radio" x-model="category" value="normal" checked> Normal
    </label>
  </div>

  <button class="btn" @click="roll()" :disabled="loading">
    <span x-show="!loading">Roll Lunch</span>
    <span x-show="loading">Rolling...</span>
  </button>

  <div id="result" class="text-center text-xl font-semibold" x-text="result"></div>
</div>

<script>
function homeView() {
  return {
    category: 'normal',
    result: '',
    loading: false,

    async roll() {
      this.loading = true;
      try {
        const restaurant = await window.__TAURI__.core.invoke('roll_lunch', {
          category: this.category
        });
        this.result = restaurant.name;
      } catch (e) {
        this.result = 'No restaurants found!';
      }
      this.loading = false;
    }
  }
}
</script>
```

### Add View (`app/main.py` lines 214-247 → `dist/add.html`)

**Current FastHTML:**
```python
def add_view(message=None):
    return Div(
        H1("Add Restaurant", cls="text-2xl font-bold text-center"),
        Form(
            Input(name="name", placeholder="", required=True, autofocus=True, cls="form-input"),
            Div(
                Label(Input(type="radio", name="option", value="cheap"), " Cheap", cls="radio-label"),
                Label(Input(type="radio", name="option", value="normal", checked=True), " Normal", cls="radio-label"),
                cls="radio-group",
            ),
            Button("Add Restaurant", type="submit", cls="btn w-full"),
            hx_post="/add",
            hx_target="#add-result",
            **{"hx-on::after-request": "this.reset()"},
        ),
        Div(message or "", id="add-result", cls="text-center"),
    )
```

**Target Alpine.js:**
```html
<!-- dist/add.html -->
<div x-data="addView()" class="add-content">
  <h1 class="text-2xl font-bold text-center">Add Restaurant</h1>

  <form @submit.prevent="submit()" class="add-form">
    <input
      x-model="name"
      class="form-input"
      required
      autofocus
    >

    <div class="radio-group">
      <label class="radio-label">
        <input type="radio" x-model="category" value="cheap"> Cheap
      </label>
      <label class="radio-label">
        <input type="radio" x-model="category" value="normal" checked> Normal
      </label>
    </div>

    <button type="submit" class="btn w-full" :disabled="loading">
      Add Restaurant
    </button>
  </form>

  <div id="add-result" class="text-center">
    <span x-show="success" class="text-success" x-text="message"></span>
    <span x-show="error" class="text-destructive" x-text="message"></span>
  </div>
</div>

<script>
function addView() {
  return {
    name: '',
    category: 'normal',
    message: '',
    success: false,
    error: false,
    loading: false,

    async submit() {
      this.loading = true;
      this.success = false;
      this.error = false;

      try {
        await window.__TAURI__.core.invoke('add_restaurant', {
          name: this.name,
          category: this.category
        });
        this.message = `Added restaurant: ${this.name} (${this.category})`;
        this.success = true;
        this.name = '';  // Reset form
        setTimeout(() => { this.success = false; }, 5000);
      } catch (e) {
        this.message = e;
        this.error = true;
      }
      this.loading = false;
    }
  }
}
</script>
```

### List View (`app/main.py` lines 250-276 → `dist/list.html`)

**Current FastHTML:**
```python
def list_view():
    restaurants = get_all_restaurants()
    return Div(
        H1("All Restaurants", cls="text-2xl font-bold text-center mb-6"),
        Div(
            *[restaurant_card(name, option) for name, option in restaurants],
            cls="card",
        ) if restaurants else P("No restaurants found", cls="text-center text-muted"),
        id="restaurant-list",
    )

def restaurant_card(name, option):
    price = "$" if option.lower() == "cheap" else "$$"
    return Div(
        Span(name, cls="flex-1"),
        Span(price, cls="px-2 font-semibold price-indicator"),
        Button(
            I(cls="fas fa-trash"),
            hx_post=f"/delete?name={quote(name)}",
            hx_target="#restaurant-list",
            hx_swap="outerHTML",
            cls="delete-btn",
        ),
        cls="restaurant-card",
    )
```

**Target Alpine.js:**
```html
<!-- dist/list.html -->
<div x-data="listView()" x-init="loadRestaurants()" id="restaurant-list">
  <h1 class="text-2xl font-bold text-center mb-6">All Restaurants</h1>

  <div class="card" x-show="restaurants.length > 0">
    <template x-for="r in restaurants" :key="r.name">
      <div class="restaurant-card">
        <span class="flex-1" x-text="r.name"></span>
        <span class="px-2 font-semibold price-indicator"
              x-text="r.category.toLowerCase() === 'cheap' ? '$' : '$$'"></span>
        <button class="delete-btn" @click="deleteRestaurant(r.name)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </template>
  </div>

  <p x-show="restaurants.length === 0" class="text-center text-muted">
    No restaurants found
  </p>
</div>

<script>
function listView() {
  return {
    restaurants: [],

    async loadRestaurants() {
      this.restaurants = await window.__TAURI__.core.invoke('list_restaurants');
    },

    async deleteRestaurant(name) {
      try {
        await window.__TAURI__.core.invoke('delete_restaurant', { name });
        await this.loadRestaurants();  // Refresh list
      } catch (e) {
        console.error('Delete failed:', e);
      }
    }
  }
}
</script>
```

---

## Rust Backend (Minimal Implementation)

### `src-tauri/Cargo.toml` Changes

```toml
[dependencies]
tauri = { version = "2", features = ["devtools"] }
tauri-plugin-shell = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
rusqlite = { version = "0.31", features = ["bundled"] }
rand = "0.8"
chrono = "0.4"
dirs = "5"  # For cross-platform data directories
```

### `src-tauri/src/db.rs` (New File)

```rust
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;
use rand::seq::SliceRandom;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Restaurant {
    pub name: String,
    pub category: String,
}

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new() -> Result<Self> {
        let path = get_db_path();
        std::fs::create_dir_all(path.parent().unwrap()).ok();
        let conn = Connection::open(&path)?;
        let db = Database { conn: Mutex::new(conn) };
        db.init_tables()?;
        Ok(db)
    }

    fn init_tables(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute_batch(r#"
            CREATE TABLE IF NOT EXISTS lunch_list (
                restaurants TEXT PRIMARY KEY,
                option TEXT
            );
            CREATE TABLE IF NOT EXISTS recent_lunch (
                restaurants TEXT PRIMARY KEY,
                date TEXT
            );
        "#)?;
        Ok(())
    }

    pub fn list_all(&self) -> Result<Vec<Restaurant>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT restaurants, option FROM lunch_list ORDER BY restaurants")?;
        let rows = stmt.query_map([], |row| {
            Ok(Restaurant {
                name: row.get(0)?,
                category: row.get(1)?,
            })
        })?;
        rows.collect()
    }

    pub fn list_by_category(&self, category: &str) -> Result<Vec<Restaurant>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT restaurants, option FROM lunch_list WHERE LOWER(option) = LOWER(?)"
        )?;
        let rows = stmt.query_map([category], |row| {
            Ok(Restaurant {
                name: row.get(0)?,
                category: row.get(1)?,
            })
        })?;
        rows.collect()
    }

    pub fn add(&self, name: &str, category: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO lunch_list (restaurants, option) VALUES (?, ?)",
            [name, category],
        )?;
        Ok(())
    }

    pub fn delete(&self, name: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM lunch_list WHERE restaurants = ?", [name])?;
        Ok(())
    }

    pub fn roll(&self, category: &str) -> Result<Restaurant> {
        let restaurants = self.list_by_category(category)?;
        if restaurants.is_empty() {
            return Err(rusqlite::Error::QueryReturnedNoRows);
        }

        // Get last selected to avoid immediate repeat
        let conn = self.conn.lock().unwrap();
        let last: Option<String> = conn
            .query_row(
                "SELECT restaurants FROM recent_lunch ORDER BY date DESC LIMIT 1",
                [],
                |row| row.get(0),
            )
            .ok();

        // Filter out last selection if possible
        let available: Vec<_> = restaurants
            .iter()
            .filter(|r| Some(&r.name) != last.as_ref())
            .cloned()
            .collect();

        let chosen = if available.is_empty() {
            restaurants.choose(&mut rand::thread_rng()).unwrap()
        } else {
            available.choose(&mut rand::thread_rng()).unwrap()
        };

        // Record selection
        conn.execute(
            "INSERT OR REPLACE INTO recent_lunch (restaurants, date) VALUES (?, ?)",
            [&chosen.name, &Utc::now().to_rfc3339()],
        )?;

        // Keep only last 14
        conn.execute(
            "DELETE FROM recent_lunch WHERE restaurants NOT IN (
                SELECT restaurants FROM recent_lunch ORDER BY date DESC LIMIT 14
            )",
            [],
        )?;

        Ok(chosen.clone())
    }
}

fn get_db_path() -> PathBuf {
    #[cfg(target_os = "macos")]
    {
        dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("Lunch")
            .join("lunch.db")
    }
    #[cfg(target_os = "ios")]
    {
        dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("lunch.db")
    }
    #[cfg(not(any(target_os = "macos", target_os = "ios")))]
    {
        dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("lunch")
            .join("lunch.db")
    }
}
```

### `src-tauri/src/lib.rs` (Simplified)

```rust
mod db;

use db::{Database, Restaurant};
use std::sync::OnceLock;
use tauri::Manager;

static DB: OnceLock<Database> = OnceLock::new();

fn get_db() -> &'static Database {
    DB.get_or_init(|| Database::new().expect("Failed to initialize database"))
}

#[tauri::command]
fn list_restaurants() -> Result<Vec<Restaurant>, String> {
    get_db().list_all().map_err(|e| e.to_string())
}

#[tauri::command]
fn add_restaurant(name: String, category: String) -> Result<(), String> {
    get_db().add(&name, &category).map_err(|e| {
        if e.to_string().contains("UNIQUE constraint") {
            format!("Restaurant '{}' already exists", name)
        } else {
            e.to_string()
        }
    })
}

#[tauri::command]
fn delete_restaurant(name: String) -> Result<(), String> {
    get_db().delete(&name).map_err(|e| e.to_string())
}

#[tauri::command]
fn roll_lunch(category: String) -> Result<Restaurant, String> {
    get_db().roll(&category).map_err(|e| {
        if e.to_string().contains("no rows") {
            "No restaurants found!".to_string()
        } else {
            e.to_string()
        }
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            list_restaurants,
            add_restaurant,
            delete_restaurant,
            roll_lunch,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## Static Assets to Copy

| Source | Destination |
|--------|-------------|
| `app/static/app.css` | `src-tauri/dist/app.css` |
| `app/static/basecoat.min.css` | `src-tauri/dist/basecoat.min.css` |
| `app/static/logo.png` | `src-tauri/dist/logo.png` |
| `app/static/fonts/` | `src-tauri/dist/fonts/` |
| `app/static/js/basecoat/` | `src-tauri/dist/js/basecoat/` |

**New file to add:**
- `src-tauri/dist/js/alpine.min.js` (download from [alpinejs.dev](https://alpinejs.dev))

---

## `tauri.conf.json` Changes

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Lunch",
  "version": "1.0.0",
  "identifier": "com.lunch.app",
  "build": {
    "beforeBuildCommand": "",
    "beforeDevCommand": "",
    "frontendDist": "./dist"
  },
  "app": {
    "withGlobalTauri": true,
    "windows": [
      {
        "title": "Lunch",
        "width": 600,
        "height": 800,
        "resizable": true,
        "fullscreen": false,
        "minWidth": 320,
        "minHeight": 480
      }
    ]
  },
  "bundle": {
    "active": true,
    "targets": ["app", "dmg"],
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "iOS": {
      "developmentTeam": "YOUR_TEAM_ID"
    }
  }
}
```

**Key changes:**
- Removed `externalBin` (no more sidecar)
- Changed `frontendDist` to `./dist`
- Added `iOS.developmentTeam` for iOS builds

---

## Shared Layout Template

Create `src-tauri/dist/layout.html` as a template reference:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lunch</title>
  <link rel="stylesheet" href="basecoat.min.css">
  <link rel="stylesheet" href="app.css">
  <link rel="stylesheet" href="fonts/fontawesome.min.css">
  <script src="js/alpine.min.js" defer></script>
  <script src="js/basecoat/basecoat.min.js" defer></script>
  <script src="js/app.js" defer></script>
</head>
<body class="app-container">
  <div class="main-content" id="main-content">
    <!-- Page content here -->
  </div>

  <nav class="bottom-nav">
    <a href="index.html" class="nav-item" id="nav-home">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <a href="add.html" class="nav-item" id="nav-add">
      <i class="fas fa-plus"></i>
      <span>Add</span>
    </a>
    <a href="list.html" class="nav-item" id="nav-list">
      <i class="fas fa-list"></i>
      <span>List</span>
    </a>
    <a href="settings.html" class="nav-item" id="nav-settings">
      <i class="fas fa-cog"></i>
      <span>Settings</span>
    </a>
  </nav>
</body>
</html>
```

---

## Theme Toggle (Shared JS)

Create `src-tauri/dist/js/app.js`:

```javascript
// Theme management
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  const stored = localStorage.getItem('themeMode');
  const useSystem = localStorage.getItem('useSystemTheme') !== 'false';
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;

  let isDark = useSystem ? prefersDark : (stored === 'dark');
  if (isDark) document.documentElement.classList.add('dark');

  // Listen for system theme changes
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem('useSystemTheme') !== 'false') {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });

  // Highlight active nav item
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  const navMap = {
    'index.html': 'nav-home',
    'add.html': 'nav-add',
    'list.html': 'nav-list',
    'settings.html': 'nav-settings'
  };
  const activeNav = document.getElementById(navMap[page]);
  if (activeNav) activeNav.classList.add('active');
});

// Global theme toggle function
window.toggleTheme = function() {
  const isDark = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('themeMode', isDark ? 'dark' : 'light');
  localStorage.setItem('useSystemTheme', 'false');
};

window.setSystemTheme = function(useSystem) {
  localStorage.setItem('useSystemTheme', useSystem);
  if (useSystem) {
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }
};
```

---

## iOS Setup Commands

After migration is complete:

```bash
# 1. Add iOS Rust targets
rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim

# 2. Initialize iOS project
cd src-tauri
npx tauri ios init

# 3. Development (simulator)
npx tauri ios dev

# 4. Development (physical device)
npx tauri ios dev --open --host

# 5. Build for App Store
npx tauri ios build --export-method app-store-connect
```

---

## Files to Delete After Migration

| File/Directory | Reason |
|----------------|--------|
| `app/main.py` | Replaced by static HTML + Alpine.js |
| `app/backend/` | Replaced by Rust `db.rs` |
| `src-tauri/bin/` | No more PEX sidecar |
| `taskfiles/pex.yml` | No more PEX builds |
| `pyinstaller/` | No more PyInstaller |

**Keep for reference/data:**
- `app/data/lunch_list.csv` - Seed data (import into SQLite manually or via Rust)
- `app/static/` - Source for copying to `dist/`

---

## Migration Checklist

- [ ] Create `src-tauri/dist/` directory structure
- [ ] Copy static assets (CSS, fonts, images)
- [ ] Download Alpine.js to `dist/js/`
- [ ] Create `dist/js/app.js` (theme + nav logic)
- [ ] Create `dist/index.html` (home view)
- [ ] Create `dist/add.html` (add view)
- [ ] Create `dist/list.html` (list view)
- [ ] Create `dist/settings.html` (settings view)
- [ ] Add Rust dependencies to `Cargo.toml`
- [ ] Create `src-tauri/src/db.rs`
- [ ] Update `src-tauri/src/lib.rs` with Tauri commands
- [ ] Update `tauri.conf.json` (remove externalBin, set frontendDist)
- [ ] Test on macOS: `npx tauri dev`
- [ ] Add iOS targets: `rustup target add ...`
- [ ] Initialize iOS: `npx tauri ios init`
- [ ] Test on iOS simulator: `npx tauri ios dev`
- [ ] Configure signing for App Store
- [ ] Build for distribution: `npx tauri ios build`

---

## Effort Estimate

| Component | Effort |
|-----------|--------|
| Rust db.rs (~100 lines) | Low |
| Rust lib.rs commands (~50 lines) | Low |
| 4 HTML pages (~400 lines total) | Medium |
| Shared JS (~50 lines) | Low |
| Config updates | Low |
| iOS setup & testing | Medium |
| **Total** | **Medium** |

The Rust code is minimal because it only handles database operations. Alpine.js handles all UI state and reactivity client-side.

---

## CI/CD Configuration

### Self-Hosted Runner DNS (MinIO)

The iOS CI/CD pipeline uses Fastlane Match with MinIO (S3-compatible) storage for code signing certificates. The self-hosted runner `mini` requires a static hosts entry to ensure reliable DNS resolution for the MinIO API endpoint.

**Problem**: Corporate split DNS can intermittently fail, causing macOS to fall back to public DNS which returns the wrong IP address for internal services.

**Solution**: Add static hosts entry on the runner:

```bash
# On the self-hosted runner (mini)
echo '10.5.162.10 api.minio.nwcrane.com' | sudo tee -a /etc/hosts
```

**Environment Variables** (set in GitHub Actions secrets):
- `AWS_ACCESS_KEY_ID` - MinIO access key
- `AWS_SECRET_ACCESS_KEY` - MinIO secret key
- `AWS_ENDPOINT_URL` - MinIO API endpoint (https://api.minio.nwcrane.com)
- `MATCH_PASSWORD` - Fastlane Match encryption password
