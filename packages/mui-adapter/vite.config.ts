import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import recursicaVars from "@recursica/recursica-postcss-vars";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

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
    css: {
      postcss: {
        plugins: [
          recursicaVars({
            cssPath: require.resolve(
              "@recursica/official-release/recursica_variables_scoped.css",
            ),
          }),
        ],
      },
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
              name: "RecursicaMUIAdapter",
              formats: ["es", "cjs"],
              fileName: (format) =>
                `mui-adapter.${format === "es" ? "js" : "cjs"}`,
            },
            rollupOptions: {
              external: [
                "react",
                "react-dom",
                "react/jsx-runtime",
                "@mui/material",
                "@emotion/react",
                "@emotion/styled",
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
