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
  using (auth.email() = 'tmathews207@gmail.com');

-- After running this file, create the admin login in
-- Authentication -> Users -> Add user (email tmathews207@gmail.com, set a password).
