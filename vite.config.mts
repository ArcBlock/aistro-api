/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), createBlockletPlugin({ disableNodePolyfills: false }), svgr()],
    optimizeDeps: {
      exclude: ['eth-lib'],
    },
    resolve: {
      dedupe: ['react', 'react-dom', '@mui/material'],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-common': [
              'react',
              'react-dom',
              'react-router-dom',
              '@mui/material',
              '@mui/lab',
              '@mui/icons-material',
              'dayjs',
              'axios',
            ],
            'vendor-ux': ['@arcblock/ux'],
          },
        },
      },
    },
  };
});
