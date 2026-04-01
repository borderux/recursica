import { copyFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { StorybookConfig } from "@storybook/react-vite";
import recursicaVars from "@recursica/recursica-postcss-vars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-mcp",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Storybook title and configuration
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  viteFinal: async (config, { configType }) => {
    // Inject Postcss
    config.css = config.css || {};
    config.css.postcss = {
      plugins: [
        recursicaVars({
          cssPath: join(__dirname, "../recursica_variables_scoped.css"),
          strict: configType === "PRODUCTION",
        }),
      ],
    };

    // Set base path for GitHub Pages - deployed to root of recursica site
    config.base = process.env.NODE_ENV === "production" ? "/recursica/" : "/";

    // Add CORS headers for iframe embedding
    config.plugins = config.plugins || [];
    config.plugins.push({
      name: "cors-headers",
      configureServer(server) {
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

    // Add plugin to copy _headers file during build
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

    return config;
  },
};
export default config;
