// src/types/competition.ts
export interface Competition {
  id: number;
  name: string;
  date: string;              // ISO string
  location: string;
  base_fee: number;
  event_fee: Record<string, number>;
  reg_start_date: string;    // ISO string
  reg_end_date: string;      // ISO string
  events: string[];
  capacity?: number;
}

export interface EventFees {
  [key: string]: number;
}
