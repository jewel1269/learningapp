import { apiClient } from '@/src/infrastructure/apiClient';
import type { Course, CourseLevel } from '@/src/domain/course';

export interface CreateCourseInput {
  category: string;
  topics: string[];
  level: CourseLevel;
  visualsPreferred?: boolean;
  dailyNotification?: boolean;
}

// 202 Accepted — returns the course in `generating` status; poll getCourse for readiness.
export function createCourse(input: CreateCourseInput): Promise<{ course: Course }> {
  return apiClient<{ course: Course }>('/courses', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getCourse(id: string): Promise<{ course: Course }> {
  return apiClient<{ course: Course }>(`/courses/${id}`);
}

export function listCourses(): Promise<{ courses: Course[] }> {
  return apiClient<{ courses: Course[] }>('/courses');
}
