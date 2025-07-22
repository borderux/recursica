import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts(),
    vanillaExtractPlugin({
      identifiers: ({ debugId, hash }) => {
        if (!debugId) {
          return `recursica-${hash}`;
        }
        return `recursica-${debugId?.replaceAll("/", "-")}`;
      },
    }),
    svgr(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "UIKit",
      fileName: "ui-kit",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "tabbable",
        "@mantine/core",
        "@floating-ui",
        "vite-plugin-svgr",
        "@vanilla-extract/css",
        "@vanilla-extract/vite-plugin",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
