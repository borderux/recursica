import { vi } from 'vitest';

// Mock Figma plugin API
global.figma = {
  showUI: vi.fn(),
  closePlugin: vi.fn(),
  ui: {
    postMessage: vi.fn(),
    onmessage: vi.fn(),
  },
  currentUser: {
    id: 'test-user-id',
  },
  variables: {
    getLocalVariableCollectionsAsync: vi.fn(),
  },
  teamLibrary: {
    getAvailableLibraryVariableCollectionsAsync: vi.fn(),
  },
} as any;

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_PLUGIN_MODE: 'test',
    MODE: 'test',
  },
  writable: true,
});
