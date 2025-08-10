import sequelize from '../config/database.ts';
import Competition from './Competition.ts';
import User from './User.ts';
import Registration from './Registration.ts';
export declare function setupAssociations(): void;
export declare function initializeDatabase(): Promise<boolean>;
export declare function createSampleData(): Promise<void>;
export { sequelize, Competition, User, Registration };
