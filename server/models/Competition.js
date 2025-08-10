import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.ts';
// Competition 모델 클래스
class Competition extends Model {
    id;
    date;
    name;
    location;
    base_fee;
    event_fee;
    reg_start_date;
    reg_end_date;
    events;
    // 타임스탬프
    createdAt;
    updatedAt;
    // 계산된 속성
    get isRegistrationOpen() {
        const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        return now >= this.reg_start_date && now <= this.reg_end_date;
    }
    get daysUntilCompetition() {
        const today = new Date();
        const compDate = new Date(this.date);
        const diffTime = compDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}
// 모델 정의
Competition.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '대회 개최일',
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '대회명',
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '대회 장소',
    },
    base_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '기본 참가비',
    },
    event_fee: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: '종목별 참가비 (JSON)',
    },
    reg_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '접수 시작일',
    },
    reg_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: '접수 마감일',
    },
    events: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: '대회 종목 목록 (JSON)',
    },
}, {
    sequelize,
    modelName: 'Competition',
    tableName: 'competitions',
    indexes: [
        {
            fields: ['date'],
        },
        {
            fields: ['reg_start_date', 'reg_end_date'],
        },
    ],
});
export default Competition;
//# sourceMappingURL=Competition.js.map