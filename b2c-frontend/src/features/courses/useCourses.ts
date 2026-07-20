'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import * as coursesApi from './coursesApi';

export function useCreateCourse() {
  return useMutation({ mutationFn: coursesApi.createCourse });
}

// Fetches a course; while it is still `generating`, polls every 1.5s until it
// resolves to ready/failed.
export function useCourse(id: string | null) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getCourse(id as string),
    enabled: Boolean(id),
    refetchInterval: (query) =>
      query.state.data?.course.status === 'generating' ? 1500 : false,
  });
}

export function useCourses() {
  return useQuery({ queryKey: ['courses'], queryFn: coursesApi.listCourses });
}
