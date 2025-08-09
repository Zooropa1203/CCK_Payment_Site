import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { sequelize } from '../config/sequelize.js';
import Competition from './competition.model.js';
import User from './user.model.js';

class Registration extends Model<InferAttributes<Registration>, InferCreationAttributes<Registration>> {
  declare id: CreationOptional<number>;
  declare competition_id: ForeignKey<Competition['id']>;
  declare user_id: ForeignKey<User['id']>;
  declare selected_events: string[];
  declare total_fee: number;
  declare payment_status: CreationOptional<'pending' | 'paid' | 'cancelled'>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 연관관계
  declare Competition?: Competition;
  declare User?: User;

  // 결제 상태 변경 메서드
  public async updatePaymentStatus(status: 'pending' | 'paid' | 'cancelled'): Promise<void> {
    this.payment_status = status;
    await this.save();
  }

  // 참가비 계산 메서드
  public async calculateTotalFee(): Promise<number> {
    if (this.Competition) {
      return this.Competition.getTotalFee(this.selected_events);
    }
    
    const competition = await Competition.findByPk(this.competition_id);
    if (competition) {
      return competition.getTotalFee(this.selected_events);
    }
    
    return 0;
  }
}

Registration.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  competition_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Competition,
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  selected_events: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArray: true,
      notEmpty: {
        msg: '최소 하나의 종목을 선택해야 합니다.',
      },
    },
  },
  total_fee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'Registration',
  tableName: 'registrations',
  indexes: [
    {
      unique: true,
      fields: ['competition_id', 'user_id'],
    },
  ],
  hooks: {
    beforeCreate: async (registration) => {
      const competition = await Competition.findByPk(registration.competition_id);
      if (competition) {
        // 등록 기간 확인
        if (!competition.isRegistrationOpen()) {
          throw new Error('현재 등록 기간이 아닙니다.');
        }
        
        // 참가비 자동 계산
        registration.total_fee = competition.getTotalFee(registration.selected_events);
        
        // 선택한 종목이 대회 종목에 포함되는지 확인
        const invalidEvents = registration.selected_events.filter(
          event => !competition.events.includes(event)
        );
        if (invalidEvents.length > 0) {
          throw new Error(`유효하지 않은 종목: ${invalidEvents.join(', ')}`);
        }
      }
    },
    beforeUpdate: async (registration) => {
      if (registration.changed('selected_events')) {
        const competition = await Competition.findByPk(registration.competition_id);
        if (competition) {
          registration.total_fee = competition.getTotalFee(registration.selected_events);
          
          const invalidEvents = registration.selected_events.filter(
            event => !competition.events.includes(event)
          );
          if (invalidEvents.length > 0) {
            throw new Error(`유효하지 않은 종목: ${invalidEvents.join(', ')}`);
          }
        }
      }
    },
  },
});

export default Registration;
