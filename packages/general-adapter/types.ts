import type { RecursicaConfiguration } from "@recursica/schemas";

/** Recursica config overrides */
export interface RecursicaConfigOverrides {
  fontWeight: {
    fontFamily: string;
    value: number;
    alias: string;
  }[];
  fontFamily?: Record<string, string>;
}
/**
 * Recursica config icons
 */
export interface RecursicaConfigIcons {
  /** The path to the output file */
  output?: string;
  include: {
    /** The names of the icons */
    names?: string[];
    /** The variants of the icons */
    variants?: string[];
  };
  exclude: {
    /** The names of the icons */
    names?: string[];
    /** The variants of the icons */
    variants?: string[];
  };
}

export interface ValueToken {
  collection: string;
  name: string;
}

export type ThemeTokens = Record<string, string | Record<string, string>>;

export type ContractTokens = Record<string, null>;

export type JsonContentIcons = Record<string, string>;

/**
 * Represents a record of theme names to their respective theme tokens
 */
export type Themes = Record<string, Record<string, ThemeTokens>>;

/**
 * Represents the properties required for exporting tokens
 */
export interface ExportingProps {
  /** The path to the output file */
  outputPath: string;
  /** The project name */
  project: RecursicaConfiguration["project"];
  /** The root path of the project */
  rootPath?: string;
}

export interface ExportingResult {
  content: string;
  path: string;
  filename: string;
}
