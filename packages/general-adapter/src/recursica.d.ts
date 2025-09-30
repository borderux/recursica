/**
 * Global Recursica object declaration
 * This assumes the recursica object is available globally in the consuming application
 */

declare global {
  interface Window {
    recursica: typeof import("./recursica");
  }

  const recursica: typeof import("./recursica");
}

export {};
