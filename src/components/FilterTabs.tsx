"use client";

import { VIEWS, type View } from "@/lib/todos";

const LABELS: Record<View, string> = { all: "All", today: "Today", upcoming: "Upcoming", completed: "Done" };

/**
 * Filtering happens in the browser, so switching tabs only updates the URL
 * (via the History API, which Next.js syncs with useSearchParams) instead of
 * re-rendering the page on the server.
 */
export function FilterTabs({ current, counts }: { current: View; counts: Record<View, number> | null }) {
  return (
    <nav className="grid grid-cols-4 gap-1 rounded-2xl bg-subtle p-1 sm:inline-grid" aria-label="Filter todos">
      {VIEWS.map((v) => {
        const active = v === current;
        const href = v === "all" ? "/" : `/?view=${v}`;
        return (
          <a
            key={v}
            href={href}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let "open in new tab" work
              e.preventDefault();
              if (!active) window.history.pushState(null, "", href);
            }}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-1 text-[0.9375rem] font-medium transition sm:px-4 ${
              active ? "bg-[var(--card)] text-indigo-600 shadow-sm dark:text-indigo-400" : "text-muted hover:text-[var(--foreground)]"
            }`}
          >
            {LABELS[v]}
            {counts && (
              <span
                className={`hidden min-w-5 rounded-full px-1.5 text-center sm:inline-block text-xs font-semibold leading-5 ${
                  active ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "bg-[var(--border)] text-muted"
                }`}
              >
                {counts[v]}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
