// src/routes/paths.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PASSWORD_RESET: '/password-reset',
  SIGNUP: {
    ROOT: '/signup',
    TERMS: '/signup/terms',
    INFO: '/signup/info',
    VERIFY: '/signup/verify',
  },
  COMPETITIONS: {
    DETAIL: (id: string | number) => `/competitions/${id}`,
    APPLICATION: (id: string | number) => `/competitions/${id}/apply`,
    SCHEDULE: (id: string | number) => `/competitions/${id}/schedule`,
    PARTICIPANTS: (id: string | number) => `/competitions/${id}/participants`,
    WAITLIST: (id: string | number) => `/competitions/${id}/waitlist`,
  },
} as const;

// Route patterns for React Router
export const ROUTE_PATTERNS = {
  COMPETITIONS: {
    DETAIL: '/competitions/:id',
    APPLICATION: '/competitions/:id/apply',
    SCHEDULE: '/competitions/:id/schedule',
    PARTICIPANTS: '/competitions/:id/participants',
    WAITLIST: '/competitions/:id/waitlist',
  },
} as const;
