import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { useDebounce, useThrottle, useLocalStorage } from '../hooks/useOptimization'

describe('최적화 Hooks 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  describe('useDebounce', () => {
    it('디바운스 콜백이 올바르게 작동한다', () => {
      const mockCallback = vi.fn()
      const { result } = renderHook(() => useDebounce(mockCallback, 500))

      act(() => {
        result.current('test1')
        result.current('test2')
        result.current('test3')
      })

      // 아직 호출되지 않았어야 함
      expect(mockCallback).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(500)
      })

      // 마지막 호출만 실행되어야 함
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith('test3')
    })

    it('디바운스 시간 내에 다시 호출하면 타이머가 리셋된다', () => {
      const mockCallback = vi.fn()
      const { result } = renderHook(() => useDebounce(mockCallback, 500))

      act(() => {
        result.current('test1')
      })

      act(() => {
        vi.advanceTimersByTime(300)
      })

      act(() => {
        result.current('test2')
      })

      act(() => {
        vi.advanceTimersByTime(300)
      })

      // 아직 호출되지 않았어야 함
      expect(mockCallback).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(200)
      })

      // 이제 마지막 호출이 실행되어야 함
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith('test2')
    })
  })

  describe('useThrottle', () => {
    it('스로틀 콜백이 올바르게 작동한다', () => {
      const mockCallback = vi.fn()
      const { result } = renderHook(() => useThrottle(mockCallback, 500))

      act(() => {
        result.current('test1')
        result.current('test2')
        result.current('test3')
      })

      // 첫 번째 호출만 실행되어야 함
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith('test1')

      act(() => {
        vi.advanceTimersByTime(500)
      })

      act(() => {
        result.current('test4')
      })

      // 이제 새로운 호출이 실행되어야 함
      expect(mockCallback).toHaveBeenCalledTimes(2)
      expect(mockCallback).toHaveBeenCalledWith('test4')
    })
  })

  describe('useLocalStorage', () => {
    const key = 'test-key'
    const initialValue = 'initial'

    beforeEach(() => {
      // localStorage mock 재설정
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      }
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
      localStorage.clear()
    })

    it('초기값을 올바르게 설정한다', () => {
      localStorage.getItem = vi.fn().mockReturnValue(null)
      
      const { result } = renderHook(() => useLocalStorage(key, initialValue))
      
      expect(result.current[0]).toBe(initialValue)
    })

    it('로컬스토리지에 값을 저장한다', () => {
      localStorage.getItem = vi.fn().mockReturnValue(null)
      localStorage.setItem = vi.fn()
      
      const { result } = renderHook(() => useLocalStorage(key, initialValue))
      
      act(() => {
        result.current[1]('new value')
      })

      expect(result.current[0]).toBe('new value')
      expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify('new value'))
    })

    it('로컬스토리지에서 기존 값을 불러온다', () => {
      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify('stored value'))
      
      const { result } = renderHook(() => useLocalStorage(key, initialValue))
      
      expect(result.current[0]).toBe('stored value')
    })

    it('함수형 업데이트를 지원한다', () => {
      localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(0))
      localStorage.setItem = vi.fn()
      
      const { result } = renderHook(() => useLocalStorage(key, 0))
      
      act(() => {
        result.current[1](prev => prev + 1)
      })

      expect(result.current[0]).toBe(1)
    })

    it('잘못된 JSON 데이터가 있을 때 초기값을 사용한다', () => {
      localStorage.getItem = vi.fn().mockReturnValue('invalid json')
      
      const { result } = renderHook(() => useLocalStorage(key, initialValue))
      
      expect(result.current[0]).toBe(initialValue)
    })
  })
})
