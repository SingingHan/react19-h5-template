import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyPrefix = env.VITE_PROXY_PREFIX;
  const proxyTarget = env.VITE_PROXY_TARGET;

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy:
        proxyPrefix && proxyTarget
          ? {
              [proxyPrefix]: {
                target: proxyTarget,
                changeOrigin: true,
                rewrite: (path) => path.replace(new RegExp(`^${proxyPrefix}`), '')
              }
            }
          : undefined
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  };
});
