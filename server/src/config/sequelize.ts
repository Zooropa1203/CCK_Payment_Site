import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/cck.sqlite',
  logging: false,
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ 데이터베이스 연결 성공');
    await sequelize.sync();
    console.log('✅ 데이터베이스 동기화 완료');
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    process.exit(1);
  }
}
