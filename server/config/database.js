import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
// 환경변수 로드
dotenv.config();
// 개발용으로 SQLite 사용 (나중에 MySQL로 전환 가능)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/cck_payment.sqlite',
    logging: console.log, // SQL 로깅 활성화
    define: {
        timestamps: true, // createdAt, updatedAt 자동 추가
        underscored: false, // camelCase 유지
    },
});
// MySQL 설정 (프로덕션용)
/*
const sequelize = new Sequelize(
  process.env.DB_NAME || 'cck_payment',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
*/
export default sequelize;
//# sourceMappingURL=database.js.map