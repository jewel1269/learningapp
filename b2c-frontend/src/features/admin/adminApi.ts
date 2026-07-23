import { apiClient } from '@/src/infrastructure/apiClient';

export interface PlatformMetrics {
  generatedAt: string;
  users: { total: number; active: number; premium: number };
  courses: {
    total: number;
    byStatus: Record<string, number>;
    generationSuccessRate: number | null;
    generationFailureRate: number | null;
  };
  assessments: { quizSubmissions: number; examSubmissions: number };
  exercises: {
    submissions: number;
    graded: number;
    completionRate: number | null;
  };
  ai: { totalCostUsd: number; totalCalls: number };
  labs: { note: string };
}

export interface CostDashboard {
  totalCostUsd: number;
  totalCalls: number;
  inputTokens: number;
  outputTokens: number;
  byUseCase: { useCase: string; costUsd: number; calls: number }[];
  byModel: { model: string; costUsd: number; calls: number }[];
  topUsers: { userId: string; costUsd: number; calls: number }[];
}

export type ContentType = 'course' | 'lesson' | 'exercise' | 'quiz';

export interface ContentFlag {
  id: string;
  contentType: ContentType;
  contentId: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  flaggedBy?: string;
  resolvedAt?: string;
  createdAt?: string;
}

export function getMetrics() {
  return apiClient<PlatformMetrics>('/admin/metrics');
}

export function getCosts() {
  return apiClient<CostDashboard>('/admin/costs');
}

export function listContent(type: ContentType, page = 1, limit = 20) {
  return apiClient<{ items: Record<string, unknown>[]; total: number; page: number; limit: number }>(
    `/admin/content/${type}?page=${page}&limit=${limit}`,
  );
}

export function listFlags(status?: 'open' | 'resolved' | 'dismissed') {
  const query = status ? `?status=${status}` : '';
  return apiClient<{ flags: ContentFlag[] }>(`/admin/flags${query}`);
}

export function flagContent(type: ContentType, id: string, reason: string) {
  return apiClient<{ flag: ContentFlag }>(`/admin/content/${type}/${id}/flag`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function regenerateContent(type: ContentType, id: string) {
  return apiClient<{ type: string; id: string; status?: string; enqueued?: boolean; regenerated?: boolean }>(
    `/admin/content/${type}/${id}/regenerate`,
    { method: 'POST' },
  );
}

export function resolveFlag(flagId: string, resolution: 'resolved' | 'dismissed') {
  return apiClient<{ flag: ContentFlag }>(`/admin/flags/${flagId}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ resolution }),
  });
}
