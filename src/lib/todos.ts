export type Priority = "low" | "medium" | "high";

export type Todo = {
  id: string;
  title: string;
  notes: string | null;
  due_date: string | null; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  created_at: string;
};

export type TodoInput = {
  title: string;
  notes: string | null;
  due_date: string | null;
  priority: Priority;
};

export const VIEWS = ["all", "today", "upcoming", "completed"] as const;
export type View = (typeof VIEWS)[number];

export const PRIORITIES: Priority[] = ["low", "medium", "high"];

export function parseView(value: unknown): View {
  return VIEWS.includes(value as View) ? (value as View) : "all";
}

/** Validates user input; returns a clean TodoInput or an error message. */
export function validateTodoInput(raw: {
  title?: unknown;
  notes?: unknown;
  due_date?: unknown;
  priority?: unknown;
}): TodoInput | string {
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return "Title can't be empty.";
  if (title.length > 500) return "Title is too long (max 500 characters).";

  const notes = typeof raw.notes === "string" ? raw.notes.trim() : "";
  if (notes.length > 5000) return "Notes are too long (max 5000 characters).";

  const due = typeof raw.due_date === "string" ? raw.due_date : "";
  if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) return "Invalid due date.";

  const priority = PRIORITIES.includes(raw.priority as Priority) ? (raw.priority as Priority) : "medium";

  return { title, notes: notes || null, due_date: due || null, priority };
}

/** Today's date in the viewer's local timezone, as YYYY-MM-DD. */
export function localToday() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDue(date: string, today: string | null) {
  if (today && date === today) return "Today";
  const d = new Date(`${date}T00:00:00`);
  if (today) {
    const t = new Date(`${today}T00:00:00`);
    const diff = Math.round((d.getTime() - t.getTime()) / 86_400_000);
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
}

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

/** Open todos first, then by due date (no date last), priority, newest. */
export function sortTodos(todos: Todo[]) {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.due_date !== b.due_date) {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return a.due_date < b.due_date ? -1 : 1;
    }
    if (a.priority !== b.priority) return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    return a.created_at < b.created_at ? 1 : -1;
  });
}

export function filterTodos(todos: Todo[], view: View, today: string | null, query: string) {
  const q = query.trim().toLowerCase();
  return todos.filter((t) => {
    if (q && !t.title.toLowerCase().includes(q) && !t.notes?.toLowerCase().includes(q)) return false;
    switch (view) {
      case "completed":
        return t.completed;
      case "today":
        return !t.completed && !!t.due_date && !!today && t.due_date <= today;
      case "upcoming":
        return !t.completed && !!t.due_date && !!today && t.due_date > today;
      default:
        return !t.completed;
    }
  });
}
