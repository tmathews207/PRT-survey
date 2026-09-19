import { SURVEY_PAGES } from '../config/survey';
import type { AnswersState, ChoiceOption, Question } from '../types/survey';

const QUESTION_INDEX: Record<string, Question> = {};
for (const page of SURVEY_PAGES) {
  for (const q of page.questions) {
    QUESTION_INDEX[q.id] = q;
  }
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTION_INDEX[id];
}

export function explainKey(questionId: string): string {
  return `${questionId}_explain`;
}

/** Options from a prior multi-select question that the respondent selected, in the source question's display order. */
export function resolveRowOptions(sourceQuestionId: string, answers: AnswersState): ChoiceOption[] {
  const source = getQuestionById(sourceQuestionId);
  if (!source || (source.type !== 'multi-select' && source.type !== 'single-select')) return [];
  const selected = answers[sourceQuestionId];
  const selectedIds = Array.isArray(selected) ? selected : selected ? [selected] : [];
  return source.options.filter((o) => selectedIds.includes(o.id));
}

export function resolveSelectedLabels(sourceQuestionId: string, answers: AnswersState): string[] {
  return resolveRowOptions(sourceQuestionId, answers).map((o) => o.label);
}
