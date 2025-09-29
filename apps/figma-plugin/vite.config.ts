import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), viteSingleFile()],

  build: {
    emptyOutDir: false,
    outDir: mode === 'development' ? 'dist-dev' : mode === 'test' ? 'dist-test' : 'dist',
    target: 'es2017', // Ensure compatibility with Figma's plugin environment
    sourcemap: mode === 'development' || mode === 'test', // Generate source maps for dev/test
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  define: {
    // Set VITE_PLUGIN_MODE based on the build mode
    'import.meta.env.VITE_PLUGIN_MODE': JSON.stringify(
      mode === 'development' ? 'development' : mode === 'test' ? 'test' : 'production'
    ),
  },
}));
