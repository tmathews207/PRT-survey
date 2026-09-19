import { PREFER_NOT_TO_ANSWER } from '../types/survey';
import type { AnswersState, Question, SurveyPage } from '../types/survey';
import { explainKey, resolveRowOptions } from './surveyHelpers';

function isQuestionAnswered(question: Question, answers: AnswersState): boolean {
  if (question.required === false) return true;

  switch (question.type) {
    case 'single-select': {
      const value = answers[question.id];
      if (typeof value !== 'string' || value.length === 0) return false;
      const option = question.options.find((o) => o.id === value);
      if (option?.explain) {
        const explanation = answers[explainKey(question.id)];
        return typeof explanation === 'string' && explanation.trim().length > 0;
      }
      return true;
    }
    case 'multi-select': {
      const value = answers[question.id];
      if (!Array.isArray(value) || value.length === 0) return false;
      const explainSelected = question.options.some((o) => o.explain && value.includes(o.id));
      if (explainSelected) {
        const explanation = answers[explainKey(question.id)];
        return typeof explanation === 'string' && explanation.trim().length > 0;
      }
      return true;
    }
    case 'matrix': {
      const rows = resolveRowOptions(question.rowsFromQuestionId, answers);
      const value = answers[question.id];
      const record: Record<string, unknown> = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      return rows.every((row) => typeof record[row.id] === 'string' && (record[row.id] as string).length > 0);
    }
    case 'free-text': {
      const value = answers[question.id];
      if (typeof value !== 'string') return false;
      if (value === PREFER_NOT_TO_ANSWER) return true;
      return value.trim().length > 0;
    }
    case 'image-choice': {
      const value = answers[question.id];
      return typeof value === 'string' && value.length > 0;
    }
    case 'ranking': {
      const rows = resolveRowOptions(question.rowsFromQuestionId, answers);
      const value = answers[question.id];
      const record: Record<string, unknown> = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
      return rows.every((row) => record[row.id] != null);
    }
    default:
      return true;
  }
}

export function isPageComplete(page: SurveyPage, answers: AnswersState): boolean {
  return page.questions.every((q) => isQuestionAnswered(q, answers));
}
