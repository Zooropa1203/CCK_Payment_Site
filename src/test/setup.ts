import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// 각 테스트 후 정리
afterEach(() => {
  cleanup();
});

// 전역 설정
beforeAll(() => {
  // ResizeObserver mock (일부 컴포넌트에서 필요)
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // IntersectionObserver mock (OptimizedImage 컴포넌트에서 필요)
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // MatchMedia mock (반응형 컴포넌트에서 필요)
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // localStorage mock
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // sessionStorage mock
  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
  });

  // fetch mock (기본값)
  global.fetch = vi.fn();

  // URL.createObjectURL mock
  Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    value: vi.fn(() => 'mocked-object-url'),
  });

  // performance.now mock
  Object.defineProperty(performance, 'now', {
    writable: true,
    value: vi.fn(() => Date.now()),
  });
});

// 콘솔 에러/경고 억제 (필요한 경우)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});
