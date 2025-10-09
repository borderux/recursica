import type { StorybookConfig } from "@storybook/react-vite";

export interface MainConfigOptions {
  stories: string[];
  addons?: string[];
  basePath?: string;
  enableCORS?: boolean;
  copyHeadersFile?: boolean;
  recursicaBundle?: any; // The recursica JSON bundle
}

// Get shared story paths
const getSharedStoryPaths = (): string[] => {
  return [
    require.resolve("../stories/Introduction.stories.tsx"),
    require.resolve("../stories/Tokens/Color.stories.tsx"),
    require.resolve("../stories/Tokens/Grid.stories.tsx"),
    require.resolve("../stories/Tokens/Size.stories.tsx"),
  ];
};

export const createMainConfig = (
  options: MainConfigOptions,
): StorybookConfig => {
  const {
    stories,
    addons = [
      "@storybook/addon-onboarding",
      "@chromatic-com/storybook",
      "@storybook/addon-docs",
      "@storybook/addon-a11y",
      "@storybook/addon-vitest",
    ],
    basePath = "/",
    enableCORS = false,
    copyHeadersFile = false,
    recursicaBundle,
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

  // Add viteFinal configuration if needed
  if (basePath !== "/" || enableCORS || copyHeadersFile) {
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
      if (copyHeadersFile) {
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
              console.warn(
                "⚠️ _headers file not found in .storybook directory",
              );
            }
          },
        });
      }

      return config;
    };
  }

  return config;
};
