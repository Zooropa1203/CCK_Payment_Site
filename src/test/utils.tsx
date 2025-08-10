import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// All providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// 커스텀 render 함수
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock 데이터 팩토리들
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: '테스트 사용자',
  role: 'Member' as const,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

export const mockAdmin = {
  ...mockUser,
  id: 2,
  email: 'admin@example.com',
  name: '관리자',
  role: 'Administrator' as const,
};

export const mockCompetition = {
  id: 1,
  name: '2025 CCK 챔피언십',
  description: '2025년 첫 번째 공식 대회입니다.',
  date: '2025-03-15',
  location: '서울 올림픽공원',
  maxParticipants: 100,
  registrationFee: 25000,
  registrationStartDate: '2025-02-01',
  registrationEndDate: '2025-03-01',
  status: 'Open' as const,
  events: ['3x3', '2x2', '4x4'] as const,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

export const mockRegistration = {
  id: 1,
  userId: 1,
  competitionId: 1,
  events: ['3x3', '2x2'],
  totalFee: 25000,
  status: 'Pending' as const,
  registeredAt: '2025-02-15T00:00:00.000Z',
  user: mockUser,
  competition: mockCompetition,
};

// HTTP 응답 Mock 헬퍼
export const mockApiResponse = <T,>(data: T, success = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error occurred',
});

export const mockApiError = (message = 'API Error', status = 500) => ({
  success: false,
  error: message,
  status,
});

// localStorage Mock 헬퍼
export const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: (key: string) => mockLocalStorage.store[key] || null,
  setItem: (key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  },
  removeItem: (key: string) => {
    delete mockLocalStorage.store[key];
  },
  clear: () => {
    mockLocalStorage.store = {};
  },
};

// 비동기 유틸리티
export const waitFor = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// 에러 경계 테스트용
export const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// re-export everything
export * from '@testing-library/react';
export { customRender as render };
