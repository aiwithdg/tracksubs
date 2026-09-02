# TrackSubs

A subscription tracker: what you pay, when it renews, and what it costs you
across weekly, monthly, quarterly, yearly, and custom billing cycles.

- **Framework:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth & database:** Supabase (email/password auth, Postgres with row-level security)
- **Hosting:** Vercel
- **Design:** card-based UI with CSS-variable theming and a flash-free light/dark toggle, in the spirit of [TREK](https://github.com/liketrek/TREK)

## Features

- Email/password sign up & sign in (Supabase Auth)
- Add, edit, pause/resume, and delete subscriptions
- Normalizes any billing cycle (weekly/monthly/quarterly/yearly/custom-days) to a monthly & yearly total
- Dashboard summary: monthly spend, renewals due this week, active count
- Sorted list surfacing overdue and soon-to-renew subscriptions first
- "Mark renewed" rolls the next renewal date forward by one cycle
- Row-level security — every user only ever sees their own data
- Light/dark theme, no flash on load

## Supabase project

A project (`tracksubs`, org `aiwithdg`, region `ap-south-1`) is already
provisioned with `supabase/schema.sql` applied — the `subscriptions` table,
its indexes, and its row-level security policies are live. Security advisors
report no issues. Ask for the project's URL/anon key if you need to point a
new environment at it, or provision your own (steps below) to keep it fully
separate.

## Local setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (or use the existing `tracksubs` project above).
2. **Run the schema** — open the SQL editor in your Supabase project and run
   the contents of [`supabase/schema.sql`](./supabase/schema.sql). This creates
   the `subscriptions` table and its row-level security policies. (Already
   applied on the `tracksubs` project.)
3. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
   Project Settings → API in your Supabase dashboard.
4. **Install & run**:
   ```bash
   npm install
   npm run dev
   ```
   Visit http://localhost:3000.

### Email confirmation (optional but recommended)

By default Supabase requires email confirmation before sign-in works. Either:
- Keep it on, and in **Authentication → URL Configuration** set the Site URL
  and add `http://localhost:3000/auth/callback` (and your production URL) to
  the redirect allow-list, or
- Turn "Confirm email" off in **Authentication → Providers → Email** for
  faster local testing.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Add New Project** → import the repo.
3. Add the two environment variables from `.env.example` (Project Settings →
   Environment Variables) using your Supabase values.
4. Deploy. Add the deployed domain's `/auth/callback` URL to Supabase's
   redirect allow-list (Authentication → URL Configuration).

## Project structure

```
app/
  page.tsx                 landing page
  login/page.tsx           sign in / sign up
  auth/callback/route.ts   exchanges Supabase auth code for a session
  dashboard/
    layout.tsx             auth-gated shell + navbar
    page.tsx                fetches subscriptions, renders summary + list
    actions.ts              server actions: add/update/delete/renew/sign out
components/                 UI: cards, modal, badges, theme toggle
lib/
  supabase/                 browser/server/middleware Supabase clients
  types.ts                  Subscription domain types
  utils.ts                  cost normalization, date math, formatting
supabase/schema.sql          table + RLS policies to run in Supabase
```
