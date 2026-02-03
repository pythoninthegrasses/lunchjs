---
id: task-034
title: 'Setup unit, integration, and E2E testing infrastructure'
status: Done
assignee:
  - '@claude'
created_date: '2026-02-03 21:28'
updated_date: '2026-02-03 21:45'
labels:
  - testing
  - infrastructure
  - frontend
dependencies: []
priority: high
ordinal: 500
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Setup comprehensive testing infrastructure for LunchJS modeled after ~/git/mt project using Vitest for unit tests and Playwright for E2E tests.

## Background
The mt project has a mature testing setup with:
- Vitest for unit/property-based tests (`__tests__/*.test.js`)
- Playwright for E2E tests (`tests/*.spec.js`)
- Tauri IPC mocking for unit tests
- Alpine.js store interaction helpers for E2E
- Coverage reporting with v8
- Tag-based filtering (`@tauri` for Tauri-specific tests)

## Goals
1. Enable TDD for frontend JavaScript/Alpine.js code
2. Enable E2E testing of full application flows
3. Mock Tauri IPC commands in unit tests
4. Test Alpine.js stores and components
5. Integrate with existing `task test` workflow
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Vitest configured with jsdom environment for unit tests
- [x] #2 Playwright configured for E2E tests with WebKit project
- [x] #3 Test directory structure: __tests__/ for unit, tests/ for E2E
- [x] #4 Tauri IPC mock helper created for window.__TAURI__.core.invoke()
- [x] #5 Alpine.js test helpers created (getAlpineStore, waitForAlpine, etc.)
- [x] #6 Sample unit test for a store or utility function
- [x] #7 Sample E2E test for basic app flow (navigate, view list)
- [x] #8 Coverage reporting enabled with v8 provider
- [x] #9 task test:unit command runs Vitest unit tests
- [x] #10 task test:e2e command runs Playwright E2E tests
- [x] #11 task test runs both Rust tests and frontend unit tests
- [ ] #12 CI integration: tests run on PR with fail-fast behavior
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Reference Project
~/git/mt - Vitest + Playwright setup for Tauri + Alpine.js app

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `src-tauri/dist/package.json` | Add vitest, playwright, jsdom dependencies |
| `src-tauri/dist/vitest.config.js` | Vitest configuration |
| `src-tauri/dist/playwright.config.js` | Playwright configuration |
| `src-tauri/dist/__tests__/` | Unit test directory |
| `src-tauri/dist/__tests__/setup-tauri-mocks.js` | Tauri IPC mocking |
| `src-tauri/dist/tests/` | E2E test directory |
| `src-tauri/dist/tests/fixtures/helpers.js` | Alpine.js test helpers |
| `Taskfile.yml` | Add test:unit, test:e2e commands |

## Phase 1: Package Setup

### 1.1 Create package.json in src-tauri/dist/

```json
{
  "name": "lunch-frontend",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "vitest": "^4.0.0",
    "@vitest/coverage-v8": "^4.0.0",
    "jsdom": "^27.0.0",
    "@playwright/test": "^1.57.0"
  }
}
```

### 1.2 Install dependencies

```bash
cd src-tauri/dist && npm install
npx playwright install webkit
```

## Phase 2: Vitest Configuration

### 2.1 Create vitest.config.js

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['__tests__/**/*.{test,spec}.js'],
    exclude: ['tests/**'],
    globals: true,
    silent: true,
    reporters: ['dot'],
    setupFiles: ['__tests__/setup-tauri-mocks.js'],
    coverage: {
      provider: 'v8',
      include: ['js/**/*.js'],
      exclude: ['**/*.min.js'],
      reporter: ['text', 'html'],
    },
  },
});
```

### 2.2 Create __tests__/setup-tauri-mocks.js

```javascript
import { vi } from 'vitest';

// Mock Tauri IPC
window.__TAURI__ = {
  core: {
    invoke: vi.fn((cmd, args) => {
      switch (cmd) {
        case 'list_restaurants':
          return Promise.resolve([
            { name: 'Test Restaurant', category: 'cheap' },
          ]);
        case 'add_restaurant':
        case 'delete_restaurant':
        case 'update_restaurant':
          return Promise.resolve();
        case 'roll_lunch':
          return Promise.resolve({ name: 'Random Pick', category: 'normal' });
        default:
          return Promise.reject(`Unknown command: ${cmd}`);
      }
    }),
  },
};

