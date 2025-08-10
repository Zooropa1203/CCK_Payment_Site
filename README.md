# CCK Payment - 루빅스 큐브 대회 접수 및 결제 시스템

## 프로젝트 개요

이 프로젝트는 루빅스 큐브 대회의 온라인 접수 및 결제를 위한 웹 애플리케이션입니다.

## 주요 기능

### 사용자 기능

- **메인 페이지**: 현재 공지된 대회 리스트 조회
- **대회 상세 페이지**: 대회 정보, 일정, 참가자 명단, 대기자 명단 조회
- **접수 페이지**: 종목 선택 및 온라인 결제
- **로그인/회원가입**: 계정 관리 및 개인정보 편집
- **프로필 페이지**: 개인정보 및 참가 내역 관리

### 관리 기능

- **대회 관리**: 대회 생성, 수정, 삭제 (Organizer, Administrator)
- **회원 관리**: 회원 리스트 조회 및 권한 관리 (Administrator)

### 기술적 특징

- **반응형 디자인**: PC, 모바일, 태블릿 지원
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 변경
- **토스 페이먼츠 연동**: 안전한 온라인 결제
- **권한 기반 접근 제어**: Administrator, Organizer, Member 권한 체계
- **타입 안전성**: TypeScript와 Zod 스키마 검증
- **접근성**: WCAG AA 준수

## 기술 스택

### Frontend

- **React 19** with TypeScript
- **Vite 7** (빌드 도구)
- **Design Tokens** (CSS 변수 기반 스타일링)
- **React Router 7** (라우팅)
- **React Hook Form** + **Zod** (폼 검증)
- **Custom UI Components** (접근성 준수)

### Backend

- **Node.js** with Express
- **TypeScript**
- **Sequelize** + **SQLite** (ORM과 데이터베이스)
- **Zod** (스키마 검증)

### Shared

- **Zod Schemas** (타입 공유)
- **TypeScript Types** (클라이언트-서버 타입 일관성)

### 결제

- **토스 페이먼츠 API**

## 설치 및 실행

### 1. 저장소 클론

```bash
git clone [repository-url]
cd CCK_Payment
```

### 2. 의존성 설치

```bash
# 루트 프로젝트 의존성 설치
npm install

# 서버 의존성 설치
cd server && npm install && cd ..

# 공유 타입 의존성 설치
cd shared && npm install && cd ..
```

### 3. 환경 변수 설정

```bash
# 클라이언트 환경 변수
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5175

# 서버 환경 변수
cp server/.env.example server/.env
# PORT=5175
# DB_PATH=./database.sqlite
# CORS_ORIGINS=http://localhost:5173
# JWT_SECRET=your-super-secret-jwt-key
```

### 4. 개발 서버 실행

#### 서버와 클라이언트 동시 실행 (권장)

```bash
npm run dev:all
```

#### 개별 실행

```bash
# 서버만 실행 (포트 5175)
npm run server:dev

# 클라이언트만 실행 (포트 5173)
npm run dev
```

### 5. 프로덕션 빌드

```bash
# 클라이언트 빌드
npm run build

# 서버 빌드
cd server && npm run build
```

## 프로젝트 구조

```
CCK_Payment/
├── src/                      # 클라이언트 소스
│   ├── components/          # 재사용 가능한 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   ├── layouts/            # 레이아웃 컴포넌트
│   ├── contexts/           # React Context
│   ├── services/           # API 서비스 레이어
│   ├── routes/             # 라우팅 설정
│   ├── styles/             # 글로벌 스타일 및 토큰
│   └── types/              # TypeScript 타입
├── server/                  # 서버 소스
│   ├── src/
│   │   ├── config/         # 데이터베이스 설정
│   │   ├── models/         # Sequelize 모델
│   │   ├── routes/         # API 라우트
│   │   └── server.ts       # 서버 진입점
│   └── .env.example        # 서버 환경 변수 예시
├── shared/                  # 공유 타입 및 스키마
│   ├── schemas.ts          # Zod 스키마 정의
│   └── index.ts            # 타입 내보내기
├── public/                  # 정적 파일
└── .env.example            # 클라이언트 환경 변수 예시
```

## 개발 가이드

### 코드 스타일

```bash
# 린팅
npm run lint

# 포매팅
npm run format
```

### API 엔드포인트

#### 대회 관리

- `GET /api/competitions` - 대회 목록 조회
- `GET /api/competitions/:id` - 대회 상세 조회
- `GET /api/competitions/:id/schedule` - 대회 일정 조회
- `GET /api/competitions/:id/participants` - 참가자 목록 조회
- `GET /api/competitions/:id/waitlist` - 대기자 목록 조회

#### 인증

- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입

#### 참가 신청

- `POST /api/registrations` - 대회 참가 신청

### 환경 변수

#### 클라이언트 (.env)

- `VITE_API_BASE_URL`: 서버 API 기본 URL

#### 서버 (server/.env)

- `PORT`: 서버 포트 (기본값: 5175)
- `DB_PATH`: SQLite 데이터베이스 파일 경로
- `CORS_ORIGINS`: CORS 허용 오리진 (쉼표로 구분)
- `JWT_SECRET`: JWT 서명 키
- `FRONTEND_URL`: 프론트엔드 URL

## 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.

### 개발 서버 실행

#### 프론트엔드만 실행

```bash
npm run dev
```

#### 백엔드만 실행

```bash
npm run server
```

#### 프론트엔드 + 백엔드 동시 실행

```bash
npm run dev:full
```

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
