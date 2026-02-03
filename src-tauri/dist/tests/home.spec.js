import { test, expect } from '@playwright/test';
import { waitForAlpine, navigateAndWait, isDarkMode } from './fixtures/helpers.js';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/');
  });

  test('should display the app logo', async ({ page }) => {
    const logo = page.locator('.banner-img');
    await expect(logo).toBeVisible();
  });

  test('should display category radio buttons', async ({ page }) => {
    const cheapRadio = page.locator('input[type="radio"][value="cheap"]');
    const normalRadio = page.locator('input[type="radio"][value="normal"]');

    await expect(cheapRadio).toBeVisible();
    await expect(normalRadio).toBeVisible();
    // Normal should be selected by default
    await expect(normalRadio).toBeChecked();
  });

  test('should display Roll Lunch button', async ({ page }) => {
    const button = page.locator('button:has-text("Roll Lunch")');
    await expect(button).toBeVisible();
  });

  test('should display bottom navigation', async ({ page }) => {
    await expect(page.locator('#nav-home')).toBeVisible();
    await expect(page.locator('#nav-add')).toBeVisible();
    await expect(page.locator('#nav-list')).toBeVisible();
    await expect(page.locator('#nav-settings')).toBeVisible();
  });

  test('should highlight Home nav item as active', async ({ page }) => {
    const homeNav = page.locator('#nav-home');
    await expect(homeNav).toHaveClass(/active/);
  });

  test('should select category when clicked', async ({ page }) => {
    const cheapRadio = page.locator('input[type="radio"][value="cheap"]');

    await cheapRadio.click();
    await expect(cheapRadio).toBeChecked();
  });

  test('should roll lunch and display result', async ({ page }) => {
    const button = page.locator('button:has-text("Roll Lunch")');
    const result = page.locator('#result');

    await button.click();

    // Wait for result to appear (non-empty text)
    await expect(result).not.toBeEmpty();
  });

  test('should display theme toggle', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle theme when theme button clicked', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    const initialDark = await isDarkMode(page);

    await themeToggle.click();

    const afterToggle = await isDarkMode(page);
    expect(afterToggle).toBe(!initialDark);
  });
});

test.describe('Home Page Navigation', () => {
  test('should navigate to Add page', async ({ page }) => {
    await navigateAndWait(page, '/');
    await page.locator('#nav-add').click();
    await expect(page).toHaveURL(/add\.html/);
  });

  test('should navigate to List page', async ({ page }) => {
    await navigateAndWait(page, '/');
    await page.locator('#nav-list').click();
    await expect(page).toHaveURL(/list\.html/);
  });

  test('should navigate to Settings page', async ({ page }) => {
    await navigateAndWait(page, '/');
    await page.locator('#nav-settings').click();
    await expect(page).toHaveURL(/settings\.html/);
  });
});
