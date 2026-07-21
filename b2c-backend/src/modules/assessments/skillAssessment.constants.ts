export const SKILL_TOPICS = [
  'Programming',
  'Artificial Intelligence',
  'Cyber Security',
  'Networking',
  'Data Science',
  'Health & Fitness',
  'Security',
  'General',
  'Other',
] as const;

export type SkillTopic = (typeof SKILL_TOPICS)[number];

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export function scoreToLevel(score: number): SkillLevel {
  if (score >= 90) return 'Expert';
  if (score >= 70) return 'Advanced';
  if (score >= 40) return 'Intermediate';
  return 'Beginner';
}

export const FREE_SKILL_ASSESSMENT_LIMIT = 3;

export function skillAssessmentLimitFor(tier?: string | null): number {
  return tier === 'premium' ? Number.POSITIVE_INFINITY : FREE_SKILL_ASSESSMENT_LIMIT;
}
