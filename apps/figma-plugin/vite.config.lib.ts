import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/plugin/code.ts',
      name: 'ViteReactPlugin',
      formats: ['es'],
    },
  },
});
