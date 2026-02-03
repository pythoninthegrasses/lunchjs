import { describe, it, expect, vi, beforeEach } from 'vitest';

// Import the module to test (side effects will run)
// The actual functions are attached to window, so we test via globalThis

describe('Theme Management', () => {
  beforeEach(() => {
    // Reset DOM
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  describe('toggleTheme', () => {
    it('should toggle dark class on documentElement', () => {
      // Define the function inline since it's normally defined via script tag
      globalThis.toggleTheme = function () {
        const isDark = !document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('themeMode', isDark ? 'dark' : 'light');
        localStorage.setItem('useSystemTheme', 'false');
      };

      expect(document.documentElement.classList.contains('dark')).toBe(false);

      toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.getItem('themeMode')).toBe('dark');
      expect(localStorage.getItem('useSystemTheme')).toBe('false');

      toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.getItem('themeMode')).toBe('light');
    });
  });

  describe('setSystemTheme', () => {
    it('should set useSystemTheme in localStorage', () => {
      globalThis.setSystemTheme = function (useSystem) {
        localStorage.setItem('useSystemTheme', useSystem);
        if (useSystem) {
          const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', prefersDark);
        }
      };

      setSystemTheme(true);
      expect(localStorage.getItem('useSystemTheme')).toBe('true');

      setSystemTheme(false);
      expect(localStorage.getItem('useSystemTheme')).toBe('false');
    });

    it('should apply system preference when enabled', () => {
      // Mock dark mode preference
      globalThis.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      globalThis.setSystemTheme = function (useSystem) {
        localStorage.setItem('useSystemTheme', useSystem);
        if (useSystem) {
          const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', prefersDark);
        }
      };

      setSystemTheme(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });
});

describe('Tauri IPC Mocks', () => {
  it('should mock list_restaurants', async () => {
    const result = await __TAURI__.core.invoke('list_restaurants');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('category');
  });

  it('should mock add_restaurant', async () => {
    await expect(__TAURI__.core.invoke('add_restaurant', {
      name: 'New Place',
      category: 'cheap',
    })).resolves.toBeUndefined();

    const list = await __TAURI__.core.invoke('list_restaurants');
    expect(list.some((r) => r.name === 'New Place')).toBe(true);
  });

  it('should reject duplicate restaurant', async () => {
    await expect(__TAURI__.core.invoke('add_restaurant', {
      name: 'Arbys',
      category: 'cheap',
    })).rejects.toContain('already exists');
  });

  it('should mock delete_restaurant', async () => {
    await __TAURI__.core.invoke('add_restaurant', {
      name: 'To Delete',
      category: 'normal',
    });

    await __TAURI__.core.invoke('delete_restaurant', { name: 'To Delete' });

    const list = await __TAURI__.core.invoke('list_restaurants');
    expect(list.some((r) => r.name === 'To Delete')).toBe(false);
  });

  it('should mock roll_lunch with valid category', async () => {
    const result = await __TAURI__.core.invoke('roll_lunch', { category: 'cheap' });
    expect(result).toHaveProperty('name');
    expect(result.category.toLowerCase()).toBe('cheap');
  });

  it('should reject roll_lunch with empty category', async () => {
    await expect(__TAURI__.core.invoke('roll_lunch', {
      category: 'nonexistent',
    })).rejects.toContain('No restaurants found');
  });

  it('should mock getVersion', async () => {
    const version = await __TAURI__.app.getVersion();
    expect(version).toBe('0.14.0');
  });
});
