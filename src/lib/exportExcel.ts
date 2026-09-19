import { SURVEY_PAGES } from '../config/survey';
import { PREFER_NOT_TO_ANSWER } from '../types/survey';
import type { AnswersState, ChoiceOption, Question } from '../types/survey';
import { explainKey, getQuestionById } from './surveyHelpers';
import type { ResponseRow } from './supabase';

interface Column {
  key: string; // matches a key produced by valueForColumn, unique across the sheet
  header: string;
}

/** Options a matrix/ranking question can draw rows from -- excludes "none of the above"
 * style options, matching resolveRowOptions in surveyHelpers.ts, since nobody can rate or
 * rank a "none" pick. */
function optionsOf(question: Question | undefined): ChoiceOption[] {
  if (!question) return [];
  if (question.type === 'single-select' || question.type === 'multi-select') {
    return question.options.filter((o) => !o.exclusive);
  }
  return [];
}

function labelFor(options: ChoiceOption[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? id;
}

/** Stable column list derived from the survey structure -- same columns regardless of which
 * options any individual respondent picked, so the sheet lines up across all rows. */
function buildColumns(): Column[] {
  const columns: Column[] = [];

  for (const page of SURVEY_PAGES) {
    for (const q of page.questions) {
      switch (q.type) {
        case 'single-select':
        case 'multi-select':
          columns.push({ key: q.id, header: q.id });
          if (q.options.some((o) => o.explain)) {
            columns.push({ key: explainKey(q.id), header: `${q.id}_explain` });
          }
          break;
        case 'free-text':
          columns.push({ key: q.id, header: q.id });
          break;
        case 'image-choice':
          columns.push({ key: q.id, header: q.id });
          break;
        case 'matrix':
        case 'ranking': {
          const sourceOptions = optionsOf(getQuestionById(q.rowsFromQuestionId));
          for (const row of sourceOptions) {
            columns.push({ key: `${q.id}__${row.id}`, header: `${q.id}_${row.id}` });
          }
          break;
        }
      }
    }
  }

  return columns;
}

function valuesForQuestion(q: Question, answers: AnswersState): Record<string, string> {
  const out: Record<string, string> = {};

  switch (q.type) {
    case 'single-select': {
      const value = answers[q.id];
      out[q.id] = typeof value === 'string' ? labelFor(q.options, value) : '';
      if (q.options.some((o) => o.explain)) {
        out[explainKey(q.id)] = (answers[explainKey(q.id)] as string) ?? '';
      }
      break;
    }
    case 'multi-select': {
      const value = answers[q.id];
      const ids = Array.isArray(value) ? value : [];
      out[q.id] = ids.map((id) => labelFor(q.options, id)).join('; ');
      if (q.options.some((o) => o.explain)) {
        out[explainKey(q.id)] = (answers[explainKey(q.id)] as string) ?? '';
      }
      break;
    }
    case 'free-text': {
      const value = answers[q.id];
      out[q.id] = value === PREFER_NOT_TO_ANSWER ? 'Prefer not to answer' : ((value as string) ?? '');
      break;
    }
    case 'image-choice': {
      const value = answers[q.id];
      const label = q.images.find((img) => img.id === value)?.label;
      out[q.id] = label ?? '';
      break;
    }
    case 'matrix': {
      const sourceOptions = optionsOf(getQuestionById(q.rowsFromQuestionId));
      const value = answers[q.id];
      const record = value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, string>) : {};
      for (const row of sourceOptions) {
        const colId = record[row.id];
        out[`${q.id}__${row.id}`] = colId ? labelFor(q.columns, colId) : '';
      }
      break;
    }
    case 'ranking': {
      const sourceOptions = optionsOf(getQuestionById(q.rowsFromQuestionId));
      const value = answers[q.id];
      const record = value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, number>) : {};
      for (const row of sourceOptions) {
        const rank = record[row.id];
        out[`${q.id}__${row.id}`] = rank != null ? String(rank) : '';
      }
      break;
    }
  }

  return out;
}

function rowFromResponse(response: ResponseRow): Record<string, string | number> {
  const answers = response.answers as AnswersState;
  const row: Record<string, string | number> = {
    'Respondent #': response.respondent_number,
    'Submitted At': new Date(response.submitted_at).toLocaleString(),
  };

  for (const page of SURVEY_PAGES) {
    for (const q of page.questions) {
      Object.assign(row, valuesForQuestion(q, answers));
    }
  }

  return row;
}

export async function exportResponsesToExcel(responses: ResponseRow[], filename = 'prt-survey-responses.xlsx') {
  const XLSX = await import('xlsx');
  const columns = buildColumns();
  const headerRow = ['Respondent #', 'Submitted At', ...columns.map((c) => c.header)];

  const dataRows = responses
    .slice()
    .sort((a, b) => a.respondent_number - b.respondent_number)
    .map((response) => {
      const flat = rowFromResponse(response);
      return [flat['Respondent #'], flat['Submitted At'], ...columns.map((c) => flat[c.key] ?? '')];
    });

  const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');
  XLSX.writeFile(workbook, filename);
}
