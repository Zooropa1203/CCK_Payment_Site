import { describe, it, expect } from 'vitest';

// 간단한 유틸리티 함수들
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

describe('유틸리티 함수 테스트', () => {
  describe('formatCurrency', () => {
    it('숫자를 한국 원화로 포맷팅한다', () => {
      expect(formatCurrency(25000)).toBe('₩25,000');
      expect(formatCurrency(0)).toBe('₩0');
      expect(formatCurrency(1234567)).toBe('₩1,234,567');
    });

    it('소수점 있는 금액을 올바르게 처리한다', () => {
      expect(formatCurrency(25000.5)).toBe('₩25,001');
      expect(formatCurrency(25000.4)).toBe('₩25,000');
    });
  });

  describe('formatDate', () => {
    it('문자열 날짜를 한국어로 포맷팅한다', () => {
      const result = formatDate('2025-03-15');
      expect(result).toContain('2025년');
      expect(result).toContain('3월');
      expect(result).toContain('15일');
    });

    it('Date 객체를 올바르게 포맷팅한다', () => {
      const date = new Date('2025-12-25');
      const result = formatDate(date);
      expect(result).toContain('2025년');
      expect(result).toContain('12월');
      expect(result).toContain('25일');
    });
  });

  describe('validateEmail', () => {
    it('유효한 이메일을 검증한다', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.kr')).toBe(true);
      expect(validateEmail('valid+email@test.org')).toBe(true);
    });

    it('잘못된 이메일을 거부한다', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('고유한 ID를 생성한다', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(5);
    });
  });

  describe('debounce', () => {
    it('디바운스 함수가 올바르게 작동한다', async () => {
      let callCount = 0;
      const increment = () => {
        callCount++;
      };
      const debouncedIncrement = debounce(increment, 100);

      // 빠르게 여러 번 호출
      debouncedIncrement();
      debouncedIncrement();
      debouncedIncrement();

      // 아직 실행되지 않았어야 함
      expect(callCount).toBe(0);

      // 100ms 대기
      await new Promise(resolve => setTimeout(resolve, 150));

      // 한 번만 실행되었어야 함
      expect(callCount).toBe(1);
    });
  });
});
