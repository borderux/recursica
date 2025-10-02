// Define our own Recursica type to avoid issues with the generated types
export interface Recursica {
  tokens: Record<string, string>;
  uiKit: Record<string, string>;
  themes: Record<string, Record<string, string>>;
}

/**
 * Global storage for the Recursica design system
 */
declare global {
  interface Window {
    __RECURSICA__?: Recursica;
  }
}

/**
 * Factory class for managing Recursica design system globally
 */
export class RecursicaFactory {
  private static instance: RecursicaFactory;
  private recursica: Recursica | undefined = undefined;

  private constructor() {}

  /**
   * Get the singleton instance of RecursicaFactory
   */
  public static getInstance(): RecursicaFactory {
    if (!RecursicaFactory.instance) {
      RecursicaFactory.instance = new RecursicaFactory();
    }
    return RecursicaFactory.instance;
  }

  /**
   * Initialize the Recursica design system
   * This should be called once when the application starts
   * @param recursicaData - The recursica data object to initialize with
   */
  public initialize(recursicaData: Recursica): Recursica {
    if (this.recursica) {
      return this.recursica;
    }

    this.recursica = recursicaData;

    // Store globally on window object for browser environments
    if (typeof window !== "undefined") {
      window.__RECURSICA__ = this.recursica;
    }

    return this.recursica!;
  }

  /**
   * Get the current Recursica instance
   * Throws an error if not initialized
   */
  public getRecursica(): Recursica {
    if (!this.recursica) {
      throw new Error(
        "RecursicaFactory not initialized. Call initialize() first.",
      );
    }
    return this.recursica;
  }

  /**
   * Check if Recursica is initialized
   */
  public isInitialized(): boolean {
    return this.recursica !== undefined;
  }

  /**
   * Get a design token value
   * @param token - The token key (e.g., 'color/salmon/600')
   */
  public getToken(token: keyof Recursica["tokens"]): string {
    const recursica = this.getRecursica();
    return recursica.tokens[token] || "";
  }

  /**
   * Get a UI Kit value
   * @param key - The UI Kit key
   */
  public getUiKit(key: keyof Recursica["uiKit"]): string {
    const recursica = this.getRecursica();
    return recursica.uiKit[key] || "";
  }

  /**
   * Get a theme value
   * @param theme - The theme name
   * @param key - The theme key
   */
  public getTheme(theme: keyof Recursica["themes"], key: string): string {
    const recursica = this.getRecursica();
    return recursica.themes[theme]?.[key] || "";
  }
}

/**
 * Convenience function to get the RecursicaFactory instance
 */
export const getRecursicaFactory = (): RecursicaFactory => {
  return RecursicaFactory.getInstance();
};

/**
 * Convenience function to set Recursica data
 * @param recursicaData - The recursica data object to store globally
 */
export const setRecursica = (recursicaData: Recursica): Recursica => {
  const instance = getRecursicaFactory().initialize(recursicaData);
  return instance;
};

/**
 * Convenience function to get the current Recursica instance
 */
export const getRecursica = (): Recursica => {
  console.log("🔍 getRecursica called");
  const factory = getRecursicaFactory();
  console.log("🔍 Factory instance:", factory);
  console.log("🔍 Factory recursica property:", factory["recursica"]);
  return factory.getRecursica();
};

/**
 * Convenience function to initialize Recursica (deprecated, use setRecursica instead)
 * @param recursicaData - The recursica data object to initialize with
 * @deprecated Use setRecursica instead
 */
export const initializeRecursica = (recursicaData: Recursica): Recursica => {
  return getRecursicaFactory().initialize(recursicaData);
};
