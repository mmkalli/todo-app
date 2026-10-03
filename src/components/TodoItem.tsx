"use client";

import { useEffect, useState } from "react";
import { formatDue, type Priority, type Todo, type TodoInput } from "@/lib/todos";
import { CalendarIcon, CheckIcon, FlagIcon, PencilIcon, TrashIcon } from "./icons";
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
  // First tap on delete arms it; a second tap within a few seconds deletes.
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!confirmingDelete) return;
    const timer = setTimeout(() => setConfirmingDelete(false), 3000);
    return () => clearTimeout(timer);
  }, [confirmingDelete]);

  const overdue = !todo.completed && !!todo.due_date && !!today && todo.due_date < today;
  const dueToday = !todo.completed && !!today && todo.due_date === today;

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
      <li className="card p-4 shadow-md ring-2 ring-indigo-500/30 sm:p-5">
        <form onSubmit={save} className="flex flex-col gap-4">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            aria-label="Todo title"
            maxLength={500}
            autoFocus
            className="input text-[1.0625rem] font-medium"
          />
          <TodoFields
            dueDate={draft.dueDate}
            priority={draft.priority}
            notes={draft.notes}
            onChange={(p) => setDraft({ ...draft, ...p })}
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(false)} className="btn-ghost px-4">Cancel</button>
            <button type="submit" disabled={!draft.title.trim()} className="btn-primary">Save</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="card group relative flex items-start gap-3 overflow-hidden py-3.5 pl-4 pr-2 transition hover:shadow-md sm:gap-4 sm:py-4 sm:pl-5">
      {!todo.completed && todo.priority === "high" && <span className="absolute inset-y-0 left-0 w-1 bg-red-500" aria-hidden="true" />}
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.completed}
        onClick={onToggle}
        aria-label={todo.completed ? `Mark "${todo.title}" as not done` : `Mark "${todo.title}" as done`}
        className={`-m-1.5 grid size-10 shrink-0 place-items-center rounded-full`}
      >
        <span
          className={`grid size-7 place-items-center rounded-full border-2 transition ${
            todo.completed
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-zinc-300 text-transparent hover:border-indigo-500 hover:text-indigo-500 dark:border-zinc-600"
          }`}
        >
          <CheckIcon className="size-4" />
        </span>
      </button>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className={`break-words text-[1.0625rem] font-medium leading-snug ${todo.completed ? "text-muted line-through" : ""}`}>{todo.title}</p>
        {todo.notes && <p className="mt-1 whitespace-pre-wrap break-words text-[0.9375rem] text-muted">{todo.notes}</p>}
        {(todo.due_date || todo.priority !== "medium") && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            {todo.due_date && (
              <span
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 font-medium ${
                  overdue
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : dueToday
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "bg-subtle text-muted"
                }`}
              >
                <CalendarIcon className="size-3.5" />
                {overdue ? "Overdue · " : ""}
                {formatDue(todo.due_date, today)}
              </span>
            )}
            {todo.priority !== "medium" && (
              <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 font-medium capitalize ${PRIORITY_STYLE[todo.priority]}`}>
                <FlagIcon className="size-3.5" />
                {todo.priority}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Always visible on touch screens; revealed on hover/focus with a mouse. */}
      <div
        className={`flex shrink-0 items-center ${
          confirmingDelete ? "" : "pointer-fine:opacity-0 pointer-fine:transition pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:opacity-100"
        }`}
      >
        {confirmingDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-red-600 px-3 text-[0.9375rem] font-semibold text-white hover:bg-red-500"
            aria-label={`Confirm delete "${todo.title}"`}
            autoFocus
          >
            <TrashIcon className="size-4" />
            Delete
          </button>
        ) : (
          <>
            <button type="button" onClick={startEdit} className="icon-btn" aria-label={`Edit "${todo.title}"`} title="Edit">
              <PencilIcon />
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="icon-btn hover:!text-red-600"
              aria-label={`Delete "${todo.title}"`}
              title="Delete"
            >
              <TrashIcon />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
