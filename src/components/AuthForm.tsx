"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/auth-actions";
import { SubmitButton } from "./SubmitButton";

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "password";
  autoComplete: string;
  minLength?: number;
};

export function AuthForm({
  action,
  fields,
  submitLabel,
  pendingText,
  initialError,
  hideOnSuccess = false,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  pendingText: string;
  initialError?: string;
  hideOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, { error: initialError });

  if (state.message && hideOnSuccess) {
    return <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-1 text-sm font-medium">
          {f.label}
          <input
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            minLength={f.minLength}
            required
            className="input"
          />
        </label>
      ))}
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          {state.message}
        </p>
      )}
      <SubmitButton pendingText={pendingText}>{submitLabel}</SubmitButton>
    </form>
  );
}
