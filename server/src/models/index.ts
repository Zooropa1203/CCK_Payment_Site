import { sequelize } from '../config/sequelize.js';
import Competition from './competition.model.js';
import User from './user.model.js';
import Registration from './registration.model.js';

// 모델 간 관계 설정
function setupAssociations() {
  // Competition과 Registration의 관계 (1:N)
  Competition.hasMany(Registration, {
    foreignKey: 'competition_id',
    as: 'registrations',
  });
  Registration.belongsTo(Competition, {
    foreignKey: 'competition_id',
    as: 'Competition',
  });

  // User와 Registration의 관계 (1:N)
  User.hasMany(Registration, {
    foreignKey: 'user_id',
    as: 'registrations',
  });
  Registration.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'User',
  });
}

// 샘플 데이터 생성
async function createSampleData() {
  try {
    // 대회 데이터
    const competitionCount = await Competition.count();
    if (competitionCount === 0) {
      await Competition.bulkCreate([
        {
          date: '2025-12-15',
          name: '2025 CCK Winter Championship',
          location: '서울 강남구 코엑스',
          base_fee: 15000,
          event_fee: {
            '3x3': 5000,
            '4x4': 7000,
            '5x5': 7000,
            'OH': 6000,
            'Pyraminx': 5000,
          },
          reg_start_date: '2025-09-01',
          reg_end_date: '2025-11-30',
          events: ['3x3', '4x4', '5x5', 'OH', 'Pyraminx'],
        },
        {
          date: '2025-10-20',
          name: '2025 CCK Autumn Open',
          location: '부산 해운대구 벡스코',
          base_fee: 12000,
          event_fee: {
            '3x3': 4000,
            '4x4': 6000,
            'OH': 5000,
          },
          reg_start_date: '2025-08-15',
          reg_end_date: '2025-10-10',
          events: ['3x3', '4x4', 'OH'],
        },
      ]);
      console.log('✅ 샘플 대회 데이터 생성 완료');
    }

    // 사용자 데이터
    const userCount = await User.count();
    if (userCount === 0) {
      await User.bulkCreate([
        {
          name: '김큐브',
          username: 'cuber01',
          email: 'cuber01@example.com',
          password_hash: 'password123',
        },
        {
          name: '이스피드',
          username: 'speedcuber',
          email: 'speedcuber@example.com',
          password_hash: 'password123',
        },
      ]);
      console.log('✅ 샘플 사용자 데이터 생성 완료');
    }
  } catch (error) {
    console.error('❌ 샘플 데이터 생성 실패:', error);
  }
}

// 데이터베이스 초기화
async function initializeDatabase() {
  try {
    setupAssociations();
    await sequelize.sync({ force: false });
    await createSampleData();
    console.log('✅ 데이터베이스 초기화 완료');
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    throw error;
  }
}

export { Competition, User, Registration, setupAssociations, createSampleData, initializeDatabase };
