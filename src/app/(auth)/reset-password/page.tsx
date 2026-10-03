import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { updatePassword } from "@/lib/auth-actions";
import { requireUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  // The email link logs the user in first; without a session there's nothing to reset.
  await requireUser();

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Choose a new password</h1>
      <AuthForm
        action={updatePassword}
        submitLabel="Save password"
        pendingText="Saving…"
        fields={[
          { name: "password", label: "New password (min. 8 characters)", type: "password", autoComplete: "new-password", minLength: 8 },
          { name: "confirm", label: "Confirm new password", type: "password", autoComplete: "new-password", minLength: 8 },
        ]}
      />
    </>
  );
}
