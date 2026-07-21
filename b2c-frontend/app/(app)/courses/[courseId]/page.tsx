import { CourseOverview } from '@/src/features/courses/components/CourseOverview';

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <CourseOverview courseId={courseId} />;
}
