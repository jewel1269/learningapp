export type QuestionType = 'mcq' | 'short_answer';
export type ExamScope = 'module' | 'course';

// A question as served for taking. The backend's toJSON strips `correctAnswer`
// (see quiz.model stripAnswers) — it's only revealed in a submission's results.
export interface AssessmentQuestion {
  question: string;
  type: QuestionType;
  options: string[] | null;
}

export interface Quiz {
  id: string;
  lessonId: string;
  userId: string;
  questions: AssessmentQuestion[];
  generatedAt: string;
}

export interface Exam {
  id: string;
  scope: ExamScope;
  scopeId: string;
  userId: string;
  questions: AssessmentQuestion[];
  generatedAt: string;
}

export interface SubmittedAnswer {
  questionIndex: number;
  answer: string;
}

// Per-question grading outcome — includes the correct answer + feedback so the
// results view can teach after submission.
export interface GradedResult {
  questionIndex: number;
  correct: boolean;
  correctAnswer: string;
  feedback: string;
}

// Shared by quiz + exam submissions (same schema on the backend).
export interface AssessmentSubmission {
  id: string;
  userId: string;
  answers: SubmittedAnswer[];
  results: GradedResult[];
  score: number; // 0–100
  submittedAt: string;
}
