import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

class Competition extends Model<InferAttributes<Competition>, InferCreationAttributes<Competition>> {
  declare id: CreationOptional<number>;
  declare date: string;
  declare name: string;
  declare location: string;
  declare base_fee: number;
  declare event_fee: Record<string, number>;
  declare reg_start_date: string;
  declare reg_end_date: string;
  declare events: string[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 추가 메서드들
  public isRegistrationOpen(): boolean {
    const now = new Date();
    const startDate = new Date(this.reg_start_date);
    const endDate = new Date(this.reg_end_date);
    return now >= startDate && now <= endDate;
  }

  public getTotalFee(selectedEvents: string[]): number {
    let total = this.base_fee;
    selectedEvents.forEach(event => {
      if (this.event_fee[event]) {
        total += this.event_fee[event];
      }
    });
    return total;
  }
}

Competition.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [3, 200],
    },
  },
  location: {
    type: DataTypes.STRING(300),
    allowNull: false,
    validate: {
      len: [3, 300],
    },
  },
  base_fee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  event_fee: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  reg_start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  reg_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterStartDate(value: string) {
        if (value <= (this as any).reg_start_date) {
          throw new Error('등록 종료일은 시작일보다 늦어야 합니다.');
        }
      },
    },
  },
  events: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArray: true,
    },
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'Competition',
  tableName: 'competitions',
  hooks: {
    beforeCreate: (competition) => {
      // 대회 날짜가 등록 기간보다 늦은지 확인
      if (competition.date <= competition.reg_end_date) {
        throw new Error('대회 날짜는 등록 종료일보다 늦어야 합니다.');
      }
    },
    beforeUpdate: (competition) => {
      if (competition.date <= competition.reg_end_date) {
        throw new Error('대회 날짜는 등록 종료일보다 늦어야 합니다.');
      }
    },
  },
});

export default Competition;
