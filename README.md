# PRT Survey

Anonymous, mobile-first survey PWA on physical readiness training. Respondents get a single
URL, answer 14 pages of questions with no back button, and are identified only by a random
respondent number. Admin can log in at `/admin` to see the response count and download all
responses as an Excel file.

## Stack

- **Frontend**: React + TypeScript + Vite, built as an installable PWA (`vite-plugin-pwa`).
- **Backend**: [Supabase](https://supabase.com) (Postgres) — respondents get anonymous
  insert-only access via Row Level Security; only the admin account can read responses.
- **Export**: client-side, built with [SheetJS](https://sheetjs.com) from data fetched by the
  authenticated admin — no server function needed.
- **Hosting**: [Vercel](https://vercel.com), auto-deployed from this GitHub repo.

## One-time setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run everything in [`supabase/schema.sql`](supabase/schema.sql). This
   creates the `responses` table and the Row Level Security policies that keep the survey
   anonymous (respondents can only insert, never read).
3. Go to **Authentication -> Users -> Add user** and create the admin login (email
   `tmathews207@gmail.com`, choose a password). This is the only account that can read
   responses and use the export — matched by email in the RLS policy in `schema.sql`.
4. Go to **Project Settings -> API** and copy the **Project URL** and **anon public** key.

### 2. Local environment

```bash
cp .env.example .env
# paste your Project URL and anon key into .env
npm install
npm run dev
```

Visit `http://localhost:5173` for the survey, `http://localhost:5173/admin` for the admin
dashboard.

### 3. Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In Vercel, "Add New Project" -> import this GitHub repo.
3. Add the same two environment variables from `.env` (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy. Every push to the main branch auto-deploys.

Share the deployed URL with your office — on a phone, "Add to Home Screen" installs it like an
app.

## Editing survey questions

All questions live in one file: [`src/config/survey.ts`](src/config/survey.ts). Each page is an
entry in `SURVEY_PAGES` with one or more questions. Supported question types: `single-select`,
`multi-select`, `matrix` (a ratings grid whose rows come from a prior question's selections),
`free-text`, `image-choice`, and `ranking`. Edit the file and push — Vercel redeploys
automatically.

## Anonymity & data model

Each submission is one row in the `responses` table: a random 6-digit `respondent_number`
(never sequential, so submission order can't be inferred), a timestamp, and a JSON blob of
every answer. No identifying or demographic information is collected. The Excel export
flattens that JSON into one row per respondent and one column per question, sorted by
respondent number.
