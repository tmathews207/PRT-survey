import { supabase } from './supabase';

export type PromptOverrides = Record<string, string>; // question_id -> edited prompt text

/**
 * All current prompt overrides, keyed by question id. Used by both the live survey
 * (to show admin-edited wording) and the admin editor (to prefill its textareas).
 * Never throws -- a fetch failure just means "no overrides," so a Supabase hiccup
 * never blocks a respondent from taking the survey.
 */
export async function fetchPromptOverrides(): Promise<PromptOverrides> {
  const { data, error } = await supabase.from('question_text_overrides').select('question_id, prompt');
  if (error || !data) {
    // eslint-disable-next-line no-console
    console.error('Could not load prompt overrides, falling back to default text.', error);
    return {};
  }
  const overrides: PromptOverrides = {};
  for (const row of data) {
    overrides[row.question_id as string] = row.prompt as string;
  }
  return overrides;
}

/** Upserts one edited prompt. */
export async function savePromptOverride(questionId: string, prompt: string): Promise<void> {
  const { error } = await supabase
    .from('question_text_overrides')
    .upsert({ question_id: questionId, prompt, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/** Removes an override, reverting that question to its hardcoded default text. */
export async function resetPromptOverride(questionId: string): Promise<void> {
  const { error } = await supabase.from('question_text_overrides').delete().eq('question_id', questionId);
  if (error) throw error;
}
