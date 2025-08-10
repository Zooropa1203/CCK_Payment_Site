import sequelize from '../config/database.ts';
import Competition from './Competition.ts';
import User from './User.ts';
import Registration from './Registration.ts';
// 모델 간 관계 설정
export function setupAssociations() {
    // Competition과 Registration의 관계 (1:N)
    Competition.hasMany(Registration, {
        foreignKey: 'competition_id',
        as: 'registrations',
        onDelete: 'CASCADE', // 대회 삭제 시 관련 등록 정보도 삭제
    });
    Registration.belongsTo(Competition, {
        foreignKey: 'competition_id',
        as: 'competition',
    });
    // User와 Registration의 관계 (1:N)
    User.hasMany(Registration, {
        foreignKey: 'user_id',
        as: 'registrations',
        onDelete: 'CASCADE', // 사용자 삭제 시 관련 등록 정보도 삭제
    });
    Registration.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
    });
    // Many-to-Many 관계 (User ↔ Competition through Registration)
    User.belongsToMany(Competition, {
        through: Registration,
        foreignKey: 'user_id',
        otherKey: 'competition_id',
        as: 'competitions',
    });
    Competition.belongsToMany(User, {
        through: Registration,
        foreignKey: 'competition_id',
        otherKey: 'user_id',
        as: 'participants',
    });
}
// 데이터베이스 초기화 함수
export async function initializeDatabase() {
    try {
        // 데이터베이스 연결 테스트
        await sequelize.authenticate();
        console.log('✅ 데이터베이스 연결 성공');
        // 관계 설정
        setupAssociations();
        // 테이블 생성 (force: false = 기존 테이블 유지)
        await sequelize.sync({ force: false });
        console.log('✅ 테이블 동기화 완료');
        return true;
    }
    catch (error) {
        console.error('❌ 데이터베이스 초기화 실패:', error);
        throw error;
    }
}
// 테스트 데이터 생성 함수
export async function createSampleData() {
    try {
        // 기존 데이터 확인
        const competitionCount = await Competition.count();
        if (competitionCount > 0) {
            console.log('📊 기존 데이터가 존재하므로 샘플 데이터 생성을 건너뜁니다.');
            return;
        }
        console.log('🔄 샘플 데이터 생성 중...');
        // 샘플 대회 데이터
        const competitions = await Competition.bulkCreate([
            {
                date: '2025-09-15',
                name: '2025 서울 큐빙 오픈',
                location: '서울시 강남구 코엑스',
                base_fee: 10000,
                event_fee: {
                    '3x3': 5000,
                    '4x4': 7000,
                    '5x5': 8000,
                    OH: 6000,
                    Clock: 5000,
                },
                reg_start_date: '2025-08-01',
                reg_end_date: '2025-09-10',
                events: ['3x3', '4x4', '5x5', 'OH', 'Clock'],
            },
            {
                date: '2025-10-20',
                name: '2025 부산 스피드큐빙 대회',
                location: '부산시 해운대구 BEXCO',
                base_fee: 8000,
                event_fee: {
                    '3x3': 4000,
                    '4x4': 6000,
                    '2x2': 3000,
                    OH: 5000,
                },
                reg_start_date: '2025-09-01',
                reg_end_date: '2025-10-15',
                events: ['3x3', '4x4', '2x2', 'OH'],
            },
            {
                date: '2025-11-25',
                name: '2025 대구 큐빙 챔피언십',
                location: '대구시 수성구 엑스코',
                base_fee: 12000,
                event_fee: {
                    '3x3': 0, // 기본 참가비에 포함
                    '4x4': 5000,
                    '5x5': 7000,
                    '6x6': 8000,
                    '7x7': 9000,
                    OH: 4000,
                    BLD: 6000,
                },
                reg_start_date: '2025-10-01',
                reg_end_date: '2025-11-20',
                events: ['3x3', '4x4', '5x5', '6x6', '7x7', 'OH', 'BLD'],
            },
        ]);
        // 샘플 사용자 데이터
        const users = await User.bulkCreate([
            {
                name: '김큐버',
                username: 'cuber123',
                email: 'cuber123@example.com',
                password_hash: 'password123', // 자동으로 해시됨
            },
            {
                name: '이스피드',
                username: 'speedcuber',
                email: 'speed@example.com',
                password_hash: 'mypassword',
            },
        ]);
        // 샘플 등록 데이터
        await Registration.bulkCreate([
            {
                competition_id: competitions[0].id,
                user_id: users[0].id,
                selected_events: ['3x3', '4x4'],
                total_fee: 22000, // 10000 + 5000 + 7000
                payment_status: 'paid',
            },
            {
                competition_id: competitions[1].id,
                user_id: users[1].id,
                selected_events: ['3x3', 'OH'],
                total_fee: 17000, // 8000 + 4000 + 5000
                payment_status: 'pending',
            },
        ]);
        console.log('✅ 샘플 데이터 생성 완료');
        console.log(`📊 생성된 데이터: 대회 ${competitions.length}개, 사용자 ${users.length}명`);
    }
    catch (error) {
        console.error('❌ 샘플 데이터 생성 실패:', error);
        throw error;
    }
}
// 모델 내보내기
export { sequelize, Competition, User, Registration };
//# sourceMappingURL=index.js.map