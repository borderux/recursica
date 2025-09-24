import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import type { OutputChunk } from 'rollup';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Plugin to inject __html__ for development mode
    {
      name: 'inject-html',
      generateBundle(options, bundle) {
        if (mode === 'development' || mode === 'test') {
          // Read the built HTML file from the appropriate directory
          const htmlDir = mode === 'development' ? 'dist-dev' : 'dist-test';
          const htmlPath = path.resolve(__dirname, `${htmlDir}/index.html`);
          if (fs.existsSync(htmlPath)) {
            const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

            // Find the main plugin bundle
            const pluginFile = Object.keys(bundle).find((file) => file.endsWith('.js'));
            if (pluginFile && bundle[pluginFile].type === 'chunk') {
              const chunk = bundle[pluginFile] as OutputChunk;
              chunk.code = `const __html__ = ${JSON.stringify(htmlContent)};\n${chunk.code}`;
            }
          }
        }
      },
    },
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/plugin/main.ts',
      name: 'FigmaPlugin',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
    outDir: mode === 'development' ? 'dist-dev' : mode === 'test' ? 'dist-test' : 'dist',
  },
}));
