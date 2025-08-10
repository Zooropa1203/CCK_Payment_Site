/**
 * 성능 모니터링 유틸리티
 */

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private timers: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 성능 측정 시작
   */
  start(name: string): void {
    this.timers.set(name, performance.now());
  }

  /**
   * 성능 측정 종료 및 기록
   */
  end(name: string): number | null {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`No start time found for performance metric: ${name}`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);

    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // 개발 환경에서만 로그 출력
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log(`🚀 Performance: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * 모든 성능 메트릭 조회
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * 특정 이름의 성능 메트릭 조회
   */
  getMetricsByName(name: string): PerformanceMetrics[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  /**
   * 성능 메트릭 초기화
   */
  clear(): void {
    this.metrics = [];
    this.timers.clear();
  }

  /**
   * 평균 성능 계산
   */
  getAverageTime(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;

    const total = metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / metrics.length;
  }
}

// 싱글톤 인스턴스 생성
export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * 함수 실행 시간을 측정하는 데코레이터
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  name: string,
  fn: T
): T {
  return ((...args: any[]) => {
    performanceMonitor.start(name);
    try {
      const result = fn(...args);
      
      // Promise인 경우 처리
      if (result instanceof Promise) {
        return result.finally(() => {
          performanceMonitor.end(name);
        });
      }
      
      performanceMonitor.end(name);
      return result;
    } catch (error) {
      performanceMonitor.end(name);
      throw error;
    }
  }) as T;
}

/**
 * React 컴포넌트 렌더링 시간 측정 Hook
 */
export function usePerformanceTracking(componentName: string) {
  const renderStart = performance.now();

  React.useEffect(() => {
    const renderTime = performance.now() - renderStart;
    
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log(`🎨 Render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  });
}

/**
 * Core Web Vitals 측정
 */
export function measureWebVitals() {
  // Largest Contentful Paint (LCP)
  if ('LargestContentfulPaint' in window) {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // First Input Delay (FID)
  if ('PerformanceEventTiming' in window) {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as any; // PerformanceEventTiming은 experimental API
        if (fidEntry.processingStart) {
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
        }
      });
    }).observe({ entryTypes: ['first-input'] });
  }

  // Cumulative Layout Shift (CLS)
  if ('LayoutShift' in window) {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// React import 추가
import React from 'react';
