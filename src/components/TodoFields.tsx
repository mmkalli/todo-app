import { PRIORITIES, type Priority } from "@/lib/todos";

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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted">
          Due date
          <input type="date" value={dueDate} onChange={(e) => onChange({ dueDate: e.target.value })} className="input" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted">
          Priority
          <select value={priority} onChange={(e) => onChange({ priority: e.target.value as Priority })} className="input capitalize">
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Notes
        <textarea value={notes} onChange={(e) => onChange({ notes: e.target.value })} rows={2} maxLength={5000} className="input resize-y" />
      </label>
    </div>
  );
}
