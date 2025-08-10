import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number; // 뷰포트 밖에 추가로 렌더링할 아이템 수
}

/**
 * 가상화된 스크롤 컴포넌트
 * 대량의 리스트 데이터를 효율적으로 렌더링
 */
export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // 보이는 아이템의 인덱스 범위 계산
  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // 렌더링할 아이템들
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute' as const,
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        },
      });
    }
    return result;
  }, [items, visibleRange, itemHeight]);

  // 전체 컨테이너 높이
  const totalHeight = items.length * itemHeight;

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, style }) => (
          <div key={index} style={style}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 가변 높이 가상 스크롤 컴포넌트
 */
interface VariableVirtualScrollProps<T> {
  items: T[];
  estimatedItemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemHeight?: (item: T, index: number) => number;
  className?: string;
  overscan?: number;
}

export function VariableVirtualScroll<T>({
  items,
  estimatedItemHeight,
  containerHeight,
  renderItem,
  getItemHeight,
  className = '',
  overscan = 5,
}: VariableVirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [measuredHeights, setMeasuredHeights] = useState<Map<number, number>>(
    new Map()
  );
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const itemElementsRef = useRef<Map<number, HTMLDivElement>>(new Map());

  // 아이템 높이 계산
  const getItemHeightMemoized = useCallback(
    (index: number) => {
      if (getItemHeight) {
        return getItemHeight(items[index], index);
      }
      return measuredHeights.get(index) || estimatedItemHeight;
    },
    [items, getItemHeight, measuredHeights, estimatedItemHeight]
  );

  // 누적 높이 계산
  const itemOffsets = useMemo(() => {
    const offsets = [0];
    for (let i = 0; i < items.length; i++) {
      offsets[i + 1] = offsets[i] + getItemHeightMemoized(i);
    }
    return offsets;
  }, [items.length, getItemHeightMemoized]);

  // 보이는 범위 계산
  const visibleRange = useMemo(() => {
    let start = 0;
    let end = items.length - 1;

    // 이진 탐색으로 시작 인덱스 찾기
    let left = 0;
    let right = items.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (itemOffsets[mid] < scrollTop) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    start = Math.max(0, left - overscan);

    // 끝 인덱스 찾기
    const visibleBottom = scrollTop + containerHeight;
    for (let i = start; i < items.length; i++) {
      if (itemOffsets[i] > visibleBottom) {
        end = Math.min(items.length - 1, i + overscan);
        break;
      }
    }

    return { start, end };
  }, [scrollTop, containerHeight, itemOffsets, items.length, overscan]);

  // 렌더링할 아이템들
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute' as const,
          top: itemOffsets[i],
          left: 0,
          right: 0,
          height: getItemHeightMemoized(i),
        },
      });
    }
    return result;
  }, [items, visibleRange, itemOffsets, getItemHeightMemoized]);

  // 전체 높이
  const totalHeight = itemOffsets[items.length] || 0;

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 아이템 높이 측정
  useEffect(() => {
    if (!getItemHeight) {
      const newMeasuredHeights = new Map(measuredHeights);
      let hasChanges = false;

      itemElementsRef.current.forEach((element, index) => {
        if (element) {
          const height = element.getBoundingClientRect().height;
          if (height !== measuredHeights.get(index)) {
            newMeasuredHeights.set(index, height);
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        setMeasuredHeights(newMeasuredHeights);
      }
    }
  }, [visibleItems, getItemHeight, measuredHeights]);

  // 아이템 ref 설정
  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      if (el) {
        itemElementsRef.current.set(index, el);
      } else {
        itemElementsRef.current.delete(index);
      }
    },
    []
  );

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, style }) => (
          <div key={index} ref={setItemRef(index)} style={style}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 무한 스크롤 가상화 컴포넌트
 */
interface InfiniteVirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  className?: string;
  overscan?: number;
  loadMoreThreshold?: number; // 바닥에서 몇 픽셀 떨어진 곳에서 로드할지
}

export function InfiniteVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  className = '',
  overscan = 5,
  loadMoreThreshold = 200,
}: InfiniteVirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // 보이는 아이템의 인덱스 범위 계산
  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // 무한 스크롤 감지
  useEffect(() => {
    const scrollElement = scrollElementRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      setScrollTop(scrollTop);

      // 바닥 근처에 도달했는지 확인
      if (
        hasNextPage &&
        !isNextPageLoading &&
        scrollHeight - scrollTop - clientHeight < loadMoreThreshold
      ) {
        loadNextPage();
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isNextPageLoading, loadNextPage, loadMoreThreshold]);

  // 렌더링할 아이템들
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute' as const,
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        },
      });
    }
    return result;
  }, [items, visibleRange, itemHeight]);

  // 전체 컨테이너 높이 (로딩 영역 포함)
  const totalHeight = items.length * itemHeight + (hasNextPage ? 100 : 0);

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, style }) => (
          <div key={index} style={style}>
            {renderItem(item, index)}
          </div>
        ))}

        {/* 로딩 인디케이터 */}
        {hasNextPage && (
          <div
            style={{
              position: 'absolute',
              top: items.length * itemHeight,
              left: 0,
              right: 0,
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isNextPageLoading ? (
              <div className="text-gray-500">로딩 중...</div>
            ) : (
              <div className="text-gray-400">스크롤하여 더 보기</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
