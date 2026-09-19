import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project values.',
  );
}

// Fall back to a syntactically-valid placeholder so a missing .env fails at request time
// (a clear network/auth error) rather than crashing the whole app at import time.
export const supabase = createClient(url || 'https://placeholder.invalid', anonKey || 'placeholder-anon-key');

export interface ResponseRow {
  id: string;
  respondent_number: number;
  submitted_at: string;
  answers: Record<string, unknown>;
}
