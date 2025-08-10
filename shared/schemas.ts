import { z } from 'zod';

// Base schemas
export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^[0-9-+().\s]+$/, 'Invalid phone number format'),
  birth_date: z.string().datetime(), // ISO string
  gender: z.enum(['M', 'F']),
  wca_id: z.string().optional(),
  emergency_contact: z.string().min(1, 'Emergency contact is required'),
  emergency_phone: z
    .string()
    .regex(/^[0-9-+().\s]+$/, 'Invalid emergency phone format'),
  role: z.enum(['Administrator', 'Organizer', 'Member']).default('Member'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const competitionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Competition name is required'),
  date: z.string().datetime(), // ISO string
  location: z.string().min(1, 'Location is required'),
  base_fee: z.number().min(0, 'Base fee must be non-negative'),
  event_fee: z.record(z.string(), z.number().min(0)),
  reg_start_date: z.string().datetime(),
  reg_end_date: z.string().datetime(),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  capacity: z.number().int().positive().optional(),
  description: z.string().optional(),
  organizer: z.string().min(1, 'Organizer is required'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const competitionDetailSchema = competitionSchema.extend({
  schedule: z
    .array(
      z.object({
        id: z.number().int().positive(),
        competition_id: z.number().int().positive(),
        event: z.string(),
        start_time: z.string().datetime(),
        end_time: z.string().datetime(),
        round: z.string(),
        cutoff: z.string().optional(),
        time_limit: z.string().optional(),
      })
    )
    .optional(),
  participants: z
    .array(
      z.object({
        id: z.number().int().positive(),
        user_id: z.number().int().positive(),
        competition_id: z.number().int().positive(),
        events: z.array(z.string()),
        total_fee: z.number().min(0),
        status: z.enum(['pending', 'confirmed', 'cancelled']),
        payment_status: z.enum(['pending', 'completed', 'failed', 'refunded']),
        registered_at: z.string().datetime(),
        user: userSchema.optional(),
      })
    )
    .optional(),
  waitlist: z
    .array(
      z.object({
        id: z.number().int().positive(),
        user_id: z.number().int().positive(),
        competition_id: z.number().int().positive(),
        events: z.array(z.string()),
        total_fee: z.number().min(0),
        position: z.number().int().positive(),
        registered_at: z.string().datetime(),
        user: userSchema.optional(),
      })
    )
    .optional(),
});

export const scheduleItemSchema = z.object({
  id: z.number().int().positive(),
  competition_id: z.number().int().positive(),
  event: z.string(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  round: z.string(),
  cutoff: z.string().optional(),
  time_limit: z.string().optional(),
});

export const participantSchema = z.object({
  id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  competition_id: z.number().int().positive(),
  events: z.array(z.string()),
  total_fee: z.number().min(0),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  payment_status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  registered_at: z.string().datetime(),
  user: userSchema.optional(),
});

export const registrationSchema = z.object({
  id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  competition_id: z.number().int().positive(),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
  total_fee: z.number().min(0),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  payment_status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  registered_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Request/Response schemas
export const loginRequestSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupRequestSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^[0-9-+().\s]+$/, 'Invalid phone number format'),
  birth_date: z.string().datetime(),
  gender: z.enum(['M', 'F']),
  wca_id: z.string().optional(),
  emergency_contact: z.string().min(1, 'Emergency contact is required'),
  emergency_phone: z
    .string()
    .regex(/^[0-9-+().\s]+$/, 'Invalid emergency phone format'),
});

export const registrationRequestSchema = z.object({
  competition_id: z.number().int().positive(),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
});

// Inferred types
export type User = z.infer<typeof userSchema>;
export type Competition = z.infer<typeof competitionSchema>;
export type CompetitionDetail = z.infer<typeof competitionDetailSchema>;
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;
export type Participant = z.infer<typeof participantSchema>;
export type Registration = z.infer<typeof registrationSchema>;

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type RegistrationRequest = z.infer<typeof registrationRequestSchema>;

// Legacy types for backward compatibility
export interface EventFees {
  [key: string]: number;
}
