// Export the factory and utilities
export {
  RecursicaFactory,
  getRecursicaFactory,
  setRecursica,
  getRecursica,
  initializeRecursica,
} from "./factory/recursica-factory.js";

// Export components
export { Button, type ButtonProps } from "./components/Button/index.js";

// Export styles
export * from "./styles/index.js";

// Re-export recursica types for convenience
export type { Recursica } from "./factory/recursica-factory.js";
