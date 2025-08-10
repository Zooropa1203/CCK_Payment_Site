# 보안 체크리스트 (Security Checklist)

## 환경 변수 보안

### ✅ 완료된 항목
- [x] `.env` 파일이 `.gitignore`에 포함됨
- [x] `.env.example` 파일에 실제 값이 아닌 예시 값만 포함
- [x] JWT_SECRET이 환경 변수로 관리됨
- [x] 토스 페이먼츠 API 키가 환경 변수로 관리됨

### ⚠️ 배포 시 확인 필요
- [ ] JWT_SECRET이 강력한 랜덤 문자열로 설정됨 (최소 32자)
- [ ] 프로덕션에서 실제 토스 페이먼츠 API 키 사용
- [ ] NODE_ENV=production 설정

## 데이터베이스 보안

### ✅ 완료된 항목
- [x] SQLite 데이터베이스 파일이 `.gitignore`에 포함됨
- [x] Sequelize ORM 사용으로 SQL 인젝션 방지
- [x] 사용자 비밀번호 해시화 (bcryptjs)

### ⚠️ 배포 시 확인 필요
- [ ] 데이터베이스 파일에 적절한 권한 설정 (600)
- [ ] 정기적인 데이터베이스 백업 설정
- [ ] 민감한 정보 암호화 저장

## 네트워크 보안

### ✅ 완료된 항목
- [x] CORS 설정으로 허용된 오리진만 접근 가능
- [x] Express.js 기본 보안 헤더 설정

### ⚠️ 배포 시 확인 필요
- [ ] HTTPS 사용 (SSL/TLS 인증서)
- [ ] 보안 헤더 추가 (helmet.js 권장)
- [ ] Rate limiting 설정
- [ ] 리버스 프록시 뒤에서 실행

## 인증 및 권한

### ✅ 완료된 항목
- [x] JWT 기반 인증 시스템
- [x] 비밀번호 해시화
- [x] 역할 기반 접근 제어 (RBAC)

### ⚠️ 배포 시 확인 필요
- [ ] JWT 토큰 만료 시간 설정 (현재: 7일)
- [ ] 세션 관리 정책 수립
- [ ] 비밀번호 정책 강화 (최소 길이, 복잡성)

## 입력 검증

### ✅ 완료된 항목
- [x] Zod 스키마 검증 사용
- [x] 프론트엔드에서 폼 검증
- [x] 백엔드에서 이중 검증

### ⚠️ 개선 권장
- [ ] 파일 업로드 시 타입 및 크기 제한
- [ ] XSS 방지를 위한 입력 sanitization
- [ ] CSRF 토큰 구현

## API 보안

### ✅ 완료된 항목
- [x] RESTful API 설계
- [x] 적절한 HTTP 상태 코드 사용
- [x] 에러 메시지에서 민감한 정보 숨김

### ⚠️ 개선 권장
- [ ] API Rate Limiting
- [ ] API 키 인증 추가
- [ ] API 버전 관리

## 로깅 및 모니터링

### ⚠️ 배포 시 구현 필요
- [ ] 보안 이벤트 로깅
- [ ] 실패한 로그인 시도 모니터링
- [ ] 비정상적인 API 호출 패턴 감지
- [ ] 로그 파일 보안 설정

## 배포 보안

### ✅ 완료된 항목
- [x] Docker 컨테이너 사용
- [x] 비root 사용자로 실행
- [x] 최소 권한 원칙

### ⚠️ 배포 시 확인 필요
- [ ] 컨테이너 이미지 취약점 스캔
- [ ] 방화벽 설정
- [ ] 정기적인 보안 업데이트

## 권장 보안 개선사항

### 즉시 구현 권장
1. **helmet.js 추가**
   ```bash
   npm install helmet
   ```
   ```javascript
   import helmet from 'helmet';
   app.use(helmet());
   ```

2. **Rate Limiting 추가**
   ```bash
   npm install express-rate-limit
   ```
   ```javascript
   import rateLimit from 'express-rate-limit';
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use(limiter);
   ```

3. **Input Sanitization**
   ```bash
   npm install xss
   ```

### 중장기 구현 권장
1. **OAuth 2.0 / OIDC 구현**
2. **2FA (Two-Factor Authentication)**
3. **보안 감사 로그**
4. **침입 탐지 시스템**

## 보안 테스트

### 정기 수행 권장
- [ ] 의존성 취약점 스캔 (`npm audit`)
- [ ] 정적 보안 분석 도구 사용
- [ ] 침투 테스트
- [ ] 보안 코드 리뷰

## 규정 준수

### GDPR/개인정보보호법
- [ ] 개인정보 처리 방침 수립
- [ ] 사용자 동의 관리
- [ ] 데이터 삭제 권리 구현
- [ ] 데이터 최소화 원칙 적용

### PCI DSS (결제 관련)
- [x] 토스 페이먼츠 사용으로 PCI DSS 규정 준수
- [ ] 카드 정보 직접 저장 금지 확인
- [ ] 결제 로그 보안 관리
