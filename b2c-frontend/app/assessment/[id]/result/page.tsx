import SkillAssessmentResultClient from './SkillAssessmentResultClient';

export default async function SkillAssessmentResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SkillAssessmentResultClient id={id} />;
}
