import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 성능 최적화된 이미지 컴포넌트
 * - Lazy Loading 지원
 * - Intersection Observer 사용
 * - 플레이스홀더 및 에러 핸들링
 * - WebP 지원 감지
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  placeholder,
  fallback,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  // WebP 지원 감지
  const supportsWebP = useRef<boolean | null>(null);

  useEffect(() => {
    if (supportsWebP.current === null) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 1, 1);
        supportsWebP.current = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } else {
        supportsWebP.current = false;
      }
    }
  }, []);

  // Intersection Observer를 사용한 lazy loading
  useEffect(() => {
    if (loading === 'eager') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // 50px 전에 미리 로드
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  // 이미지 소스 최적화
  useEffect(() => {
    if (!isInView) return;

    let optimizedSrc = src;

    // WebP 지원하는 경우 WebP 버전 시도
    if (supportsWebP.current && src.match(/\.(jpg|jpeg|png)$/i)) {
      optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    setImageSrc(optimizedSrc);
  }, [src, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    
    // WebP 실패 시 원본 이미지로 fallback
    if (imageSrc !== src && imageSrc.includes('.webp')) {
      setImageSrc(src);
      return;
    }
    
    // 원본도 실패하면 fallback 이미지 사용
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
      setHasError(false);
      return;
    }
    
    onError?.();
  };

  const imageClasses = [
    className,
    'transition-opacity duration-300',
    isLoaded ? 'opacity-100' : 'opacity-0',
    hasError ? 'hidden' : '',
  ].filter(Boolean).join(' ');

  const placeholderClasses = [
    'absolute inset-0 bg-gray-200 dark:bg-gray-700',
    'flex items-center justify-center',
    'transition-opacity duration-300',
    isLoaded || hasError ? 'opacity-0' : 'opacity-100',
  ].join(' ');

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {/* 플레이스홀더 */}
      <div className={placeholderClasses}>
        {placeholder ? (
          <img
            src={placeholder}
            alt=""
            className="w-full h-full object-cover filter blur-sm"
            aria-hidden="true"
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-500">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 실제 이미지 */}
      {isInView && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={imageClasses}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          decoding="async"
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined,
          }}
        />
      )}

      {/* 에러 상태 */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm">이미지를 불러올 수 없습니다</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 이미지 프리로딩 유틸리티
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 다중 이미지 프리로딩
 */
export function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}
