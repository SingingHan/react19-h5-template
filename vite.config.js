import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var _b;
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var proxyPrefix = env.VITE_PROXY_PREFIX;
    var proxyTarget = env.VITE_PROXY_TARGET;
    return {
        plugins: [react()],
        server: {
            host: '0.0.0.0',
            port: 5173,
            proxy: proxyPrefix && proxyTarget
                ? (_b = {},
                    _b[proxyPrefix] = {
                        target: proxyTarget,
                        changeOrigin: true,
                        rewrite: function (path) { return path.replace(new RegExp("^".concat(proxyPrefix)), ''); }
                    },
                    _b) : undefined
        },
        resolve: {
            alias: {
                '@': '/src'
            }
        }
    };
});
