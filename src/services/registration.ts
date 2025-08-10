// src/services/registration.ts
import type { Registration, RegistrationRequest } from '../../shared/schemas.js';

import { http } from './http.js';

export interface RegistrationResponse {
  registration: Registration;
  payment_url?: string; // For payment gateway redirect
}

export interface RegistrationStatusResponse {
  registration: Registration;
}

export const registrationService = {
  // Create new registration
  async createRegistration(data: RegistrationRequest): Promise<RegistrationResponse> {
    return http.post<RegistrationResponse>('/api/registrations', data);
  },

  // Get registration status
  async getRegistrationStatus(id: number | string): Promise<RegistrationStatusResponse> {
    return http.get<RegistrationStatusResponse>(`/api/registrations/${id}`);
  },

  // Cancel registration
  async cancelRegistration(id: number | string): Promise<{ message: string }> {
    return http.delete<{ message: string }>(`/api/registrations/${id}`);
  },

  // Update registration (modify events)
  async updateRegistration(
    id: number | string,
    data: Partial<RegistrationRequest>
  ): Promise<RegistrationResponse> {
    return http.put<RegistrationResponse>(`/api/registrations/${id}`, data);
  },
};
