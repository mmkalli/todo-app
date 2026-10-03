"use client";

import { useState } from "react";
import type { Priority, TodoInput } from "@/lib/todos";
import { ChevronIcon, PlusIcon } from "./icons";
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
    <form onSubmit={submit} className="card flex flex-col gap-3 p-3 shadow-sm sm:p-4">
      <div className="flex gap-2 sm:gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          aria-label="New todo title"
          maxLength={500}
          className="input min-h-13 min-w-0 flex-1 text-[1.0625rem]"
        />
        <button type="submit" disabled={!title.trim()} className="btn-primary min-h-13 px-4 sm:px-5" aria-label="Add todo">
          <PlusIcon className="size-5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="btn-ghost self-start px-2 text-sm"
      >
        <ChevronIcon className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        {expanded ? "Hide details" : "Due date, priority, notes"}
      </button>
      {expanded && (
        <div className="px-1 pb-1">
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
        </div>
      )}
    </form>
  );
}
