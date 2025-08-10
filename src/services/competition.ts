// src/services/competition.ts
import type { Competition, CompetitionDetail, ScheduleItem, Participant } from '../../shared/schemas.js';

import { http } from './http.js';

export interface CompetitionsResponse {
  competitions: Competition[];
  total: number;
}

export interface ParticipantsResponse {
  participants: Participant[];
  total: number;
}

export interface WaitlistResponse {
  waitlist: Participant[];
  total: number;
}

export interface ScheduleResponse {
  schedule: ScheduleItem[];
}

export const competitionService = {
  // Get all competitions
  async getCompetitions(): Promise<CompetitionsResponse> {
    return http.get<CompetitionsResponse>('/api/competitions');
  },

  // Get competition by ID
  async getCompetition(id: number | string): Promise<CompetitionDetail> {
    return http.get<CompetitionDetail>(`/api/competitions/${id}`);
  },

  // Get competition schedule
  async getCompetitionSchedule(id: number | string): Promise<ScheduleResponse> {
    return http.get<ScheduleResponse>(`/api/competitions/${id}/schedule`);
  },

  // Get competition participants
  async getCompetitionParticipants(id: number | string): Promise<ParticipantsResponse> {
    return http.get<ParticipantsResponse>(`/api/competitions/${id}/participants`);
  },

  // Get competition waitlist
  async getCompetitionWaitlist(id: number | string): Promise<WaitlistResponse> {
    return http.get<WaitlistResponse>(`/api/competitions/${id}/waitlist`);
  },
};
