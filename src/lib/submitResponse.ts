import { supabase } from './supabase';
import { generateRespondentNumber } from './respondentNumber';
import type { AnswersState } from '../types/survey';

const UNIQUE_VIOLATION = '23505';
const MAX_NUMBER_ATTEMPTS = 5;
const MAX_NETWORK_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Inserts one response row with a fresh random respondent_number.
 *
 * Handles two distinct failure modes:
 *  - a (rare) respondent_number collision -> regenerate the number and retry immediately.
 *  - a transient/network error -> the kind that shows up when a phone has sat idle for a
 *    while and the network has to reconnect right as the respondent taps Submit -> wait
 *    briefly and retry the same insert before giving up.
 */
export async function submitResponse(answers: AnswersState): Promise<number> {
  let respondentNumber = generateRespondentNumber();
  let numberAttempts = 0;
  let networkAttempts = 0;

  while (true) {
    const { error } = await supabase.from('responses').insert({
      respondent_number: respondentNumber,
      answers,
    });
    if (!error) return respondentNumber;

    if (error.code === UNIQUE_VIOLATION) {
      numberAttempts += 1;
      if (numberAttempts >= MAX_NUMBER_ATTEMPTS) {
        throw new Error('Could not generate a unique respondent number after several attempts.');
      }
      respondentNumber = generateRespondentNumber();
      continue;
    }

    networkAttempts += 1;
    if (networkAttempts >= MAX_NETWORK_RETRIES) throw error;
    await sleep(RETRY_DELAY_MS * networkAttempts);
  }
}
