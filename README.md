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

## 기술 스택

### Frontend
- **React 19** with TypeScript
- **Vite** (빌드 도구)
- **Tailwind CSS** (스타일링)
- **React Router** (라우팅)
- **Heroicons** (아이콘)

### Backend
- **Node.js** with Express
- **TypeScript**
- **SQLite** (개발용 데이터베이스)
- **JWT** (인증)
- **bcryptjs** (비밀번호 암호화)

### 결제
- **토스 페이먼츠 API**

## 설치 및 실행

### 의존성 설치
```bash
npm install
```

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
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

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
])
```
