import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), "");

  // Require VITE_PLUGIN_PHRASE to be set in CI
  if (!env.VITE_PLUGIN_PHRASE) {
    const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;
    if (isCI) {
      console.error(
        "\n❌ ERROR: [figma-plugin:lib] VITE_PLUGIN_PHRASE environment variable is missing or empty.",
      );
      console.error(
        "This variable is required for production builds. Please ensure it is set in your CI environment.\n",
      );
      process.exit(1);
    } else {
      console.warn(
        "\n⚠️ WARNING: [figma-plugin:lib] VITE_PLUGIN_PHRASE is missing. Using a dummy value for local development.",
      );
      console.warn(
        "Some features (e.g. encryption/decryption) may not function correctly without the real secret.\n",
      );
      // Set a placeholder for local development
      env.VITE_PLUGIN_PHRASE = "local-development-placeholder";
    }
  }

  return {
    plugins: [react()],
    build: {
      emptyOutDir: false,
      target: "es2017",
      lib: {
        entry: "src/plugin/main.ts",
        name: "FigmaPlugin",
        fileName: "figma-plugin",
        formats: ["es"],
      },
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          format: "es",
          entryFileNames: "figma-plugin.js",
          inlineDynamicImports: true,
        },
      },
      outDir: mode === "development" ? "dist-dev" : "dist",
    },
  };
});
