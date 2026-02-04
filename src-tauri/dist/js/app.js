// Sync theme to Tauri window (macOS titlebar)
async function syncTauriTheme(isDark) {
  if (!window.__TAURI__?.window) return;
  try {
    const win = window.__TAURI__.window.getCurrentWindow();
    await win.setTheme(isDark ? 'dark' : 'light');
  } catch (e) {
    console.warn('Failed to set Tauri window theme:', e);
  }
}

// Theme management
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  const stored = localStorage.getItem('themeMode');
  const useSystem = localStorage.getItem('useSystemTheme') !== 'false';
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;

  let isDark = useSystem ? prefersDark : stored === 'dark';
  if (isDark) document.documentElement.classList.add('dark');
  syncTauriTheme(isDark);

  // Listen for system theme changes
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('useSystemTheme') !== 'false') {
      document.documentElement.classList.toggle('dark', e.matches);
      syncTauriTheme(e.matches);
    }
  });

  // Highlight active nav item
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  const navMap = {
    'index.html': 'nav-home',
    'add.html': 'nav-add',
    'list.html': 'nav-list',
    'settings.html': 'nav-settings',
  };
  const activeNav = document.getElementById(navMap[page]);
  if (activeNav) activeNav.classList.add('active');
});

// Global theme toggle function
window.toggleTheme = function () {
  const isDark = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('themeMode', isDark ? 'dark' : 'light');
  localStorage.setItem('useSystemTheme', 'false');
  syncTauriTheme(isDark);
};

// Global system theme function
window.setSystemTheme = function (useSystem) {
  localStorage.setItem('useSystemTheme', useSystem);
  if (useSystem) {
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
    syncTauriTheme(prefersDark);
  }
};
