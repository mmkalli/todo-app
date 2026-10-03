import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Setup needed" };

/** Shown until Supabase keys are added to .env.local. */
export default function SetupPage() {
  if (isSupabaseConfigured()) redirect("/");

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-12">
      <div className="card p-6">
        <h1 className="mb-2 text-xl font-semibold">Almost there: connect Supabase</h1>
        <p className="mb-4 text-sm text-muted">The app is running, but it needs a Supabase project for login and storing todos.</p>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm">
          <li>Create a free project at <a className="link" href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">supabase.com</a>.</li>
          <li>Open <b>SQL Editor</b>, paste the contents of <code>supabase/schema.sql</code> and click <b>Run</b>.</li>
          <li>Copy <code>.env.example</code> to <code>.env.local</code> and fill in the URL and anon key from <b>Project Settings → API</b>.</li>
          <li>Restart the dev server (<code>npm run dev</code>) and reload this page.</li>
        </ol>
      </div>
    </main>
  );
}
