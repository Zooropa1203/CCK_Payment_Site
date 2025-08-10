# 배포 가이드 (Deployment Guide)

## 배포 방법

### 1. Docker를 이용한 배포 (권장)

#### 사전 준비
1. Docker와 Docker Compose 설치
2. 환경 변수 설정

```bash
# .env 파일 생성 (루트 디렉터리)
cp .env.production.example .env
# 실제 값으로 환경 변수 수정
```

#### 배포 실행
```bash
# 이미지 빌드 및 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 상태 확인
docker-compose ps
```

#### 관리 명령어
```bash
# 서비스 중지
docker-compose down

# 서비스 재시작
docker-compose restart

# 이미지 재빌드
docker-compose up -d --build
```

### 2. 직접 배포

#### 사전 준비
```bash
# Node.js 18+ 설치 확인
node --version

# 프로젝트 클론
git clone [repository-url]
cd CCK_Payment
```

#### 빌드 및 실행
```bash
# 의존성 설치
npm install
cd server && npm install && cd ..

# 프론트엔드 빌드
npm run build

# 서버 빌드
cd server && npm run build && cd ..

# 프로덕션 실행
cd server && npm start
```

## 환경 변수 설정

### 필수 환경 변수

- `JWT_SECRET`: JWT 서명을 위한 비밀 키 (강력한 랜덤 문자열)
- `TOSS_CLIENT_KEY`: 토스 페이먼츠 클라이언트 키
- `TOSS_SECRET_KEY`: 토스 페이먼츠 서버 키

### 선택적 환경 변수

- `PORT`: 서버 포트 (기본값: 5175)
- `NODE_ENV`: 실행 환경 (production, development)
- `CORS_ORIGINS`: CORS 허용 오리진
- `DB_PATH`: SQLite 데이터베이스 파일 경로

## 헬스 체크

배포 후 다음 엔드포인트로 서비스 상태를 확인할 수 있습니다:

```bash
curl http://localhost:5175/health
```

응답 예시:
```json
{
  "status": "OK",
  "timestamp": "2025-08-10T07:27:38.754Z",
  "uptime": 30.1229893,
  "service": "CCK Payment Server"
}
```

## 도메인 연결

### 프론트엔드
정적 파일들(`dist/` 폴더)을 웹 서버에 배포하거나 CDN에 업로드합니다.

### 백엔드
서버를 리버스 프록시(Nginx, Apache) 뒤에서 실행하는 것을 권장합니다.

#### Nginx 설정 예시
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5175;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5175;
    }
}
```

## SSL/HTTPS 설정

프로덕션 환경에서는 반드시 HTTPS를 사용하세요:

1. Let's Encrypt를 이용한 무료 SSL 인증서
2. 클라우드 제공업체의 SSL 인증서
3. CDN (Cloudflare 등)을 통한 SSL

## 모니터링

### 로그 모니터링
```bash
# Docker logs
docker-compose logs -f app

# 직접 배포시 PM2 사용 권장
npm install -g pm2
pm2 start server/dist/server.js --name cck-payment
pm2 logs cck-payment
```

### 성능 모니터링
- 헬스 체크 엔드포인트를 통한 주기적 상태 확인
- 응답 시간 및 에러율 모니터링
- 데이터베이스 성능 모니터링

## 백업

### 데이터베이스 백업
```bash
# SQLite 백업
cp /path/to/database.sqlite /path/to/backup/database_$(date +%Y%m%d_%H%M%S).sqlite
```

### 자동 백업 스크립트
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
cp /app/data/database.sqlite /app/backups/database_$DATE.sqlite
find /app/backups -name "database_*.sqlite" -mtime +7 -delete
```

## 트러블슈팅

### 일반적인 문제

1. **서버가 시작되지 않음**
   - 포트 충돌 확인
   - 환경 변수 설정 확인
   - 로그 확인

2. **데이터베이스 연결 오류**
   - SQLite 파일 권한 확인
   - 디스크 공간 확인

3. **CORS 오류**
   - `CORS_ORIGINS` 환경 변수 확인
   - 프론트엔드 URL이 올바른지 확인

4. **결제 기능 오류**
   - 토스 페이먼츠 API 키 확인
   - 네트워크 연결 확인
