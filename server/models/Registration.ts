import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.ts';
import Competition from './Competition.ts';
import User from './User.ts';

// Registration 인터페이스 정의
interface RegistrationAttributes {
  id: number;
  competition_id: number;
  user_id: number;
  selected_events: string[]; // ["3x3", "4x4"]
  total_fee: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

// 생성 시 선택적 속성
interface RegistrationCreationAttributes
  extends Partial<RegistrationAttributes> {
  competition_id: number;
  user_id: number;
  selected_events: string[];
  total_fee: number;
}

// Registration 모델 클래스
class Registration
  extends Model<RegistrationAttributes, RegistrationCreationAttributes>
  implements RegistrationAttributes
{
  public id!: number;
  public competition_id!: number;
  public user_id!: number;
  public selected_events!: string[];
  public total_fee!: number;
  public payment_status!: 'pending' | 'paid' | 'cancelled';

  // 타임스탬프
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 관계 속성 (populate시 사용)
  public Competition?: Competition;
  public User?: User;

  // 총 참가비 계산 메서드
  public static calculateTotalFee(
    competition: Competition,
    selectedEvents: string[]
  ): number {
    let total = competition.base_fee;

    selectedEvents.forEach(event => {
      const eventFee = competition.event_fee[event];
      if (eventFee) {
        total += eventFee;
      }
    });

    return total;
  }

  // 결제 상태 업데이트 메서드
  public async markAsPaid(): Promise<void> {
    this.payment_status = 'paid';
    await this.save();
  }

  public async markAsCancelled(): Promise<void> {
    this.payment_status = 'cancelled';
    await this.save();
  }

  // 참가비 검증 메서드
  public async validateTotalFee(): Promise<boolean> {
    const competition = await Competition.findByPk(this.competition_id);
    if (!competition) return false;

    const calculatedFee = Registration.calculateTotalFee(
      competition,
      this.selected_events
    );
    return Math.abs(this.total_fee - calculatedFee) < 0.01; // 소수점 오차 고려
  }
}

// 모델 정의
Registration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    competition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '대회 ID (FK)',
      references: {
        model: Competition,
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '사용자 ID (FK)',
      references: {
        model: User,
        key: 'id',
      },
    },
    selected_events: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: '참가 신청 종목 목록 (JSON)',
      validate: {
        notEmpty: true,
        isValidArray(value: any) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('최소 하나의 종목을 선택해야 합니다.');
          }
        },
      },
    },
    total_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: '총 참가비',
      validate: {
        min: 0,
      },
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
      comment: '결제 상태',
    },
  },
  {
    sequelize,
    modelName: 'Registration',
    tableName: 'registrations',
    indexes: [
      {
        fields: ['competition_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['payment_status'],
      },
      {
        unique: true,
        fields: ['competition_id', 'user_id'], // 한 사용자는 같은 대회에 한 번만 참가 가능
      },
    ],
    hooks: {
      // 생성 전 참가비 검증
      beforeCreate: async (registration: Registration) => {
        const competition = await Competition.findByPk(
          registration.competition_id
        );
        if (!competition) {
          throw new Error('존재하지 않는 대회입니다.');
        }

        // 등록 기간 검증
        const now = new Date().toISOString().split('T')[0];
        if (
          now < competition.reg_start_date ||
          now > competition.reg_end_date
        ) {
          throw new Error('등록 기간이 아닙니다.');
        }

        // 참가비 자동 계산
        registration.total_fee = Registration.calculateTotalFee(
          competition,
          registration.selected_events
        );
      },
    },
  }
);

export default Registration;
