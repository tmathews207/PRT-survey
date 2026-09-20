-- Run this once in your Supabase project's SQL editor (Project -> SQL Editor -> New query).

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  respondent_number int unique not null,
  submitted_at timestamptz not null default now(),
  answers jsonb not null
);

alter table responses enable row level security;

-- Table-level grants. If your project has "Automatically expose new tables" turned off
-- (the more secure setting -- Supabase recommends disabling it), a new table gets no
-- privileges for the anon/authenticated roles by default, and RLS policies alone won't
-- let anything through: RLS narrows rows *within* an operation the role is already
-- allowed to attempt, it doesn't grant the operation itself. These two lines grant only
-- the exact operations each role needs; the policies below then restrict which rows.
grant insert on responses to anon;
grant select on responses to authenticated;

-- Anyone (unauthenticated respondents) can submit a response, but can never read any
-- response back -- including their own. This is what keeps the survey anonymous: the
-- anon key used by the public survey page has no read access to this table at all.
drop policy if exists "anon can submit" on responses;
create policy "anon can submit"
  on responses
  for insert
  to anon
  with check (true);

-- Only the signed-in admin account can read responses, for the /admin dashboard and
-- Excel export. Replace the email below if you use a different admin account.
drop policy if exists "admin can read all" on responses;
create policy "admin can read all"
  on responses
  for select
  to authenticated
  using (auth.email() = 'timmathewsdata@gmail.com');

-- After running this file, create the admin login in
-- Authentication -> Users -> Add user (email timmathewsdata@gmail.com, set a password).

-- Lets the admin edit a question's prompt text from /admin without a code change or
-- redeploy. Pages, questions, answer options, and ordering all still live in code
-- (src/config/survey.ts) -- this table only ever overrides the wording of a prompt.
-- One row per overridden question; a question with no row here just shows its
-- hardcoded default text.
create table if not exists question_text_overrides (
  question_id text primary key,
  prompt text not null,
  updated_at timestamptz not null default now()
);

alter table question_text_overrides enable row level security;

-- Everyone (including anonymous respondents) needs to read these, since an edit must
-- show up on the live survey for whoever takes it next.
grant select on question_text_overrides to anon;
grant select, insert, update, delete on question_text_overrides to authenticated;

drop policy if exists "anyone can read prompt overrides" on question_text_overrides;
create policy "anyone can read prompt overrides"
  on question_text_overrides
  for select
  to anon, authenticated
  using (true);

drop policy if exists "admin can write prompt overrides" on question_text_overrides;
create policy "admin can write prompt overrides"
  on question_text_overrides
  for all
  to authenticated
  using (auth.email() = 'timmathewsdata@gmail.com')
  with check (auth.email() = 'timmathewsdata@gmail.com');
