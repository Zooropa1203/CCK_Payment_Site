# 성능 최적화 가이드

CCK Payment 시스템의 성능 최적화를 위한 도구와 기법들을 소개합니다.

## 🚀 최적화 기능

### 1. 번들 최적화

- **코드 스플리팅**: 페이지별, 벤더별 청크 분리
- **Tree Shaking**: 사용하지 않는 코드 제거
- **압축 최적화**: Gzip/Brotli 압축 지원

### 2. 이미지 최적화

```tsx
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="설명"
  width={300}
  height={200}
  loading="lazy"
  placeholder="/path/to/placeholder.jpg"
/>;
```

### 3. 가상 스크롤링

대량 데이터 목록 렌더링 최적화:

```tsx
import { VirtualScroll } from '@/components/VirtualScroll';

<VirtualScroll
  items={largeDataArray}
  itemHeight={50}
  containerHeight={400}
  renderItem={(item, index) => <ItemComponent key={index} item={item} />}
/>;
```

### 4. 성능 모니터링

```tsx
import { performanceMonitor } from '@/utils/performance';

// 함수 실행 시간 측정
performanceMonitor.start('data-fetch');
await fetchData();
performanceMonitor.end('data-fetch');

// 컴포넌트 렌더링 시간 추적
function MyComponent() {
  usePerformanceTracking('MyComponent');
  return <div>Content</div>;
}
```

### 5. 최적화 Hooks

```tsx
import {
  useDebounce,
  useThrottle,
  useLocalStorage,
} from '@/hooks/useOptimization';

// 검색 입력 디바운싱
const debouncedSearch = useDebounce(searchFunction, 300);

// 스크롤 이벤트 스로틀링
const throttledScroll = useThrottle(scrollHandler, 100);

// 로컬 스토리지 동기화
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

## 📊 성능 측정

### 빌드 분석

```bash
# 번들 크기 분석
npm run build:analyze

# 번들 시각화
npm run bundle:analyze
```

### 성능 감사

```bash
# Lighthouse 보고서 생성
npm run performance:audit

# 번들 크기 확인
npm run check:size
```

### Core Web Vitals

브라우저에서 자동으로 측정됩니다:

- **LCP (Largest Contentful Paint)**: 2.5초 이하
- **FID (First Input Delay)**: 100ms 이하
- **CLS (Cumulative Layout Shift)**: 0.1 이하

## 🛠 개발 모드 최적화

### 환경 변수 설정

```env
# .env.development
VITE_API_BASE_URL=http://localhost:5175
VITE_NODE_ENV=development
VITE_LOG_LEVEL=debug

# .env.production
VITE_API_BASE_URL=https://your-api.com
VITE_NODE_ENV=production
VITE_LOG_LEVEL=error
```

### HMR 최적화

개발 서버에서 빠른 갱신을 위한 설정이 적용되어 있습니다.

## 📈 프로덕션 최적화

### 빌드 설정

- **Minification**: esbuild로 최적화
- **CSS 압축**: 자동 압축 적용
- **Asset 인라인**: 4KB 이하 파일 인라인 처리
- **소스맵**: 프로덕션에서 비활성화

### 배포 권장사항

1. **CDN 사용**: 정적 자산 배포
2. **Gzip/Brotli**: 서버 압축 설정
3. **HTTP/2**: 멀티플렉싱 활용
4. **캐싱 정책**: 적절한 Cache-Control 헤더

## 🔍 성능 문제 해결

### 일반적인 이슈

1. **큰 번들 크기**: 코드 스플리팅 적용
2. **이미지 로딩 지연**: OptimizedImage 컴포넌트 사용
3. **긴 목록 렌더링**: VirtualScroll 적용
4. **메모리 누수**: useEffect cleanup 확인

### 모니터링 도구

- 브라우저 DevTools Performance 탭
- React Developer Tools Profiler
- Lighthouse 성능 감사
- Bundle Analyzer 리포트

## 📚 추가 자료

- [Vite 성능 가이드](https://vitejs.dev/guide/performance.html)
- [React 성능 최적화](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
