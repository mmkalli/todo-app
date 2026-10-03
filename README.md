# Todo

A daily todo app with accounts (signup, login, email confirmation, password reset). It's built with Next.js 16, Supabase and Tailwind, and can be installed as an app on desktop and phone.

## Run it locally

1. Create a free project at [supabase.com](https://supabase.com/dashboard).
2. In Supabase, go to **SQL Editor**, paste [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. Copy `.env.example` to `.env.local` and fill in the values from **Project Settings → API**.
4. In Supabase, go to **Authentication → URL Configuration** and add `http://localhost:3000/**` to **Redirect URLs**.
5. Run:
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000.

## Deploy (free) on Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com/new), import the repo and add both `NEXT_PUBLIC_SUPABASE_*` variables.
3. In Supabase, go to **Authentication → URL Configuration**. Set **Site URL** to your Vercel URL and add `https://<your-app>.vercel.app/**` to **Redirect URLs**.
4. **Email for real users:** Supabase's built-in email sender only allows a few emails per hour. Create a free [Resend](https://resend.com) account and enter its SMTP details under **Authentication → Emails → SMTP Settings**.
5. **Optional, recommended:** under **Authentication → Emails → Templates**, change the links in the templates so they also work when opened on a different device:
   - Confirm signup: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/`
   - Reset password: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`

## How it's built

- `src/proxy.ts` refreshes your login session and redirects visitors who aren't logged in to `/login`.
- `src/app/(auth)/*` holds the login, signup, forgot-password and reset-password pages. `src/lib/auth-actions.ts` contains the server actions behind them.
- `src/app/auth/confirm/route.ts` handles the links in signup and password-reset emails.
- `src/app/(app)/*` is the todo list page, and `actions.ts` contains the add, update, complete and delete server actions.
- Privacy: the database itself only lets each user read or change their own rows (row-level security policies in `schema.sql`).
