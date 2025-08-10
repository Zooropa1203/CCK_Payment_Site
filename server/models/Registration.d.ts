import { Model } from 'sequelize';
import Competition from './Competition.ts';
import User from './User.ts';
interface RegistrationAttributes {
    id: number;
    competition_id: number;
    user_id: number;
    selected_events: string[];
    total_fee: number;
    payment_status: 'pending' | 'paid' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}
interface RegistrationCreationAttributes extends Partial<RegistrationAttributes> {
    competition_id: number;
    user_id: number;
    selected_events: string[];
    total_fee: number;
}
declare class Registration extends Model<RegistrationAttributes, RegistrationCreationAttributes> implements RegistrationAttributes {
    id: number;
    competition_id: number;
    user_id: number;
    selected_events: string[];
    total_fee: number;
    payment_status: 'pending' | 'paid' | 'cancelled';
    readonly createdAt: Date;
    readonly updatedAt: Date;
    Competition?: Competition;
    User?: User;
    static calculateTotalFee(competition: Competition, selectedEvents: string[]): number;
    markAsPaid(): Promise<void>;
    markAsCancelled(): Promise<void>;
    validateTotalFee(): Promise<boolean>;
}
export default Registration;
