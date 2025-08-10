import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    // 번들 크기 최적화
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    
    // 코드 스플리팅 최적화
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 벤더 라이브러리들을 별도 청크로 분리
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'form-vendor';
            }
            return 'vendor';
          }
          
          // 페이지별 청크 분리
          if (id.includes('src/pages/admin')) {
            return 'admin';
          }
          if (id.includes('src/pages/competition')) {
            return 'competition';
          }
          if (id.includes('src/pages/auth')) {
            return 'auth';
          }
        },
        // 파일명 최적화
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const extType = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return 'assets/css/[name]-[hash].[ext]';
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash].[ext]';
          }
          return `assets/${extType}/[name]-[hash].[ext]`;
        },
      },
    },
    
    // 성능 최적화
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // 프로덕션에서는 소스맵 비활성화
    
    // 압축 최적화
    assetsInlineLimit: 4096, // 4KB 이하의 asset을 인라인으로 처리
  },
  
  // 개발 서버 최적화
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
    // 개발 서버 성능 최적화
    hmr: {
      overlay: false, // 에러 오버레이 비활성화로 성능 개선
    },
  },
  
  // 미리보기 서버 설정
  preview: {
    port: 4173,
    strictPort: true,
  },
  
  // 종속성 최적화
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
      'zod',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
})
