import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        base: '/SomaKids/',
        plugins: [react()],
        server: {
            proxy: {
                '/api/chat': {
                    target: 'https://qianfan.baidubce.com/v2/chat/completions',
                    changeOrigin: true,
                    rewrite: function () { return ''; },
                    headers: {
                        Authorization: "Bearer ".concat(env.QIANFAN_API_KEY || env.VITE_QIANFAN_API_KEY || ''),
                    },
                },
            },
        },
    };
});
