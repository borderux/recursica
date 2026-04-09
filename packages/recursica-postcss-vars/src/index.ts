/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
import * as fs from "fs";
import * as path from "path";

/**
 * Options for the PostCSS Plugin
 */
export interface PluginOptions {
  /**
   * Path to the CSS file containing the valid variable declarations (e.g., recursica_variables_scoped.css)
   */
  cssPath?: string;

  /**
   * If true, throws PostCSS errors instead of compilation warnings.
   */
  strict?: boolean;
}

const plugin = (opts: PluginOptions = {}) => {
  const knownVars = new Set<string>();

  if (opts.cssPath) {
    try {
      const resolvedPath = path.resolve(process.cwd(), opts.cssPath);
      const fileContent = fs.readFileSync(resolvedPath, "utf-8");

      // Extract every `--variable:` definition from the CSS source of truth.
      // This regex looks for CSS variable definitions like `--color-primary: #fff;`
      const definitionRegex = /(--[a-zA-Z0-9_-]+)\s*:/g;
      let match;
      while ((match = definitionRegex.exec(fileContent)) !== null) {
        knownVars.add(match[1]);
      }
    } catch (e: any) {
      console.warn(
        `[recursica-postcss-vars] Could not load CSS file at ${opts.cssPath}: ${e.message}`,
      );
    }
  } else {
    console.warn(
      `[recursica-postcss-vars] No cssPath provided. Plugin is disabled.`,
    );
  }

  return {
    postcssPlugin: "@recursica/recursica-postcss-vars",

    Declaration(decl: any, { result }: any) {
      if (opts.cssPath) {
        // Do not lint the exact dictionary CSS file itself to prevent circular confusion
        const resolvedPath = path.resolve(process.cwd(), opts.cssPath);
        if (decl.source?.input?.file === resolvedPath) return;
      }

      // Find all var(--xyz) in the CSS declaration value
      const varRegex = /var\(\s*(--[a-zA-Z0-9_-]+)(?:\s*,[^)]*)?\s*\)/g;
      let match;

      while ((match = varRegex.exec(decl.value)) !== null) {
        const cssVar = match[1];

        // Validating against the loaded CSS variables
        if (opts.cssPath && knownVars.size > 0) {
          // Only validate variables that start with --recursica
          if (cssVar.startsWith("--recursica") && !knownVars.has(cssVar)) {
            const fileName = decl.source?.input?.file
              ? path.relative(process.cwd(), decl.source.input.file)
              : "Unknown file";
            const line = decl.source?.start?.line || "?";
            const column = decl.source?.start?.column || "?";

            const message =
              `[recursica-postcss-vars] Missing variable: ${cssVar}\n` +
              `    at ${fileName}:${line}:${column}\n` +
              `    (Not found in ${path.basename(opts.cssPath)})`;

            const isProduction = process.env.NODE_ENV === "production";
            const strictMode =
              opts.strict !== undefined ? opts.strict : isProduction;

            if (strictMode) {
              console.error(
                `\n\x1b[31m❌ [recursica-postcss-vars] BUILD FAILED:\x1b[0m\n${message}\n`,
              );
              process.exit(1);
            } else {
              console.warn(
                `\n\x1b[33m⚠️ [recursica-postcss-vars] WARNING:\x1b[0m\n${message}\n`,
              );
              decl.warn(result, message);
            }
          }
        }
      }
    },
  };
};

plugin.postcss = true;
export default plugin;
