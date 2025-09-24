import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), viteSingleFile()],

  build: {
    emptyOutDir: false,
    outDir: mode === 'development' ? 'dist-dev' : mode === 'test' ? 'dist-test' : 'dist',
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
}));
