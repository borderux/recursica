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
      external: [
        "react",
        "react-dom",
        "@storybook/react-vite",
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        "@storybook/addon-onboarding",
        "@storybook/addon-vitest",
        "fs",
        "path",
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
