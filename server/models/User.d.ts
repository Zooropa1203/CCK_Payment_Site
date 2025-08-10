import { Model } from 'sequelize';
interface UserAttributes {
    id: number;
    name: string;
    username: string;
    email: string;
    password_hash: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface UserCreationAttributes extends Partial<UserAttributes> {
    name: string;
    username: string;
    email: string;
    password_hash: string;
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    name: string;
    username: string;
    email: string;
    password_hash: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static hashPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
    toJSON(): Partial<UserAttributes>;
}
export default User;
