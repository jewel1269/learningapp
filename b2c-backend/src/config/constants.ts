export const TIERS = ['free', 'premium'] as const;
export const DOMAINS = ['programming', 'networking', 'cybersecurity', 'os', 'general'] as const;
export const COURSE_STATUS = ['generating', 'ready', 'failed', 'archived', 'completed'] as const;

/** New accounts get this many days of platform access before a paid subscription is required. */
export const TRIAL_PERIOD_DAYS = 90;

// Per-tier limits — PLACEHOLDER numbers, confirm with Yonatan (§0, §9).
export const TIER_LIMITS = {
  free: {
    activeCourses: 1,
    courseGenerationsPerDay: 5,
    exerciseGenerationsPerDay: 20,
    quizGenerationsPerDay: 20,
    examGenerationsPerDay: 5,
    labExecutionsPerDay: 100,
  },
  premium: {
    activeCourses: 25,
    courseGenerationsPerDay: 50,
    exerciseGenerationsPerDay: 500,
    quizGenerationsPerDay: 500,
    examGenerationsPerDay: 100,
    labExecutionsPerDay: 5000,
  },
} as const;
