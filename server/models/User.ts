import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.ts';

// User 인터페이스 정의
interface UserAttributes {
  id: number;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 생성 시 선택적 속성
interface UserCreationAttributes extends Partial<UserAttributes> {
  name: string;
  username: string;
  email: string;
  password_hash: string;
}

// User 모델 클래스
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public username!: string;
  public email!: string;
  public password_hash!: string;

  // 타임스탬프
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 비밀번호 해시 생성 메서드
  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  // 비밀번호 검증 메서드
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  // JSON 직렬화 시 민감 정보 제외
  public toJSON(): Partial<UserAttributes> {
    const values = { ...this.get() } as any;
    delete values.password_hash;
    return values;
  }
}

// 모델 정의
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
      comment: '사용자 이름',
      validate: {
        len: [2, 50],
        notEmpty: true,
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '로그인 아이디',
      validate: {
        len: [4, 20],
        isAlphanumeric: true,
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: '이메일 주소',
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '해시된 비밀번호',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    indexes: [
      {
        unique: true,
        fields: ['username'],
      },
      {
        unique: true,
        fields: ['email'],
      },
    ],
    hooks: {
      // 생성 전 비밀번호 해시
      beforeCreate: async (user: User) => {
        if (user.password_hash) {
          user.password_hash = await User.hashPassword(user.password_hash);
        }
      },
      // 업데이트 전 비밀번호 해시 (비밀번호가 변경된 경우만)
      beforeUpdate: async (user: User) => {
        if (user.changed('password_hash')) {
          user.password_hash = await User.hashPassword(user.password_hash);
        }
      },
    },
  }
);

export default User;
