export const TRIAL_PERIOD_MONTHS = 3;
export const TRIAL_PERIOD_DAYS = 90;
export const STANDARD_PRICE_USD = 34;
export const PREMIUM_PRICE_USD = 150;

export const FREE_PLAN_FEATURES = [
  '1 active AI course',
  '3 skill assessments',
  'Daily quizzes & exercises',
  'Basic code sandbox labs',
  'Streaks & achievements',
] as const;

export const STANDARD_PLAN_FEATURES = [
  `${TRIAL_PERIOD_MONTHS} months free to start`,
  '5 course generations per day',
  '20 quiz generations per day',
  'Hands-on labs & progress tracking',
  'Full platform access',
] as const;

export const TRIAL_PLAN_FEATURES = [
  '3 months free — no credit card required',
  '1 active AI course',
  'Daily quizzes, exercises & basic labs',
  '3 skill assessments',
  'Streaks & achievements',
  'Full data export & deletion',
] as const;

/** Always require a paid Premium subscription, even during the trial. */
export const PREMIUM_ONLY_FEATURES = [
  'Up to 25 active courses',
  'Unlimited skill assessments',
  'Course-wide exams',
  'Priority AI generation & grading',
  'Advanced SOC & network labs',
] as const;

export const TRIAL_INCLUDED_FEATURES = [
  '1 active AI course',
  '5 course generations per day',
  '20 quiz & exercise generations per day',
  '3 skill assessments',
  'Basic code sandbox & terminal labs',
  'Streaks & achievements',
] as const;

export const PREMIUM_PLAN_FEATURES = [
  'Up to 25 active courses',
  'Unlimited skill assessments',
  'Course-wide exams',
  'Priority AI generation & grading',
  'Advanced SOC & network labs',
] as const;

export const PLAN_COMPARISON = [
  { feature: 'Platform access', trial: '3 months free', premium: 'Paid subscription' },
  { feature: 'Active AI courses', trial: '1', premium: '25' },
  { feature: 'Course generations / day', trial: '5', premium: '50' },
  { feature: 'Quiz generations / day', trial: '20', premium: '500' },
  { feature: 'Skill assessments', trial: '3 total', premium: 'Unlimited' },
  { feature: 'Course-wide exams', trial: '—', premium: 'Yes' },
  { feature: 'SOC & network labs', trial: '—', premium: 'Yes' },
  { feature: 'Priority queue', trial: '—', premium: 'Yes' },
] as const;

export const PRICING_FAQ = [
  {
    q: 'How does the 3-month free trial work?',
    a: 'Every new account gets 3 months of full platform access with standard limits. No credit card is required to start.',
  },
  {
    q: 'What happens after 3 months?',
    a: 'After your trial ends, subscribe to Premium to keep learning. Your existing courses stay in your account.',
  },
  {
    q: 'Which features need Premium during the trial?',
    a: 'Premium-only features — like unlimited skill assessments, multiple active courses, course-wide exams, and advanced SOC/network labs — require a paid Premium subscription even while your trial is active.',
  },
  {
    q: 'Can I cancel Premium anytime?',
    a: 'Yes. Manage or cancel from the billing portal. Access continues until the end of your billing period.',
  },
] as const;

/** @deprecated Use FREE_PLAN_FEATURES — kept for upgrade page imports during transition */
export const FREE_PLAN_FEATURES_LEGACY = TRIAL_INCLUDED_FEATURES;
