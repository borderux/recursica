import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), "");

  // Require VITE_PLUGIN_PHRASE to be set
  if (!env.VITE_PLUGIN_PHRASE) {
    console.error(
      "\n❌ ERROR: [recursica-publisher] VITE_PLUGIN_PHRASE environment variable is missing or empty.",
    );
    console.error(
      "Please configure it in a .env.local file (get the value from an admin) and restart the dev server.\n",
    );
    process.exit(1);
  }

  return {
    plugins: [react(), viteSingleFile() as PluginOption],
    build: {
      emptyOutDir: false,
    },
  };
});
