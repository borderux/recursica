import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';
import type { OutputChunk } from 'rollup';
import chokidar from 'chokidar';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Plugin to watch HTML file changes and trigger rebuilds
    {
      name: 'watch-html',
      buildStart() {
        if (mode === 'development') {
          const htmlPath = path.resolve(process.cwd(), 'dist-dev/index.html');

          console.log(`👀 Watching HTML file: ${htmlPath}`);

          if (fs.existsSync(htmlPath)) {
            const watcher = chokidar.watch(htmlPath, { persistent: true });
            watcher.on('change', () => {
              console.log('🔄 HTML file changed, triggering plugin code rebuild...');
              // Force a rebuild by touching the main source file
              const mainFile = path.resolve(process.cwd(), 'src/plugin/main.ts');
              if (fs.existsSync(mainFile)) {
                const time = new Date();
                fs.utimesSync(mainFile, time, time);
              }
            });
          }
        }
      },
    },
    // Plugin to inject __html__ for development mode
    {
      name: 'inject-html',
      generateBundle(options, bundle) {
        if (mode === 'development' || mode === 'test') {
          // Read the built HTML file from the appropriate directory
          const htmlDir = mode === 'development' ? 'dist-dev' : 'dist-test';
          const htmlPath = path.resolve(process.cwd(), `${htmlDir}/index.html`);

          console.log(`🔍 Looking for HTML at: ${htmlPath}`);
          console.log(`🔍 HTML exists: ${fs.existsSync(htmlPath)}`);

          if (fs.existsSync(htmlPath)) {
            const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
            console.log(`📄 HTML content loaded (${htmlContent.length} chars)`);

            // Find the main plugin bundle
            const pluginFile = Object.keys(bundle).find((file) => file.endsWith('.js'));
            if (pluginFile && bundle[pluginFile].type === 'chunk') {
              const chunk = bundle[pluginFile] as OutputChunk;
              chunk.code = `const __html__ = ${JSON.stringify(htmlContent)};\n${chunk.code}`;
              console.log(`✅ HTML injected into ${pluginFile}`);
            }
          } else {
            console.warn(`❌ HTML file not found at ${htmlPath}`);
          }
        }
      },
    },
  ],
  build: {
    emptyOutDir: false,
    sourcemap: false, // Disabled - not useful in Figma's sandbox environment
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
