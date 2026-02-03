import { vi } from 'vitest';

// Mock restaurant data
const mockRestaurants = [
  { name: 'Arbys', category: 'cheap' },
  { name: "Bubba's", category: 'normal' },
  { name: 'Chipotle', category: 'cheap' },
];

// Track added restaurants for testing
let addedRestaurants = [];

// Mock Tauri IPC
globalThis.__TAURI__ = {
  core: {
    invoke: vi.fn((cmd, args) => {
      switch (cmd) {
        case 'list_restaurants':
          return Promise.resolve([...mockRestaurants, ...addedRestaurants]);

        case 'add_restaurant':
          if (mockRestaurants.some((r) => r.name === args.name)) {
            return Promise.reject(`Restaurant '${args.name}' already exists`);
          }
          addedRestaurants.push({ name: args.name, category: args.category });
          return Promise.resolve();

        case 'delete_restaurant':
          addedRestaurants = addedRestaurants.filter((r) => r.name !== args.name);
          return Promise.resolve();

        case 'update_restaurant':
          return Promise.resolve();

        case 'roll_lunch': {
          const category = args.category;
          const available = [...mockRestaurants, ...addedRestaurants].filter(
            (r) => r.category.toLowerCase() === category.toLowerCase()
          );
          if (available.length === 0) {
            return Promise.reject('No restaurants found!');
          }
          const random = available[Math.floor(Math.random() * available.length)];
          return Promise.resolve(random);
        }

        default:
          return Promise.reject(`Unknown command: ${cmd}`);
      }
    }),
  },
  app: {
    getVersion: vi.fn(() => Promise.resolve('0.14.0')),
  },
};

// Reset mocks between tests
beforeEach(() => {
  addedRestaurants = [];
  vi.clearAllMocks();
});

// Mock localStorage (converts values to strings like real localStorage)
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[key] ?? null),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = String(value);
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
