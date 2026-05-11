import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/SomaKids/',
  plugins: [react()],
  server: {
    proxy: {
      '/qianfan': {
        target: 'https://qianfan.baidubce.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/qianfan/, ''),
      },
    },
  },
});
