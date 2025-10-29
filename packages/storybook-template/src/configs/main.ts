/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StorybookConfig } from "@storybook/react-vite";

export interface MainConfigOptions {
  stories: string[];
  addons?: string[];
  basePath?: string;
  enableCORS?: boolean;
}

// Get shared story paths - resolve at runtime to avoid bundling
const getSharedStoryPaths = (): string[] => {
  const { resolve } = require("path");
  const { dirname } = require("path");
  const storyDir = resolve(dirname(__filename), "../stories");

  return [
    resolve(storyDir, "Introduction.stories.tsx"),
    resolve(storyDir, "Color.stories.tsx"),
    resolve(storyDir, "Grid.stories.tsx"),
    resolve(storyDir, "Size.stories.tsx"),
    resolve(storyDir, "Themes.stories.tsx"),
  ];
};

export const createMainConfig = (
  options: MainConfigOptions,
): StorybookConfig => {
  const {
    stories,
    addons = [
      "@storybook/addon-onboarding",
      "@storybook/addon-docs",
      "@storybook/addon-a11y",
      "@storybook/addon-vitest",
    ],
    basePath = "/",
    enableCORS = true,
  } = options;

  // Automatically include shared stories
  const allStories = [...stories, ...getSharedStoryPaths()];

  const config: StorybookConfig = {
    stories: allStories,
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
  config.viteFinal = async (config) => {
    // Set base path for deployment
    if (basePath !== "/") {
      config.base = process.env.NODE_ENV === "production" ? basePath : "/";
    }

    // Add CORS headers for iframe embedding
    if (enableCORS) {
      config.plugins = config.plugins || [];
      config.plugins.push({
        name: "cors-headers",
        configureServer(server: any) {
          server.middlewares.use((_req: any, res: any, next: any) => {
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
      const { copyFileSync, existsSync } = await import("fs");
      const { join } = await import("path");

      config.plugins = config.plugins || [];
      config.plugins.push({
        name: "copy-headers-file",
        closeBundle() {
          const headersSource = join(__dirname, "_headers");
          const headersDest = join(__dirname, "../storybook-static/_headers");

          if (existsSync(headersSource)) {
            copyFileSync(headersSource, headersDest);
            console.log("✅ Copied _headers file to storybook-static/");
          } else {
            console.warn("⚠️ _headers file not found in .storybook directory");
          }
        },
      });
    }

    return config;
  };

  return config;
};
