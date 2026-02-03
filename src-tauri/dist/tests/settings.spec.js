import { test, expect } from '@playwright/test';
import { navigateAndWait, isDarkMode } from './fixtures/helpers.js';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/settings.html');
  });

  test('should display page title', async ({ page }) => {
    const title = page.locator('h1');
    await expect(title).toContainText('Settings');
  });

  test('should highlight Settings nav item as active', async ({ page }) => {
    const settingsNav = page.locator('#nav-settings');
    await expect(settingsNav).toHaveClass(/active/);
  });

  test('should display system theme toggle', async ({ page }) => {
    const toggle = page.locator('input[type="checkbox"][role="switch"]');
    await expect(toggle).toBeVisible();
  });

  test('should display "Match system theme" label', async ({ page }) => {
    const label = page.locator('text=Match system theme');
    await expect(label).toBeVisible();
  });

  test('should display description for theme setting', async ({ page }) => {
    const description = page.locator('text=When enabled, follows your device');
    await expect(description).toBeVisible();
  });

  test('should display About section', async ({ page }) => {
    const aboutTitle = page.locator('text=About');
    await expect(aboutTitle).toBeVisible();
  });

  test('should display app name in About section', async ({ page }) => {
    const appName = page.locator('text=Lunch - Restaurant Selector');
    await expect(appName).toBeVisible();
  });

  test('should display version number', async ({ page }) => {
    // Wait for version to load via Tauri
    await page.waitForFunction(() => {
      const el = document.querySelector('[x-text*="version"]');
      return el && el.textContent && el.textContent.includes('Version');
    }, { timeout: 5_000 });

    const version = page.locator('text=/Version \\d+\\.\\d+/');
    await expect(version).toBeVisible();
  });

  test('should display technology stack', async ({ page }) => {
    const techStack = page.locator('text=Built with Alpine.js + Tauri');
    await expect(techStack).toBeVisible();
  });

  test('should toggle system theme setting', async ({ page }) => {
    const toggle = page.locator('input[type="checkbox"][role="switch"]');

    // Get initial state
    const initialChecked = await toggle.isChecked();

    // Toggle
    await toggle.click();

    // Verify state changed
    const newChecked = await toggle.isChecked();
    expect(newChecked).toBe(!initialChecked);
  });
});

test.describe('Settings Page - Theme Persistence', () => {
  test('should persist theme preference in localStorage', async ({ page }) => {
    await navigateAndWait(page, '/settings.html');

    // Toggle system theme off
    const toggle = page.locator('input[type="checkbox"][role="switch"]');
    if (await toggle.isChecked()) {
      await toggle.click();
    }

    // Verify localStorage was updated
    const useSystemTheme = await page.evaluate(() => localStorage.getItem('useSystemTheme'));
    expect(useSystemTheme).toBe('false');
  });
});
