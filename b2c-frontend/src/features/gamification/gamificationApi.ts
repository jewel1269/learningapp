import { apiClient } from '@/src/infrastructure/apiClient';

export interface EarnedAchievement {
  key: string;
  title: string;
  description?: string;
  icon?: string;
  earnedAt: string;
}

export interface MyAchievements {
  earnedCount: number;
  total: number;
  achievements: EarnedAchievement[];
}

export function getMyAchievements(): Promise<MyAchievements> {
  return apiClient<MyAchievements>('/gamification/me');
}

export function listAchievements(): Promise<{ achievements: EarnedAchievement[] }> {
  return apiClient<{ achievements: EarnedAchievement[] }>('/gamification/achievements');
}
