import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }) as any,
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "StorybookTemplate",
      formats: ["es", "cjs"],
      fileName: (format) =>
        `storybook-template.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: (id) => {
        // Externalize React and related packages
        if (id === "react" || id === "react-dom" || id.startsWith("react/")) {
          return true;
        }
        // Externalize Storybook packages
        if (id.startsWith("@storybook/")) {
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
