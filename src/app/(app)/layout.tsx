import { CheckIcon, LogoutIcon } from "@/components/icons";
import { logout } from "@/lib/auth-actions";
import { getDisplayName, requireUser } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [{ user }, name] = await Promise.all([requireUser(), getDisplayName()]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between gap-4 py-5 sm:py-7">
        <div className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
          <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/25">
            <CheckIcon className="size-6" />
          </span>
          Todo
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="grid size-10 shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold uppercase text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            title={user.email}
            aria-hidden="true"
          >
            {name.charAt(0)}
          </span>
          <span className="hidden max-w-56 truncate text-[0.9375rem] text-muted sm:block" title={user.email}>{name}</span>
          <form action={logout}>
            <button type="submit" className="btn-ghost" aria-label="Log out">
              <LogoutIcon className="size-5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 pb-[max(4rem,env(safe-area-inset-bottom))]">{children}</main>
    </div>
  );
}
