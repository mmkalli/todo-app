"use client";

import { useState } from "react";
import { formatDue, type Priority, type Todo, type TodoInput } from "@/lib/todos";
import { TodoFields } from "./TodoFields";

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export function TodoItem({
  todo,
  today,
  onToggle,
  onSave,
  onDelete,
}: {
  todo: Todo;
  today: string | null;
  onToggle: () => void;
  onSave: (input: TodoInput) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: "", dueDate: "", priority: "medium" as Priority, notes: "" });

  const overdue = !todo.completed && !!todo.due_date && !!today && todo.due_date < today;

  function startEdit() {
    setDraft({ title: todo.title, dueDate: todo.due_date ?? "", priority: todo.priority, notes: todo.notes ?? "" });
    setEditing(true);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    const title = draft.title.trim();
    if (!title) return;
    onSave({ title, notes: draft.notes.trim() || null, due_date: draft.dueDate || null, priority: draft.priority });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="card p-3">
        <form onSubmit={save} className="flex flex-col gap-3">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            aria-label="Todo title"
            maxLength={500}
            autoFocus
            className="input"
          />
          <TodoFields
            dueDate={draft.dueDate}
            priority={draft.priority}
            notes={draft.notes}
            onChange={(p) => setDraft({ ...draft, ...p })}
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={!draft.title.trim()} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
              Save
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="card group flex items-start gap-3 p-3">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        aria-label={todo.completed ? `Mark "${todo.title}" as not done` : `Mark "${todo.title}" as done`}
        className="mt-1 size-5 shrink-0 cursor-pointer accent-indigo-600"
      />
      <div className="min-w-0 flex-1">
        <p className={`break-words ${todo.completed ? "text-muted line-through" : ""}`}>{todo.title}</p>
        {todo.notes && <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-muted">{todo.notes}</p>}
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
          {todo.priority !== "medium" && (
            <span className={`rounded-full px-2 py-0.5 font-medium capitalize ${PRIORITY_STYLE[todo.priority]}`}>{todo.priority}</span>
          )}
          {todo.due_date && (
            <span className={overdue ? "font-medium text-red-600 dark:text-red-400" : "text-muted"}>
              {overdue ? "Overdue · " : "Due "}
              {formatDue(todo.due_date, today)}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1 sm:opacity-0 sm:transition sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        <button type="button" onClick={startEdit} className="btn-ghost" aria-label={`Edit "${todo.title}"`}>Edit</button>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete "${todo.title}"?`)) onDelete();
          }}
          className="btn-ghost hover:text-red-600"
          aria-label={`Delete "${todo.title}"`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
