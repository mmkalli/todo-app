import { logout } from "@/lib/auth-actions";
import { requireUser } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();
  const name = profile?.display_name || user.email;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4">
      <header className="flex items-center justify-between gap-4 py-5">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-base text-white">✓</span>
          Todo
        </div>
        <div className="flex min-w-0 items-center gap-3 text-sm">
          <span className="truncate text-muted" title={user.email}>{name}</span>
          <form action={logout}>
            <button type="submit" className="btn-ghost">Log out</button>
          </form>
        </div>
      </header>
      <main className="flex-1 pb-16">{children}</main>
    </div>
  );
}
