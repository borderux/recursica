import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isLibrary = mode === "library";

  return {
    plugins: [
      react(),
      svgr(),
      ...(isLibrary
        ? [
            dts({
              insertTypesEntry: true,
              exclude: ["**/*.stories.*", ".storybook/**"],
            }),
          ]
        : []),
    ] as PluginOption[],
    ...(isLibrary
      ? {
          build: {
            lib: {
              entry: resolve(__dirname, "src/index.ts"),
              name: "RecursicaAdapterCommon",
              formats: ["es", "cjs"],
              fileName: (format) =>
                `adapter-common.${format === "es" ? "js" : "cjs"}`,
            },
            rollupOptions: {
              external: ["react", "react-dom", "react/jsx-runtime"],
              output: {
                globals: {
                  react: "React",
                  "react-dom": "ReactDOM",
                },
              },
            },
            sourcemap: true,
            emptyOutDir: true,
          },
        }
      : {}),
  };
});
