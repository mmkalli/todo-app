import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { login } from "@/lib/auth-actions";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  const initialError =
    error === "link" ? "That link is invalid or has expired. Please try again." : undefined;

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Welcome back</h1>
      <AuthForm
        action={login}
        submitLabel="Log in"
        pendingText="Logging in…"
        initialError={initialError}
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
        ]}
      />
      <div className="mt-6 flex flex-col gap-3 text-center text-[0.9375rem] text-muted">
        <Link href="/forgot-password" className="link">Forgot your password?</Link>
        <p>
          New here? <Link href="/signup" className="link">Create an account</Link>
        </p>
      </div>
    </>
  );
}
