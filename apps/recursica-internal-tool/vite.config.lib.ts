import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    target: "es2017",
    lib: {
      entry: "src/plugin/main.ts",
      name: "FigmaPlugin",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        format: "es",
        entryFileNames: "recursica-internal-tool.js",
      },
    },
    outDir: mode === "development" ? "dist-dev" : "dist",
  },
}));
