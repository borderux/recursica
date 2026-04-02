import { defineConfig, type PluginOption } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }) as unknown as PluginOption,
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        main: resolve(__dirname, "src/configs/main.ts"),
        preview: resolve(__dirname, "src/configs/preview.ts"),
        manager: resolve(__dirname, "src/configs/manager.ts"),
      },
      name: "StorybookTemplate",
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: (id) => {
        // Externalize React and related packages
        if (id === "react" || id === "react-dom" || id.startsWith("react/")) {
          return true;
        }
        // Externalize Storybook packages
        if (id.startsWith("@storybook/") || id.startsWith("storybook/")) {
          return true;
        }
        // Externalize Node.js built-ins
        if (["fs", "path", "url", "util"].includes(id)) {
          return true;
        }
        return false;
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
