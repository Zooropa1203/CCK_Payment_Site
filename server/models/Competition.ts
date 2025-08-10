import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.ts';

// Competition 인터페이스 정의
interface CompetitionAttributes {
  id: number;
  date: string; // YYYY-MM-DD 형식
  name: string;
  location: string;
  base_fee: number;
  event_fee: Record<string, number>; // {"3x3": 5000, "4x4": 7000}
  reg_start_date: string;
  reg_end_date: string;
  events: string[]; // ["3x3", "4x4", "OH"]
  createdAt?: Date;
  updatedAt?: Date;
}

// 생성 시 선택적 속성
interface CompetitionCreationAttributes extends Partial<CompetitionAttributes> {
  date: string;
  name: string;
  location: string;
  base_fee: number;
  event_fee: Record<string, number>;
  reg_start_date: string;
  reg_end_date: string;
  events: string[];
}

// Competition 모델 클래스
class Competition
  extends Model<CompetitionAttributes, CompetitionCreationAttributes>
  implements CompetitionAttributes
{
  public id!: number;
  public date!: string;
  public name!: string;
  public location!: string;
  public base_fee!: number;
  public event_fee!: Record<string, number>;
  public reg_start_date!: string;
  public reg_end_date!: string;
  public events!: string[];

  // 타임스탬프
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 계산된 속성
  public get isRegistrationOpen(): boolean {
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return now >= this.reg_start_date && now <= this.reg_end_date;
  }

  public get daysUntilCompetition(): number {
    const today = new Date();
    const compDate = new Date(this.date);
    const diffTime = compDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// 모델 정의
Competition.init(
  {
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
  },
  {
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
  }
);

export default Competition;
