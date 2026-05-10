import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: '/product-experience-center/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: false,
    hmr: {
      overlay: true,
    },
    // macOS 의 일부 경로(예: 외부 볼륨, 사내 보안 파일시스템 마운트)에서 chokidar
    // 파일 감지가 실패해 HMR 이 동작하지 않는 케이스를 대비해 폴링을 강제한다.
    watch: {
      usePolling: true,
      interval: 200,
    },
  },
});
