import { test, expect } from '@playwright/test';
import { navigateAndWait, waitForSuccessMessage, waitForErrorMessage } from './fixtures/helpers.js';

test.describe('Add Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/add.html');
  });

  test('should display page title', async ({ page }) => {
    const title = page.locator('h1');
    await expect(title).toContainText('Add Restaurant');
  });

  test('should highlight Add nav item as active', async ({ page }) => {
    const addNav = page.locator('#nav-add');
    await expect(addNav).toHaveClass(/active/);
  });

  test('should display name input field', async ({ page }) => {
    const input = page.locator('.form-input');
    await expect(input).toBeVisible();
  });

  test('should display category radio buttons', async ({ page }) => {
    const cheapRadio = page.locator('input[type="radio"][value="cheap"]');
    const normalRadio = page.locator('input[type="radio"][value="normal"]');

    await expect(cheapRadio).toBeVisible();
    await expect(normalRadio).toBeVisible();
  });

  test('should have normal selected by default', async ({ page }) => {
    const normalRadio = page.locator('input[type="radio"][value="normal"]');
    await expect(normalRadio).toBeChecked();
  });

  test('should display Add Restaurant button', async ({ page }) => {
    const button = page.locator('button:has-text("Add Restaurant")');
    await expect(button).toBeVisible();
  });

  test('should add restaurant successfully', async ({ page }) => {
    const uniqueName = `Test Restaurant ${Date.now()}`;

    // Fill in the form
    const input = page.locator('.form-input');
    await input.fill(uniqueName);

    // Select cheap category
    const cheapRadio = page.locator('input[type="radio"][value="cheap"]');
    await cheapRadio.click();

    // Submit
    const button = page.locator('button:has-text("Add Restaurant")');
    await button.click();

    // Wait for success message
    await waitForSuccessMessage(page);

    // Verify success message contains restaurant name
    const successMessage = page.locator('.text-success');
    await expect(successMessage).toContainText(uniqueName);
  });

  test('should clear input after successful add', async ({ page }) => {
    const uniqueName = `Clear Test ${Date.now()}`;

    const input = page.locator('.form-input');
    await input.fill(uniqueName);

    const button = page.locator('button:has-text("Add Restaurant")');
    await button.click();

    await waitForSuccessMessage(page);

    // Input should be cleared
    await expect(input).toHaveValue('');
  });

  test('should show error for duplicate restaurant', async ({ page }) => {
    // First, add a restaurant
    const uniqueName = `Duplicate Test ${Date.now()}`;

    const input = page.locator('.form-input');
    const button = page.locator('button:has-text("Add Restaurant")');

    await input.fill(uniqueName);
    await button.click();
    await waitForSuccessMessage(page);

    // Try to add the same restaurant again
    await input.fill(uniqueName);
    await button.click();

    // Should show error
    await waitForErrorMessage(page);

    const errorMessage = page.locator('.text-destructive');
    await expect(errorMessage).toContainText('already exists');
  });

  test('should require name field', async ({ page }) => {
    const input = page.locator('.form-input');

    // Verify required attribute
    await expect(input).toHaveAttribute('required', '');
  });

  test('should select category when clicked', async ({ page }) => {
    const cheapRadio = page.locator('input[type="radio"][value="cheap"]');
    const normalRadio = page.locator('input[type="radio"][value="normal"]');

    await cheapRadio.click();
    await expect(cheapRadio).toBeChecked();
    await expect(normalRadio).not.toBeChecked();

    await normalRadio.click();
    await expect(normalRadio).toBeChecked();
    await expect(cheapRadio).not.toBeChecked();
  });
});
