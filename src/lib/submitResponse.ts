import { supabase } from './supabase';
import { generateRespondentNumber } from './respondentNumber';
import type { AnswersState } from '../types/survey';

const UNIQUE_VIOLATION = '23505';
const MAX_ATTEMPTS = 5;

/** Inserts one response row with a fresh random respondent_number, retrying on the rare collision. */
export async function submitResponse(answers: AnswersState): Promise<number> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const respondentNumber = generateRespondentNumber();
    const { error } = await supabase.from('responses').insert({
      respondent_number: respondentNumber,
      answers,
    });
    if (!error) return respondentNumber;
    if (error.code !== UNIQUE_VIOLATION) throw error;
  }
  throw new Error('Could not generate a unique respondent number after several attempts.');
}
