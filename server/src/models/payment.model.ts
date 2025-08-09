import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export interface PaymentAttributes {
  id?: number;
  registration_id: number;
  amount: number;
  payment_method: 'card' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  order_id: string;
  payment_key?: string;
  paid_at?: Date;
  cancelled_at?: Date;
  cancel_reason?: string;
  created_at?: Date;
  updated_at?: Date;
}

class Payment extends Model<PaymentAttributes> implements PaymentAttributes {
  public id!: number;
  public registration_id!: number;
  public amount!: number;
  public payment_method!: 'card' | 'bank_transfer';
  public status!: 'pending' | 'completed' | 'failed' | 'cancelled';
  public order_id!: string;
  public payment_key?: string;
  public paid_at?: Date;
  public cancelled_at?: Date;
  public cancel_reason?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    registration_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'registrations',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('card', 'bank_transfer'),
      allowNull: false,
      defaultValue: 'card',
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    payment_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancel_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Payment;
