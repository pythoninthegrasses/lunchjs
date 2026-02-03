import { test, expect } from '@playwright/test';
import { navigateAndWait, waitForRestaurants, waitForSuccessMessage } from './fixtures/helpers.js';

test.describe('Integration: Full Workflow', () => {
  // Note: Cross-page state persistence requires actual Tauri app.
  // These tests verify functionality within single page contexts.

  test('should add restaurant and show success message', async ({ page }) => {
    const uniqueName = `Integration Test ${Date.now()}`;

    await navigateAndWait(page, '/add.html');

    const input = page.locator('.form-input');
    await input.fill(uniqueName);

    const cheapRadio = page.locator('input[type="radio"][value="cheap"]');
    await cheapRadio.click();

    const addButton = page.locator('button:has-text("Add Restaurant")');
    await addButton.click();

    await waitForSuccessMessage(page);

    // Verify success message contains restaurant name and category
    const successMessage = page.locator('.text-success');
    await expect(successMessage).toContainText(uniqueName);
    await expect(successMessage).toContainText('Cheap');
  });

  test('should roll lunch from existing restaurants', async ({ page }) => {
    await navigateAndWait(page, '/');

    // Select normal category (seeded restaurants include normal ones)
    const normalCategoryRadio = page.locator('.home-content input[type="radio"][value="normal"]');
    await normalCategoryRadio.click();

    // Roll
    const rollButton = page.locator('button:has-text("Roll Lunch")');
    const result = page.locator('#result');

    await rollButton.click();

    // Verify we got a result (should be one of the seeded restaurants)
    await expect(result).not.toBeEmpty();
    const resultText = await result.textContent();
    expect(resultText.length).toBeGreaterThan(0);
  });

  test('should delete restaurant from list', async ({ page }) => {
    await navigateAndWait(page, '/list.html');
    await waitForRestaurants(page);

    const initialCount = await page.locator('.restaurant-card').count();
    expect(initialCount).toBeGreaterThan(0);

    // Delete first restaurant
    const firstDeleteBtn = page.locator('.delete-btn').first();
    await firstDeleteBtn.click();

    // Wait for deletion
    await page.waitForTimeout(300);

    // Verify count decreased
    const newCount = await page.locator('.restaurant-card').count();
    expect(newCount).toBe(initialCount - 1);
  });
});

test.describe('Integration: Navigation Flow', () => {
  test('should navigate through all pages', async ({ page }) => {
    // Start at home
    await navigateAndWait(page, '/');
    await expect(page.locator('.home-content')).toBeVisible();

    // Go to Add
    await page.locator('#nav-add').click();
    await expect(page.locator('h1')).toContainText('Add Restaurant');

    // Go to List
    await page.locator('#nav-list').click();
    await expect(page.locator('h1')).toContainText('All Restaurants');

    // Go to Settings
    await page.locator('#nav-settings').click();
    await expect(page.locator('h1')).toContainText('Settings');

    // Go back to Home
    await page.locator('#nav-home').click();
    await expect(page.locator('.home-content')).toBeVisible();
  });
});

test.describe('Integration: Theme Consistency', () => {
  test('should maintain theme across page navigation', async ({ page }) => {
    // Start at home
    await navigateAndWait(page, '/');

    // Enable dark mode
    const themeToggle = page.locator('.theme-toggle');
    await themeToggle.click();

    // Verify dark mode
    const isDarkHome = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDarkHome).toBe(true);

    // Navigate to other pages and verify dark mode persists
    await page.locator('#nav-list').click();
    await page.waitForLoadState('networkidle');

    const isDarkList = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDarkList).toBe(true);

    await page.locator('#nav-settings').click();
    await page.waitForLoadState('networkidle');

    const isDarkSettings = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDarkSettings).toBe(true);
  });
});
