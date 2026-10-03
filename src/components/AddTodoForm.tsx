"use client";

import { useState } from "react";
import type { Priority, TodoInput } from "@/lib/todos";
import { TodoFields } from "./TodoFields";

export function AddTodoForm({ onAdd, defaultDue }: { onAdd: (input: TodoInput) => void; defaultDue: string | null }) {
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [notes, setNotes] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({
      title: trimmed,
      notes: notes.trim() || null,
      due_date: dueDate || defaultDue || null,
      priority,
    });
    setTitle("");
    setDueDate("");
    setPriority("medium");
    setNotes("");
    setExpanded(false);
  }

  return (
    <form onSubmit={submit} className="card flex flex-col gap-3 p-3">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          aria-label="New todo title"
          maxLength={500}
          className="input flex-1"
        />
        <button type="submit" disabled={!title.trim()} className="rounded-lg bg-indigo-600 px-4 font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
          Add
        </button>
      </div>
      {expanded ? (
        <TodoFields
          dueDate={dueDate}
          priority={priority}
          notes={notes}
          onChange={(p) => {
            if (p.dueDate !== undefined) setDueDate(p.dueDate);
            if (p.priority !== undefined) setPriority(p.priority);
            if (p.notes !== undefined) setNotes(p.notes);
          }}
        />
      ) : (
        <button type="button" onClick={() => setExpanded(true)} className="self-start text-xs text-muted hover:text-indigo-600">
          + Due date, priority, notes
        </button>
      )}
    </form>
  );
}
