import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { signup } from "@/lib/auth-actions";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Create your account</h1>
      <AuthForm
        action={signup}
        submitLabel="Sign up"
        pendingText="Creating account…"
        hideOnSuccess
        fields={[
          { name: "name", label: "Name", type: "text", autoComplete: "name" },
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Password (min. 8 characters)", type: "password", autoComplete: "new-password", minLength: 8 },
          { name: "confirm", label: "Confirm password", type: "password", autoComplete: "new-password", minLength: 8 },
        ]}
      />
      <p className="mt-6 text-center text-[0.9375rem] text-muted">
        Already have an account? <Link href="/login" className="link">Log in</Link>
      </p>
    </>
  );
}
