import type { CourseLevel } from '@/src/domain/course';
import type { SkillLevel } from '@/src/domain/assessment';
import type { SkillTopic } from '@/src/features/skill-assessment/skillAssessmentApi';

export const LEARNING_PATH_PREFILL_KEY = 'bina-learning-path-prefill';
export const LEARNING_PATH_GOAL_KEY = 'bina-learning-path-goal';

export type LearningGoal =
  | 'career'
  | 'hands_on'
  | 'certification'
  | 'exploring';

export interface LearningPathPrefill {
  assessmentId: string;
  topic: string;
  customTopic: string | null;
  topicLabel: string;
  skillLevel: SkillLevel;
  courseLevel: CourseLevel;
  category: string;
  topics: string[];
  goal?: LearningGoal;
}

export interface LearningPathStep {
  title: string;
  description: string;
}

const TOPIC_TO_CATEGORY: Record<SkillTopic, string> = {
  Programming: 'Programming',
  'Artificial Intelligence': 'AI',
  'Cyber Security': 'Cybersecurity',
  Networking: 'Networking',
  'Data Science': 'Data',
  'Health & Fitness': 'General',
  Security: 'Cybersecurity',
  General: 'General',
  Other: 'General',
};

const GOAL_LABELS: Record<LearningGoal, string> = {
  career: 'Career growth',
  hands_on: 'Hands-on practice',
  certification: 'Certification prep',
  exploring: 'Exploring new skills',
};

export function skillLevelToCourseLevel(level: SkillLevel): CourseLevel {
  if (level === 'Beginner') return 'beginner';
  if (level === 'Intermediate') return 'intermediate';
  return 'advanced';
}

export function mapTopicToCategory(topic: string, customTopic: string | null): string {
  if (topic === 'Other' && customTopic?.trim()) {
    return customTopic.trim();
  }
  return TOPIC_TO_CATEGORY[topic as SkillTopic] ?? topic;
}

export function buildTopicLabel(topic: string, customTopic: string | null): string {
  return topic === 'Other' && customTopic?.trim() ? customTopic.trim() : topic;
}

export function buildLandingPathPrefill(input: {
  topic: string;
  customTopic: string | null;
  goal: LearningGoal;
  courseLevel?: CourseLevel;
}): LearningPathPrefill {
  const topicLabel = buildTopicLabel(input.topic, input.customTopic);
  const category = mapTopicToCategory(input.topic, input.customTopic);
  const courseLevel = input.courseLevel ?? 'beginner';

  return {
    assessmentId: 'landing',
    topic: input.topic,
    customTopic: input.customTopic,
    topicLabel,
    skillLevel: 'Beginner',
    courseLevel,
    category,
    topics: [topicLabel],
    goal: input.goal,
  };
}

export function buildLearningPathPrefill(input: {
  assessmentId: string;
  topic: string;
  customTopic: string | null;
  skillLevel: SkillLevel;
  goal?: LearningGoal;
}): LearningPathPrefill {
  const topicLabel = buildTopicLabel(input.topic, input.customTopic);
  const category = mapTopicToCategory(input.topic, input.customTopic);
  const courseLevel = skillLevelToCourseLevel(input.skillLevel);

  return {
    assessmentId: input.assessmentId,
    topic: input.topic,
    customTopic: input.customTopic,
    topicLabel,
    skillLevel: input.skillLevel,
    courseLevel,
    category,
    topics: [topicLabel],
    goal: input.goal,
  };
}

export function getRecommendedCourseTitle(prefill: LearningPathPrefill): string {
  return `${prefill.topicLabel} — ${prefill.skillLevel} track`;
}

export function getLearningPathSteps(prefill: LearningPathPrefill): LearningPathStep[] {
  const goalLabel = prefill.goal ? GOAL_LABELS[prefill.goal] : 'Your goals';

  if (prefill.skillLevel === 'Beginner') {
    return [
      {
        title: 'Build foundations',
        description: `Start with core ${prefill.topicLabel} concepts tailored for beginners.`,
      },
      {
        title: 'Practice with guided labs',
        description: 'Apply what you learn through interactive exercises and sandbox labs.',
      },
      {
        title: 'Track progress with quizzes',
        description: `${goalLabel} — measure growth with module quizzes before advancing.`,
      },
    ];
  }

  if (prefill.skillLevel === 'Intermediate') {
    return [
      {
        title: 'Structured modules',
        description: `Deepen ${prefill.topicLabel} skills with hands-on lessons at your level.`,
      },
      {
        title: 'Real-world exercises',
        description: 'Solve practical scenarios in coding, terminal, or simulation labs.',
      },
      {
        title: 'Module exams',
        description: `${goalLabel} — validate mastery before moving to advanced topics.`,
      },
    ];
  }

  return [
    {
      title: 'Advanced curriculum',
      description: `Challenge yourself with expert-level ${prefill.topicLabel} content.`,
    },
    {
      title: 'Complex lab scenarios',
      description: 'Tackle SOC, network, or coding challenges matched to your score.',
    },
    {
      title: 'Course-wide assessment',
      description: `${goalLabel} — capstone exams to prove expert-level readiness.`,
    },
  ];
}

export function saveLearningGoal(goal: LearningGoal) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(LEARNING_PATH_GOAL_KEY, goal);
}

export function readLearningGoal(): LearningGoal | undefined {
  if (typeof window === 'undefined') return undefined;
  const value = sessionStorage.getItem(LEARNING_PATH_GOAL_KEY);
  if (!value) return undefined;
  return value as LearningGoal;
}

export function saveLearningPathPrefill(prefill: LearningPathPrefill): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(LEARNING_PATH_PREFILL_KEY, JSON.stringify(prefill));
}

export function readLearningPathPrefill(): LearningPathPrefill | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(LEARNING_PATH_PREFILL_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LearningPathPrefill;
  } catch {
    return null;
  }
}

export function clearLearningPathPrefill(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(LEARNING_PATH_PREFILL_KEY);
}
