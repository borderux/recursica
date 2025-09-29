import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    viteSingleFile({
      // Make inlined code more readable in development
      removeViteModuleLoader: mode === 'development',
      useRecommendedBuildConfig: mode === 'production',
    }),
  ],
  build: {
    emptyOutDir: false, // Don't clear manifest.json
    outDir: mode === 'development' ? 'dist-dev' : mode === 'test' ? 'dist-test' : 'dist',
    target: 'es2017', // Ensure compatibility with Figma's plugin environment
    sourcemap: false, // Disabled for UI - inlined code makes source maps less useful
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
}));
