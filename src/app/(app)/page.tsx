import { Greeting } from "@/components/Greeting";
import { TodoList } from "@/components/TodoList";
import { getDisplayName, requireUser } from "@/lib/supabase/server";
import type { Todo } from "@/lib/todos";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { passwordUpdated } = await searchParams;
  const { supabase } = await requireUser();

  const [{ data, error }, name] = await Promise.all([
    supabase
      .from("todos")
      .select("id, title, notes, due_date, priority, completed, created_at")
      .order("created_at", { ascending: false }),
    getDisplayName(),
  ]);

  if (error) {
    console.error("Loading todos failed:", error.code, error.message);
    throw new Error("Couldn't load your todos.");
  }

  return (
    <>
      {passwordUpdated && (
        <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-[0.9375rem] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          Your password was updated.
        </p>
      )}
      <Greeting name={name} />
      <TodoList todos={data as Todo[]} />
    </>
  );
}
