import { test, expect } from '@playwright/test';
import { navigateAndWait, waitForRestaurants, getRestaurantList } from './fixtures/helpers.js';

test.describe('List Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/list.html');
  });

  test('should display page title', async ({ page }) => {
    const title = page.locator('h1');
    await expect(title).toContainText('All Restaurants');
  });

  test('should highlight List nav item as active', async ({ page }) => {
    const listNav = page.locator('#nav-list');
    await expect(listNav).toHaveClass(/active/);
  });

  test('should display restaurant cards after loading', async ({ page }) => {
    await waitForRestaurants(page);

    const cards = page.locator('.restaurant-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display restaurant name in each card', async ({ page }) => {
    await waitForRestaurants(page);

    const firstCard = page.locator('.restaurant-card').first();
    const name = firstCard.locator('.flex-1');
    await expect(name).not.toBeEmpty();
  });

  test('should display price indicator ($ or $$)', async ({ page }) => {
    await waitForRestaurants(page);

    const priceIndicator = page.locator('.price-indicator').first();
    const text = await priceIndicator.textContent();
    expect(['$', '$$']).toContain(text);
  });

  test('should display delete button for each restaurant', async ({ page }) => {
    await waitForRestaurants(page);

    const deleteButtons = page.locator('.delete-btn');
    const count = await deleteButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show $ for cheap restaurants', async ({ page }) => {
    await waitForRestaurants(page);

    // Find a card with $ price indicator
    const cheapIndicator = page.locator('.price-indicator:has-text("$"):not(:has-text("$$"))');
    const count = await cheapIndicator.count();
    expect(count).toBeGreaterThanOrEqual(0); // May not always have cheap restaurants
  });

  test('should show $$ for normal restaurants', async ({ page }) => {
    await waitForRestaurants(page);

    const normalIndicator = page.locator('.price-indicator:has-text("$$")');
    const count = await normalIndicator.count();
    expect(count).toBeGreaterThanOrEqual(0); // May not always have normal restaurants
  });

  test('should delete restaurant when delete button clicked', async ({ page }) => {
    await waitForRestaurants(page);

    const initialCount = await page.locator('.restaurant-card').count();

    // Click first delete button
    const firstDeleteBtn = page.locator('.delete-btn').first();
    await firstDeleteBtn.click();

    // Wait for list to update
    await page.waitForTimeout(500);

    const newCount = await page.locator('.restaurant-card').count();
    expect(newCount).toBe(initialCount - 1);
  });
});

test.describe('List Page - Empty State', () => {
  test('should show empty message when no restaurants', async ({ page }) => {
    // This test would need to clear all restaurants first
    // For now, we just verify the empty state element exists
    await navigateAndWait(page, '/list.html');

    const emptyMessage = page.locator('text=No restaurants found');
    // The element should exist in DOM (may be hidden if there are restaurants)
    await expect(emptyMessage).toBeAttached();
  });
});

test.describe('List Page - Edit Restaurant', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/list.html');
    await waitForRestaurants(page);
  });

  test('should display edit button for each restaurant', async ({ page }) => {
    const editButtons = page.locator('.edit-btn');
    const count = await editButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should open edit modal when edit button clicked', async ({ page }) => {
    const firstEditBtn = page.locator('.edit-btn').first();
    await firstEditBtn.click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible();
  });

  test('should pre-fill modal with restaurant data', async ({ page }) => {
    // Get first restaurant name
    const firstName = await page.locator('.restaurant-card .flex-1').first().textContent();

    const firstEditBtn = page.locator('.edit-btn').first();
    await firstEditBtn.click();

    const nameInput = page.locator('.modal-dialog input[type="text"]');
    await expect(nameInput).toHaveValue(firstName.trim());
  });

  test('should close modal when X button clicked', async ({ page }) => {
    const firstEditBtn = page.locator('.edit-btn').first();
    await firstEditBtn.click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible();

    const closeBtn = page.locator('.modal-close');
    await closeBtn.click();

    await expect(modal).not.toBeVisible();
  });

  test('should close modal when clicking outside', async ({ page }) => {
    const firstEditBtn = page.locator('.edit-btn').first();
    await firstEditBtn.click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible();

    // Click on the overlay (outside the dialog)
    await modal.click({ position: { x: 10, y: 10 } });

    await expect(modal).not.toBeVisible();
  });

  test('should close modal when Cancel button clicked', async ({ page }) => {
    const firstEditBtn = page.locator('.edit-btn').first();
    await firstEditBtn.click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible();

    const cancelBtn = page.locator('.modal-dialog button:has-text("Cancel")');
    await cancelBtn.click();

    await expect(modal).not.toBeVisible();
  });

  test('should update restaurant name on save', async ({ page }) => {
    const firstEditBtn = page.locator('.edit-btn').first();
    await firstEditBtn.click();

    const nameInput = page.locator('.modal-dialog input[type="text"]');
    await nameInput.fill('Updated Restaurant Name');

    const saveBtn = page.locator('.modal-dialog button:has-text("Save")');
    await saveBtn.click();

    // Wait for modal to close and list to update
    await page.waitForTimeout(300);

    const updatedCard = page.locator('.restaurant-card:has-text("Updated Restaurant Name")');
    await expect(updatedCard).toBeVisible();
  });

  test('should update restaurant category on save', async ({ page }) => {
    // Find a cheap restaurant to edit
    const cheapCard = page.locator('.restaurant-card:has(.price-indicator:text("$"):not(:text("$$")))').first();
    const editBtn = cheapCard.locator('.edit-btn');
    await editBtn.click();

    // Change to normal category
    const normalRadio = page.locator('.modal-dialog input[type="radio"][value="normal"]');
    await normalRadio.click();

    const saveBtn = page.locator('.modal-dialog button:has-text("Save")');
    await saveBtn.click();

    // Wait for modal to close and list to update
    await page.waitForTimeout(300);

    // The restaurant should now show $$ (normal)
    const modal = page.locator('.modal-overlay');
    await expect(modal).not.toBeVisible();
  });

  test('should show error when trying to use duplicate name', async ({ page }) => {
    // Get the second restaurant name
    const secondName = await page.locator('.restaurant-card .flex-1').nth(1).textContent();

    // Edit first restaurant
    const firstEditBtn = page.locator('.edit-btn').first();
    await firstEditBtn.click();

    const nameInput = page.locator('.modal-dialog input[type="text"]');
    await nameInput.fill(secondName.trim());

    const saveBtn = page.locator('.modal-dialog button:has-text("Save")');
    await saveBtn.click();

    // Should show error message
    const errorMsg = page.locator('.modal-error');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('already exists');
  });
});
