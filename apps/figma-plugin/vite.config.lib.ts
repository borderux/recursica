import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/plugin/code.ts',
      name: 'FigmaPlugin',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
    outDir: mode === 'development' ? 'dist-dev' : 'dist',
  },
}));
