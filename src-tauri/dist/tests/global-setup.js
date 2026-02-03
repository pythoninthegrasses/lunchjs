/**
 * Tauri mock script to be injected into pages before Alpine.js loads.
 * This simulates the window.__TAURI__ API for E2E testing.
 */
export const tauriMockScript = `
// Mock restaurant data
const mockRestaurants = [
  { name: 'Arbys', category: 'cheap' },
  { name: "Bubba's", category: 'normal' },
  { name: 'Chipotle', category: 'cheap' },
  { name: 'Olive Garden', category: 'normal' },
  { name: 'Taco Bell', category: 'cheap' },
];

// Track added/deleted restaurants for session
let sessionRestaurants = [...mockRestaurants];

// Mock Tauri IPC
window.__TAURI__ = {
  core: {
    invoke: async (cmd, args) => {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 50));

      switch (cmd) {
        case 'list_restaurants':
          return [...sessionRestaurants].sort((a, b) => a.name.localeCompare(b.name));

        case 'add_restaurant':
          if (sessionRestaurants.some(r => r.name === args.name)) {
            throw "Restaurant '" + args.name + "' already exists";
          }
          sessionRestaurants.push({ name: args.name, category: args.category });
          return;

        case 'delete_restaurant':
          sessionRestaurants = sessionRestaurants.filter(r => r.name !== args.name);
          return;

        case 'update_restaurant':
          // Check for name conflict if renaming
          if (args.originalName !== args.newName) {
            if (sessionRestaurants.some(r => r.name === args.newName)) {
              throw "Restaurant '" + args.newName + "' already exists";
            }
          }
          const idx = sessionRestaurants.findIndex(r => r.name === args.originalName);
          if (idx >= 0) {
            sessionRestaurants[idx] = { name: args.newName, category: args.newCategory };
          }
          return;

        case 'roll_lunch': {
          const category = args.category.toLowerCase();
          const available = sessionRestaurants.filter(
            r => r.category.toLowerCase() === category
          );
          if (available.length === 0) {
            throw 'No restaurants found!';
          }
          return available[Math.floor(Math.random() * available.length)];
        }

        default:
          throw 'Unknown command: ' + cmd;
      }
    },
  },
  app: {
    getVersion: async () => '0.14.0',
  },
};

console.log('[E2E] Tauri mock initialized with', sessionRestaurants.length, 'restaurants');
`;
