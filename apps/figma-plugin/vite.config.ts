import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), "");

  // Require VITE_PLUGIN_PHRASE to be set in CI
  if (!env.VITE_PLUGIN_PHRASE) {
    const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;
    if (isCI) {
      console.error(
        "\n❌ ERROR: [figma-plugin] VITE_PLUGIN_PHRASE environment variable is missing or empty.",
      );
      console.error(
        "This variable is required for production builds. Please ensure it is set in your CI environment.\n",
      );
      process.exit(1);
    } else {
      console.warn(
        "\n⚠️ WARNING: [figma-plugin] VITE_PLUGIN_PHRASE is missing. Using a dummy value for local development.",
      );
      console.warn(
        "Some features (e.g. encryption/decryption) may not function correctly without the real secret.\n",
      );
      // Set a placeholder for local development
      env.VITE_PLUGIN_PHRASE = "local-development-placeholder";
    }
  }

  return {
    plugins: [react(), viteSingleFile() as PluginOption],
    build: {
      emptyOutDir: false,
    },
  };
});
