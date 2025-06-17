/**
 * WARNING: This file is auto-generated from a JSON schema. Do not edit directly.
 */

/**
 * Configuration file for Recursica theme generation
 */
export interface RecursicaConfiguration {
  /**
   * Schema of the configuration file
   */
  $schema?: string;
  /**
   * Name of the project for which themes will be generated
   */
  project:
    | string
    | {
        /**
         * Name of the project for which themes will be generated
         */
        name?: string;
        /**
         * Root path of the project
         */
        root?: string;
        /**
         * Path to the adapter file
         */
        adapter?: string;
      };
  /**
   * Object containing icons configuration
   */
  icons?: {
    /**
     * Path to the output file for the icons
     */
    output?: string;
    /**
     * Object containing icons to include
     */
    include?: {
      /**
       * Names of the icons to transform
       */
      names?: string[];
      /**
       * Variants of the icons to transform
       */
      variants?: string[];
    };
    [k: string]: unknown;
  };
  /**
   * Path to the JSON files for the project
   */
  jsonsPath?: string;
  /**
   * Object containing overrides for the theme
   */
  overrides?: {
    /**
     * Object containing theme configuration
     */
    mantineTheme?: {
      /**
       * 1-scale of the theme
       */
      "1-scale"?: string;
      /**
       * Background of the theme
       */
      background?: string;
    };
    /**
     * Font weight of the theme
     */
    fontWeight?: {
      /**
       * Font family of the theme
       */
      fontFamily?: string;
      /**
       * Font weight value
       */
      value?: number;
      /**
       * Font weight alias
       */
      alias?: string;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
}
