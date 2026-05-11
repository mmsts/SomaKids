import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [react()],
    server: {
      proxy: {
        '/api/chat': {
          target: 'https://qianfan.baidubce.com/v2/chat/completions',
          changeOrigin: true,
          rewrite: () => '',
          headers: {
            Authorization: `Bearer ${env.QIANFAN_API_KEY || env.VITE_QIANFAN_API_KEY || ''}`,
          },
        },
      },
    },
  };
});
