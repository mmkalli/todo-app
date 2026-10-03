import { PRIORITIES, type Priority } from "@/lib/todos";

const PRIORITY_ACTIVE: Record<Priority, string> = {
  low: "border-zinc-400 bg-zinc-100 text-zinc-800 dark:border-zinc-500 dark:bg-zinc-800 dark:text-zinc-100",
  medium: "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-200",
  high: "border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-200",
};

/** Due date, priority and notes inputs shared by the add and edit forms. */
export function TodoFields({
  dueDate,
  priority,
  notes,
  onChange,
}: {
  dueDate: string;
  priority: Priority;
  notes: string;
  onChange: (patch: { dueDate?: string; priority?: Priority; notes?: string }) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-muted">
          Due date
          <input type="date" value={dueDate} onChange={(e) => onChange({ dueDate: e.target.value })} className="input w-full" />
        </label>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-medium text-muted">Priority</legend>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChange({ priority: p })}
                aria-pressed={priority === p}
                className={`min-h-11 rounded-xl border text-[0.9375rem] font-medium capitalize transition ${
                  priority === p ? PRIORITY_ACTIVE[p] : "border-[var(--border)] text-muted hover:bg-subtle"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-muted">
        Notes
        <textarea value={notes} onChange={(e) => onChange({ notes: e.target.value })} rows={3} maxLength={5000} placeholder="Add details…" className="input resize-y" />
      </label>
    </div>
  );
}
