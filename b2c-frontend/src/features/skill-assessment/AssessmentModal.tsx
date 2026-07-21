'use client';

import { useEffect, useState } from 'react';
import {
  ASSESSMENT_SEEN_KEY,
} from '@/src/features/skill-assessment/skillAssessmentApi';
import { CreateAssessmentDialog } from '@/src/features/skill-assessment/CreateAssessmentDialog';

export function AssessmentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ASSESSMENT_SEEN_KEY);
    if (!seen) setOpen(true);
  }, []);

  function dismiss() {
    localStorage.setItem(ASSESSMENT_SEEN_KEY, '1');
    setOpen(false);
  }

  return <CreateAssessmentDialog open={open} onClose={dismiss} />;
}

export default AssessmentModal;
