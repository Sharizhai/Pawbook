import { defineConfig } from 'vite'
import { resolve } from 'path';
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist/client',
//   },
// })

export default defineConfig({
  build: {
    outDir: 'dist/client',
  },
  plugins: [
    {
      name: 'copy-headers',
      closeBundle() {
        const headersPath = resolve(__dirname, 'public/_headers');
        const distPath = resolve(__dirname, 'dist/_headers');
        
        try {
          if (fs.existsSync(headersPath)) {
            fs.copyFileSync(headersPath, distPath);
          }
        } catch (error) {
          console.error('Error copying _headers file:', error);
        }
      },
    },
  ],
  resolve: {
    alias: {
      path: 'path-browserify', // Optionnel, pour la compatibilité du module path
    },
  },
});