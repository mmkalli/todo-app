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
    <nav className="flex gap-1 overflow-x-auto rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900" aria-label="Filter todos">
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
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active ? "bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400" : "text-muted hover:text-current"
            }`}
          >
            {LABELS[v]}
            {counts && <span className="ml-1.5 text-xs opacity-60">{counts[v]}</span>}
          </a>
        );
      })}
    </nav>
  );
}
