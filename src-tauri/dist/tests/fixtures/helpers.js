import { tauriMockScript } from '../global-setup.js';

/**
 * Inject Tauri mocks before page loads.
 * Must be called before navigating to a page.
 * @param {import('@playwright/test').Page} page
 */
export async function injectTauriMocks(page) {
  await page.addInitScript(tauriMockScript);
}

/**
 * Wait for Alpine.js to be initialized on the page.
 * @param {import('@playwright/test').Page} page
 */
export async function waitForAlpine(page) {
  await page.waitForFunction(() => typeof window.Alpine !== 'undefined', {
    timeout: 10_000,
  });
}

/**
 * Get Alpine.js data from an element with x-data.
 * @param {import('@playwright/test').Page} page
 * @param {string} selector - CSS selector for the x-data element
 */
export async function getAlpineData(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el || !el._x_dataStack) return null;
    return JSON.parse(JSON.stringify(el._x_dataStack[0]));
  }, selector);
}

/**
 * Wait for the restaurant list to be loaded.
 * @param {import('@playwright/test').Page} page
 */
export async function waitForRestaurants(page) {
  await page.waitForFunction(
    () => {
      const el = document.querySelector('#restaurant-list');
      if (!el || !el._x_dataStack) return false;
      const data = el._x_dataStack[0];
      return data && !data.loading && data.restaurants.length > 0;
    },
    { timeout: 10_000 }
  );
}

/**
 * Wait for loading to complete on the home page.
 * @param {import('@playwright/test').Page} page
 */
export async function waitForHomeReady(page) {
  await page.waitForFunction(
    () => {
      const el = document.querySelector('.home-content');
      if (!el || !el._x_dataStack) return false;
      const data = el._x_dataStack[0];
      return data && !data.loading;
    },
    { timeout: 10_000 }
  );
}

/**
 * Get the list of restaurants from the list page.
 * @param {import('@playwright/test').Page} page
 */
export async function getRestaurantList(page) {
  return page.evaluate(() => {
    const el = document.querySelector('#restaurant-list');
    if (!el || !el._x_dataStack) return [];
    return el._x_dataStack[0].restaurants;
  });
}

/**
 * Wait for a success message to appear.
 * @param {import('@playwright/test').Page} page
 */
export async function waitForSuccessMessage(page) {
  await page.waitForSelector('.text-success:visible', { timeout: 5_000 });
}

/**
 * Wait for an error message to appear.
 * @param {import('@playwright/test').Page} page
 */
export async function waitForErrorMessage(page) {
  await page.waitForSelector('.text-destructive:visible', { timeout: 5_000 });
}

/**
 * Check if the page is in dark mode.
 * @param {import('@playwright/test').Page} page
 */
export async function isDarkMode(page) {
  return page.evaluate(() => document.documentElement.classList.contains('dark'));
}

/**
 * Navigate to a page and wait for Alpine.js.
 * Automatically injects Tauri mocks before navigation.
 * @param {import('@playwright/test').Page} page
 * @param {string} path - Path like '/list.html'
 */
export async function navigateAndWait(page, path) {
  await injectTauriMocks(page);
  await page.goto(path);
  await waitForAlpine(page);
}
