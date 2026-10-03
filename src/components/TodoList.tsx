"use client";

import { useOptimistic, useState, useSyncExternalStore, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { addTodo, deleteTodo, setCompleted, updateTodo } from "@/app/(app)/actions";
import { filterTodos, localToday, parseView, sortTodos, type Todo, type TodoInput, type View } from "@/lib/todos";
import { AddTodoForm } from "./AddTodoForm";
import { FilterTabs } from "./FilterTabs";
import { TodoItem } from "./TodoItem";

type Op =
  | { type: "add"; todo: Todo }
  | { type: "update"; id: string; patch: Partial<Todo> }
  | { type: "delete"; id: string };

function reducer(todos: Todo[], op: Op): Todo[] {
  switch (op.type) {
    case "add":
      return [op.todo, ...todos];
    case "update":
      return todos.map((t) => (t.id === op.id ? { ...t, ...op.patch } : t));
    case "delete":
      return todos.filter((t) => t.id !== op.id);
  }
}

const noopSubscribe = () => () => {};

const EMPTY_TEXT: Record<View, string> = {
  all: "Nothing to do. Add your first todo above!",
  today: "Nothing due today. Enjoy your day!",
  upcoming: "No upcoming todos with a due date.",
  completed: "No completed todos yet.",
};

export function TodoList({ todos }: { todos: Todo[] }) {
  const view = parseView(useSearchParams().get("view"));
  const [optimistic, apply] = useOptimistic(todos, reducer);
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  // "Today" depends on the viewer's timezone, so only compute it in the browser.
  const today = useSyncExternalStore(noopSubscribe, localToday, () => null);

  function run(op: Op, action: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      apply(op);
      const result = await action();
      if (result.error) setError(result.error);
    });
  }

  const handleAdd = (input: TodoInput) => {
    const id = crypto.randomUUID();
    const todo: Todo = { ...input, id, completed: false, created_at: new Date().toISOString() };
    run({ type: "add", todo }, () => addTodo({ ...input, id }));
  };

  const visible = sortTodos(filterTodos(optimistic, view, today, query));
  const counts = {
    all: filterTodos(optimistic, "all", today, "").length,
    today: filterTodos(optimistic, "today", today, "").length,
    upcoming: filterTodos(optimistic, "upcoming", today, "").length,
    completed: filterTodos(optimistic, "completed", today, "").length,
  };

  return (
    <div className="flex flex-col gap-4">
      <AddTodoForm onAdd={handleAdd} defaultDue={view === "today" ? today : null} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs current={view} counts={today ? counts : null} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          aria-label="Search todos"
          className="input sm:w-48"
        />
      </div>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
          {error}
          <button type="button" onClick={() => setError(null)} aria-label="Dismiss error" className="font-bold">×</button>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted">{query ? `No todos match "${query}".` : EMPTY_TEXT[view]}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              today={today}
              onToggle={() =>
                run({ type: "update", id: todo.id, patch: { completed: !todo.completed } }, () =>
                  setCompleted(todo.id, !todo.completed),
                )
              }
              onSave={(input) => run({ type: "update", id: todo.id, patch: input }, () => updateTodo(todo.id, input))}
              onDelete={() => run({ type: "delete", id: todo.id }, () => deleteTodo(todo.id))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
