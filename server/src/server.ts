import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/sequelize.js';
import { initializeDatabase } from './models/index.js';
import competitionsRouter from './routes/competitions.routes.js';
import authRouter from './routes/auth.routes.js';
import registrationsRouter from './routes/registrations.routes.js';

const app = express();
const PORT = process.env.PORT || 5175;

// 미들웨어 설정
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 헬스체크 라우트
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'CCK Payment Server',
  });
});

// API 라우트 연결
app.use('/api/competitions', competitionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/registrations', registrationsRouter);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// 에러 핸들러
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('서버 에러:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
});

// 서버 시작
async function startServer() {
  try {
    // 데이터베이스 연결
    await connectDB();
    
    // 데이터베이스 초기화
    await initializeDatabase();
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 CCK Payment Server started on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🏆 Competitions API: http://localhost:${PORT}/api/competitions`);
      console.log(`👤 Auth API: http://localhost:${PORT}/api/auth`);
      console.log(`📝 Registrations API: http://localhost:${PORT}/api/registrations`);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
}

// 서버 시작
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호 수신. 서버를 gracefully 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT 신호 수신. 서버를 gracefully 종료합니다...');
  process.exit(0);
});
