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
      ...(isLibrary ? [dts({ insertTypesEntry: true })] : []),
    ] as PluginOption[],
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
    ...(isLibrary
      ? {
          build: {
            lib: {
              entry: resolve(__dirname, "src/index.ts"),
              name: "RecursicaUIKitMantine",
              formats: ["es", "cjs"],
              fileName: (format) =>
                `ui-kit-mantine.${format === "es" ? "js" : "cjs"}`,
            },
            rollupOptions: {
              external: [
                "react",
                "react-dom",
                "react/jsx-runtime",
                "@mantine/core",
                "@mantine/dates",
                "@mantine/hooks",
              ],
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
