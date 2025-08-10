// src/services/auth.ts
import type {
  User,
  LoginRequest,
  SignupRequest,
} from '../../shared/schemas.js';

import { http } from './http.js';

export interface LoginResponse {
  user: User;
  token: string;
  expires_in: number;
}

export interface SignupResponse {
  user: User;
  token: string;
  expires_in: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}

export const authService = {
  // User login
  async login(data: LoginRequest): Promise<LoginResponse> {
    return http.post<LoginResponse>('/api/auth/login', data);
  },

  // User signup
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return http.post<SignupResponse>('/api/auth/signup', data);
  },

  // Request password reset
  async requestPasswordReset(
    data: PasswordResetRequest
  ): Promise<PasswordResetResponse> {
    return http.post<PasswordResetResponse>('/api/auth/password-reset', data);
  },

  // Logout (if server-side session management is needed)
  async logout(): Promise<void> {
    return http.post<void>('/api/auth/logout');
  },

  // Verify email (for signup flow)
  async verifyEmail(code: string): Promise<{ message: string }> {
    return http.post<{ message: string }>('/api/auth/verify-email', { code });
  },

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    return http.post<{ message: string }>('/api/auth/resend-verification', {
      email,
    });
  },
};
