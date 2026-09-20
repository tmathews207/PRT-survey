export interface ChoiceOption {
  id: string;
  label: string;
  /** Selecting this option reveals a free-text box, e.g. "Something else (explain)" */
  explain?: boolean;
  /** "None of the above" style option: selecting it clears every other selection, and vice versa. */
  exclusive?: boolean;
}

export interface BaseQuestion {
  id: string;
  /** Plain prompt text. Use promptHtml for the rare case a word needs emphasis (e.g. underline). */
  prompt: string;
  /** Optional HTML override of the prompt (only used where a word must be underlined/italicized). */
  promptHtml?: string;
  required?: boolean; // defaults to true
}

export interface SingleSelectQuestion extends BaseQuestion {
  type: 'single-select';
  options: ChoiceOption[];
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: 'multi-select';
  options: ChoiceOption[];
}

/** Rows are generated at render time from the selected options of a prior multi-select question. */
export interface MatrixQuestion extends BaseQuestion {
  type: 'matrix';
  rowsFromQuestionId: string;
  columns: ChoiceOption[];
}

export interface FreeTextQuestion extends BaseQuestion {
  type: 'free-text';
  maxLength?: number; // defaults to 1000
  allowPreferNotToAnswer?: boolean;
  /** When set, the prompt is generated at render time from a prior question's selected option labels. */
  promptFromQuestionId?: string;
  promptTemplate?: (selectedLabels: string[]) => string;
  /** Renders a numeric input (brings up the number pad on mobile) instead of a textarea. */
  numeric?: boolean;
}

export interface ImageOption {
  id: string;
  label: string; // alt text / caption
  src: string;
}

/** Supported by the engine for future surveys; not used by the current question set. */
export interface ImageChoiceQuestion extends BaseQuestion {
  type: 'image-choice';
  images: ImageOption[];
}

/** Ranks items selected in a prior question, 1..N. Supported for future use. */
export interface RankingQuestion extends BaseQuestion {
  type: 'ranking';
  rowsFromQuestionId: string;
}

export type Question =
  | SingleSelectQuestion
  | MultiSelectQuestion
  | MatrixQuestion
  | FreeTextQuestion
  | ImageChoiceQuestion
  | RankingQuestion;

export interface SurveyPage {
  id: string;
  questions: Question[];
}

export const PREFER_NOT_TO_ANSWER = '__PREFER_NOT_TO_ANSWER__';

/** Answers keyed by question id (and `${questionId}_explain` for explain sub-answers). */
export type AnswerValue =
  | string // single-select option id, free-text value
  | string[] // multi-select option ids
  | Record<string, string> // matrix: rowOptionId -> columnOptionId
  | Record<string, number>; // ranking: rowOptionId -> rank

export type AnswersState = Record<string, AnswerValue>;
