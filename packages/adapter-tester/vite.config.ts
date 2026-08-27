import { defineConfig, type PluginOption } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isLibrary = mode === "library";

  return {
    plugins: [
      ...(isLibrary
        ? [
            dts({
              insertTypesEntry: true,
              exclude: ["**/*.spec.*"],
            }),
          ]
        : []),
    ] as PluginOption[],
    ...(isLibrary
      ? {
          build: {
            lib: {
              entry: {
                index: resolve(__dirname, "src/index.ts"),
                testing: resolve(__dirname, "src/testing.ts"),
                cli: resolve(__dirname, "src/cli.ts"),
              },
              formats: ["es", "cjs"],
              fileName: (format, entryName) =>
                `${entryName}.${format === "es" ? "js" : "cjs"}`,
            },
            rollupOptions: {
              // This is a Node library, not a browser bundle: leave Node
              // builtins and its own runtime dependencies unbundled so the
              // consumer's own node_modules resolves them.
              external: (id) =>
                id.startsWith("node:") ||
                [
                  "@playwright/test",
                  "pixelmatch",
                  "pngjs",
                  "express",
                  "http-proxy-middleware",
                ].includes(id),
              output: {
                // Only the `cli` entry is directly executed via `bin`.
                banner: (chunk) =>
                  chunk.name === "cli" ? "#!/usr/bin/env node" : "",
              },
            },
            sourcemap: true,
            emptyOutDir: true,
          },
        }
      : {}),
  };
});
