import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import svgr from "vite-plugin-svgr";

// Vite config for Storybook development only
// Library builds are handled by Rollup (rollup.config.js)
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), svgr()],
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
    preprocessorOptions: {
      scss: {
        // Add any global SCSS variables or mixins here
      },
    },
  },
  // No build config - this is only for Storybook development
  // Library builds are handled by Rollup
});
