import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    // Output the build files into the plugin's assets directory
    outDir: 'assets',
    // Disable emptyOutDir to prevent deleting assets/css/index.css (manually managed)
    emptyOutDir: false,
    // No manifest required for fixed filenames
    manifest: false,
    rollupOptions: {
      // Define entry points
      input: {
        admin: resolve(__dirname, 'src/App.jsx'),
        widget: resolve(__dirname, 'src/widget/FloatingButton.jsx'),
        tailwind: resolve(__dirname, 'src/tailwind-entry.css')
      },
      output: {
        entryFileNames: `js/[name].js`,
        chunkFileNames: `js/chunks/[name].js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return `css/tailwind-utilities[extname]`; // Use a new filename
          }
          return `media/[name][extname]`;
        }
      }
    }
  }
});