// Mock Alpine.js if needed
window.Alpine = {
  store: vi.fn(),
  data: vi.fn(),
};
```

## Phase 3: Playwright Configuration

### 3.1 Create playwright.config.js

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: 'http://localhost:1420',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'cd ../.. && task tauri:dev:stable',
    url: 'http://localhost:1420',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

### 3.2 Create tests/fixtures/helpers.js

```javascript
export async function waitForAlpine(page) {
  await page.waitForFunction(() => window.Alpine !== undefined);
}

export async function getAlpineData(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el?._x_dataStack?.[0];
  }, selector);
}

export async function waitForRestaurants(page) {
  await page.waitForFunction(() => {
    const el = document.querySelector('#restaurant-list');
    return el?._x_dataStack?.[0]?.restaurants?.length > 0;
  });
}
```

## Phase 4: Sample Tests

### 4.1 Create __tests__/sample.test.js

```javascript
import { describe, it, expect, vi } from 'vitest';

describe('Tauri IPC Mock', () => {
  it('should mock list_restaurants', async () => {
    const result = await window.__TAURI__.core.invoke('list_restaurants');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Restaurant');
  });
});
```

### 4.2 Create tests/app.spec.js

```javascript
import { test, expect } from '@playwright/test';
import { waitForAlpine, waitForRestaurants } from './fixtures/helpers.js';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await waitForAlpine(page);
  await expect(page.locator('h1')).toContainText('Lunch');
});

test('list page shows restaurants', async ({ page }) => {
  await page.goto('/list.html');
  await waitForRestaurants(page);
  const cards = page.locator('.restaurant-card');
  await expect(cards.first()).toBeVisible();
});
```

## Phase 5: Taskfile Integration

### 5.1 Add to Taskfile.yml

```yaml
test:unit:
  desc: Run frontend unit tests
  dir: src-tauri/dist
  cmds:
    - npm test

test:unit:watch:
  desc: Run frontend unit tests in watch mode
  dir: src-tauri/dist
  cmds:
    - npm run test:watch

test:e2e:
  desc: Run Playwright E2E tests
  dir: src-tauri/dist
  cmds:
    - npm run test:e2e

test:e2e:ui:
  desc: Run Playwright E2E tests with UI
  dir: src-tauri/dist
  cmds:
    - npm run test:e2e:ui

# Update existing test task
test:
  desc: Run all tests (Rust + frontend unit)
  cmds:
    - task: test:rust
    - task: test:unit
```

## Verification

1. `cd src-tauri/dist && npm test` - unit tests pass
2. `cd src-tauri/dist && npm run test:e2e` - E2E tests pass
3. `task test` - runs both Rust and frontend tests
4. `task test:e2e` - runs Playwright tests
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Summary

Testing infrastructure complete with 76 total tests providing regression coverage:

### Test Counts
- **Rust API tests**: 17 tests (CRUD operations, roll, category filtering, edge cases)
- **Frontend unit tests**: 10 tests (theme management, Tauri mock validation)
- **E2E tests**: 49 tests (all pages, navigation, workflows)

### Files Created
- `src-tauri/dist/package.json` - test dependencies (vitest, playwright, http-server)
- `src-tauri/dist/vitest.config.js` - unit test config with jsdom
- `src-tauri/dist/playwright.config.js` - E2E config with WebKit
- `src-tauri/dist/__tests__/setup-tauri-mocks.js` - Tauri IPC mocking
- `src-tauri/dist/__tests__/app.test.js` - theme and mock tests
- `src-tauri/dist/tests/fixtures/helpers.js` - Alpine.js test helpers
- `src-tauri/dist/tests/global-setup.js` - Tauri mock injection for E2E
- `src-tauri/dist/tests/home.spec.js` - 12 tests
- `src-tauri/dist/tests/list.spec.js` - 11 tests
- `src-tauri/dist/tests/add.spec.js` - 10 tests
- `src-tauri/dist/tests/settings.spec.js` - 10 tests
- `src-tauri/dist/tests/integration.spec.js` - 6 tests

### Commands Added to Taskfile
- `task test` - runs Rust + frontend unit tests
- `task test:rust` - Rust tests only
- `task test:unit` - Vitest unit tests
- `task test:unit:watch` - watch mode
- `task test:unit:coverage` - with coverage report
- `task test:e2e` - Playwright E2E tests
- `task test:e2e:ui` - Playwright UI mode

### Coverage Notes
- Rust API: comprehensive coverage of db.rs (all public methods tested)
- Frontend: E2E tests cover all user flows; unit test coverage of app.js is 0% due to DOMContentLoaded initialization pattern
- CI integration (#12) deferred to separate task
<!-- SECTION:NOTES:END -->
