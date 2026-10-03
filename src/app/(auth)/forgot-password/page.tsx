import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { requestPasswordReset } from "@/lib/auth-actions";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mb-6 text-muted">Enter your email and we&apos;ll send you a link to choose a new password.</p>
      <AuthForm
        action={requestPasswordReset}
        submitLabel="Send reset link"
        pendingText="Sending…"
        hideOnSuccess
        fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
      />
      <p className="mt-6 text-center text-[0.9375rem] text-muted">
        <Link href="/login" className="link">Back to log in</Link>
      </p>
    </>
  );
}
