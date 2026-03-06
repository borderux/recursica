import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), "");

  // Require VITE_PLUGIN_PHRASE to be set
  if (!env.VITE_PLUGIN_PHRASE) {
    console.error(
      "\n❌ ERROR: [recursica-publisher:lib] VITE_PLUGIN_PHRASE environment variable is missing or empty.",
    );
    console.error(
      "Please configure it in a .env.local file (get the value from an admin) and restart the dev server.\n",
    );
    process.exit(1);
  }

  return {
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
          entryFileNames: "recursica-publisher.js",
          inlineDynamicImports: true,
        },
      },
      outDir: mode === "development" ? "dist-dev" : "dist",
    },
  };
});
