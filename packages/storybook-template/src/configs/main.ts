import type { StorybookConfig } from "@storybook/react-vite";

export interface MainConfigOptions {
  /** Array of story file patterns to include, e.g. ["../src/.../*.stories.*"] */
  stories: string[];
  /** Array of Storybook addons to load. Defaults to common addons (docs, a11y, vitest, etc.) */
  addons?: string[];
  /** Base path for deployment (useful for GitHub Pages). Defaults to "/" */
  basePath?: string;
  /** Enable CORS headers and remove X-Frame-Options to allow iframe embedding. Defaults to true */
  enableCORS?: boolean;
  /** Enable injection of the `@recursica/recursica-postcss-vars` plugin into the Vite CSS pipeline. Defaults to false */
  enablePostcssVars?: boolean;
  /** Absolute path to the Recursica scoped variables CSS file. Used if enablePostcssVars is true */
  recursicaCSSPath?: string;
  /** Enforces strict mode for postcss vars plugin (throws on missing vars). If undefined, defaults to true in PRODUCTION mode */
  postCSSStrictMode?: boolean;
}

export const createMainConfig = (
  options: MainConfigOptions,
): StorybookConfig => {
  const {
    stories,
    addons = [
      "@storybook/addon-onboarding",
      "@storybook/addon-docs",
      "@storybook/addon-a11y",
      "storybook-dark-mode",
    ],
    basePath = "/",
    enableCORS = true,
    enablePostcssVars = false,
    recursicaCSSPath,
    postCSSStrictMode,
  } = options;

  const config: StorybookConfig = {
    stories: async (list) => {
      const pathModule = await import("path");
      const urlModule = await import("url");
      const { dirname, join } = pathModule;
      const { fileURLToPath } = urlModule;
      const currentFilename =
        typeof __filename !== "undefined"
          ? __filename
          : fileURLToPath(import.meta.url);
      const currentDir = dirname(currentFilename);

      const sharedStories = [
        join(currentDir, "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"),
      ];

      return [...(list || []), ...stories, ...sharedStories];
    },
    addons,
    framework: {
      name: "@storybook/react-vite",
      options: {},
    },
    typescript: {
      reactDocgen: "react-docgen-typescript",
      reactDocgenTypescriptOptions: {
        shouldExtractLiteralValuesFromEnum: true,
        propFilter: (prop) =>
          prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
      },
    },
  };

  // Add viteFinal configuration
  config.viteFinal = async (viteConfig) => {
    // Inject Postcss
    if (enablePostcssVars && recursicaCSSPath) {
      const recursicaVars = (await import("@recursica/recursica-postcss-vars"))
        .default;
      viteConfig.css = viteConfig.css || {};
      viteConfig.css.postcss = {
        plugins: [
          recursicaVars({
            cssPath: recursicaCSSPath,
            ...(postCSSStrictMode !== undefined
              ? { strict: postCSSStrictMode }
              : {}),
          }),
        ],
      };
    }

    // Set base path for deployment
    if (basePath !== "/") {
      viteConfig.base = process.env.NODE_ENV === "production" ? basePath : "/";
    }

    // Add CORS headers for iframe embedding
    if (enableCORS) {
      viteConfig.plugins = viteConfig.plugins || [];
      viteConfig.plugins.push({
        name: "cors-headers",
        configureServer(server: import("vite").ViteDevServer) {
          server.middlewares.use((_req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
              "Access-Control-Allow-Methods",
              "GET, POST, PUT, OPTIONS",
            );
            res.setHeader(
              "Access-Control-Allow-Headers",
              "Content-Type, Authorization",
            );
            // Remove X-Frame-Options to allow iframe embedding
            res.removeHeader("X-Frame-Options");
            // Set Content-Security-Policy to allow iframe embedding
            res.setHeader(
              "Content-Security-Policy",
              "frame-ancestors 'self' *; frame-src 'self' *;",
            );
            next();
          });
        },
      });
    }

    // Add plugin to copy _headers file during build
    if (enableCORS) {
      const fsModule = await import("fs");
      const pathModule = await import("path");
      const urlModule = await import("url");

      const { copyFileSync, existsSync } = fsModule;
      const { join, dirname } = pathModule;
      const { fileURLToPath } = urlModule;

      viteConfig.plugins = viteConfig.plugins || [];
      viteConfig.plugins.push({
        name: "copy-headers-file",
        closeBundle() {
          const currentFilename =
            typeof __filename !== "undefined"
              ? __filename
              : fileURLToPath(import.meta.url);
          const currentDir = dirname(currentFilename);
          const headersSource = join(currentDir, "_headers");
          const headersDest = join(currentDir, "../storybook-static/_headers");

          if (existsSync(headersSource)) {
            copyFileSync(headersSource, headersDest);
            // eslint-disable-next-line no-console
            console.log("✅ Copied _headers file to storybook-static/");
          } else {
            // eslint-disable-next-line no-console
            console.warn("⚠️ _headers file not found in .storybook directory");
          }
        },
      });
    }

    return viteConfig;
  };

  return config;
};
