import { useCallback, useRef, useEffect, useState } from 'react';

/**
 * 디바운스된 콜백 함수를 반환하는 Hook
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * 스로틀된 콜백 함수를 반환하는 Hook
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
}

/**
 * 이전 값과 비교하여 변경된 경우에만 새 값을 반환하는 Hook
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * 깊은 비교를 통한 메모이제이션 Hook
 */
export function useDeepMemo<T>(factory: () => T, deps: readonly unknown[]): T {
  const ref = useRef<{ deps: readonly unknown[]; value: T } | null>(null);

  if (!ref.current || !isDeepEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

/**
 * 깊은 동등성 검사 함수
 */
function isDeepEqual(a: readonly unknown[], b: readonly unknown[]): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) {
      if (
        typeof a[i] === 'object' &&
        typeof b[i] === 'object' &&
        a[i] !== null &&
        b[i] !== null
      ) {
        if (
          !isObjectEqual(
            a[i] as Record<string, unknown>,
            b[i] as Record<string, unknown>
          )
        ) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  return true;
}

function isObjectEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!Object.is(a[key], b[key])) {
      if (
        typeof a[key] === 'object' &&
        typeof b[key] === 'object' &&
        a[key] !== null &&
        b[key] !== null
      ) {
        if (
          !isObjectEqual(
            a[key] as Record<string, unknown>,
            b[key] as Record<string, unknown>
          )
        ) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  return true;
}

/**
 * 함수를 안정적으로 유지하는 Hook (useCallback의 개선된 버전)
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    []
  );
}

/**
 * 로컬 스토리지와 동기화되는 상태 Hook
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * 비동기 작업 상태를 관리하는 Hook
 */
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  dependencies: readonly unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err as E);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data,
    error,
    isLoading,
    execute,
  };
}

/**
 * 컴포넌트 마운트 상태를 추적하는 Hook
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}
