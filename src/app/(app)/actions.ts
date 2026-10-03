"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/server";
import { validateTodoInput, type TodoInput } from "@/lib/todos";

type Result = { error?: string };

// Row-level security in the database guarantees users only touch their own
// todos; these actions just validate input and report errors.

export async function addTodo(input: TodoInput & { id: string }): Promise<Result> {
  const parsed = validateTodoInput(input);
  if (typeof parsed === "string") return { error: parsed };

  const { supabase } = await requireUser();
  const { error } = await supabase.from("todos").insert({ ...parsed, id: input.id });
  revalidatePath("/");
  return error ? { error: "Couldn't add the todo. Please try again." } : {};
}

export async function updateTodo(id: string, input: TodoInput): Promise<Result> {
  const parsed = validateTodoInput(input);
  if (typeof parsed === "string") return { error: parsed };

  const { supabase } = await requireUser();
  const { error } = await supabase.from("todos").update(parsed).eq("id", id);
  revalidatePath("/");
  return error ? { error: "Couldn't save your changes. Please try again." } : {};
}

export async function setCompleted(id: string, completed: boolean): Promise<Result> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("todos").update({ completed }).eq("id", id);
  revalidatePath("/");
  return error ? { error: "Couldn't update the todo. Please try again." } : {};
}

export async function deleteTodo(id: string): Promise<Result> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("todos").delete().eq("id", id);
  revalidatePath("/");
  return error ? { error: "Couldn't delete the todo. Please try again." } : {};
}
