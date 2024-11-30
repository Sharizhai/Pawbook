import { defineConfig } from 'vite'
import { resolve } from 'path';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist/client',
//   },
// })

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  plugins: [
    {
      name: 'copy-headers',
      closeBundle() {
        const fs = require('fs');
        const path = require('path');
        const headersPath = path.resolve(__dirname, 'public/_headers');
        const distPath = path.resolve(__dirname, 'dist/_headers');
        if (fs.existsSync(headersPath)) {
          fs.copyFileSync(headersPath, distPath);
        }
      },
    },
  ],
});