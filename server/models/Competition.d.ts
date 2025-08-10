import { Model } from 'sequelize';
interface CompetitionAttributes {
    id: number;
    date: string;
    name: string;
    location: string;
    base_fee: number;
    event_fee: Record<string, number>;
    reg_start_date: string;
    reg_end_date: string;
    events: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
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
declare class Competition extends Model<CompetitionAttributes, CompetitionCreationAttributes> implements CompetitionAttributes {
    id: number;
    date: string;
    name: string;
    location: string;
    base_fee: number;
    event_fee: Record<string, number>;
    reg_start_date: string;
    reg_end_date: string;
    events: string[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
    get isRegistrationOpen(): boolean;
    get daysUntilCompetition(): number;
}
export default Competition;
