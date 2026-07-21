import SkillAssessmentClient from './SkillAssessmentClient';

export default async function SkillAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SkillAssessmentClient id={id} />;
}
