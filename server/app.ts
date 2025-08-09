import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, createSampleData } from './models/index.ts';

// 라우트 임포트
import competitionsRouter from './routes/competitions.ts';
import authRouter from './routes/auth.ts';
import registrationsRouter from './routes/registrations.ts';

// 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // 프론트엔드 URL
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 라우트 설정
app.use('/api/competitions', competitionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/registrations', registrationsRouter);

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CCK Payment Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// 기본 엔드포인트
app.get('/', (req, res) => {
  res.json({
    message: 'CCK Payment API Server',
    version: '1.0.0',
    endpoints: {
      competitions: '/api/competitions',
      auth: '/api/auth',
      registrations: '/api/registrations',
      health: '/api/health',
    },
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '엔드포인트를 찾을 수 없습니다.',
    path: req.originalUrl,
  });
});

// 에러 핸들러
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('서버 오류:', error);
  res.status(500).json({
    success: false,
    message: '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

// 서버 시작 함수
async function startServer() {
  try {
    // 데이터베이스 초기화
    console.log('🔄 데이터베이스 초기화 중...');
    await initializeDatabase();

    // 샘플 데이터 생성 (선택적)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 샘플 데이터 확인 중...');
      await createSampleData();
    }

    // 서버 시작
    app.listen(PORT, () => {
      console.log('🚀 CCK Payment Server 시작 완료!');
      console.log(`📡 서버 주소: http://localhost:${PORT}`);
      console.log(`🌍 환경: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
      console.log('📋 사용 가능한 API 엔드포인트:');
      console.log(`   GET  /api/health                 - 서버 상태 확인`);
      console.log(`   GET  /api/competitions           - 대회 목록`);
      console.log(`   POST /api/competitions           - 새 대회 생성`);
      console.log(`   GET  /api/competitions/:id       - 대회 상세 정보`);
      console.log(`   POST /api/auth/register          - 회원가입`);
      console.log(`   POST /api/auth/login             - 로그인`);
      console.log(`   GET  /api/auth/check-username/:username - 아이디 중복 확인`);
      console.log(`   GET  /api/auth/check-email/:email       - 이메일 중복 확인`);
      console.log(`   POST /api/auth/request-reset     - 비밀번호 재설정 요청`);
      console.log(`   POST /api/registrations          - 대회 참가 신청`);
      console.log(`   GET  /api/registrations/user/:user_id - 사용자별 신청 목록`);
      console.log(`   GET  /api/registrations/competition/:competition_id - 대회별 참가자 목록`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
}

// 프로세스 종료 처리
process.on('SIGINT', () => {
  console.log('\n🛑 서버 종료 중...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 서버 종료 중...');
  process.exit(0);
});

// 서버 시작
startServer();

export default app;
