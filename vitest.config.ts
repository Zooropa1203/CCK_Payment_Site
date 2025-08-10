/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js',
        'dist/',
        'build/',
        'coverage/',
      ],
    },
    // 테스트 파일 패턴
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: ['node_modules/', 'dist/', '.idea/', '.git/', '.cache/'],
    // 성능 최적화
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    // 테스트 실행 시간 제한
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
