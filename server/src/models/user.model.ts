import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/sequelize.js';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare username: string;
  declare email: string;
  declare password_hash: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // 비밀번호 검증 메서드
  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password_hash);
  }

  // 비밀번호 해시 생성 메서드
  public async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt(12);
    this.password_hash = await bcrypt.hash(password, salt);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        isAlphanumeric: true,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [5, 255],
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async user => {
        if (user.password_hash && !user.password_hash.startsWith('$2')) {
          const salt = await bcrypt.genSalt(12);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async user => {
        if (
          user.changed('password_hash') &&
          user.password_hash &&
          !user.password_hash.startsWith('$2')
        ) {
          const salt = await bcrypt.genSalt(12);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
    },
  }
);

export default User;
