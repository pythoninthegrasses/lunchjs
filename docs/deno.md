# Deno for Frontend Tooling

LunchJS uses [Deno](https://deno.com) for frontend dependency management and task execution.

## Why Deno?

- **Faster installs**: `deno install` is significantly faster than `npm ci`
- **Built-in tooling**: Linting and formatting without additional dependencies
- **npm compatibility**: Works with existing package.json via `nodeModulesDir: "auto"`

## Prerequisites

Install Deno from <https://deno.com>.

```bash
# macOS/Linux
curl -fsSL https://deno.land/install.sh | sh

# Or via Homebrew
brew install deno
```

## Usage

All commands go through Task (Taskfile):

```bash
# Install dependencies
task deno:install

# Development
task dev

# Build
task build

# Check dependencies
task deno:check-deps
```

## Deno Tasks

Available via `deno task`:

| Task | Description |
|------|-------------|
| `build:css` | Build Tailwind CSS |
| `watch:css` | Watch Tailwind CSS |
| `tauri` | Run Tauri CLI |
| `tauri:dev` | Run Tauri dev mode |
| `tauri:build` | Build Tauri app |

## Configuration

Configuration is in `deno.jsonc`:

- **nodeModulesDir**: Set to `"auto"` for npm package compatibility
- **lint**: Browser JS files excluded (Alpine.js, Basecoat)
- **fmt**: 2-space indent, semicolons, single quotes
- **exclude**: Build artifacts, node_modules, vendor libs

## npm Fallback

Some commands still use npm (no Deno equivalent):

- `task deno:outdated` - Check outdated packages
- `task deno:audit` - Security audit
- `task deno:audit-fix` - Fix vulnerabilities
