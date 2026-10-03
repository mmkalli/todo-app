"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

async function siteOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email");
  const password = formData.get("password");
  if (!EMAIL_RE.test(email) || typeof password !== "string" || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error:
        error.code === "email_not_confirmed"
          ? "Please confirm your email first. Check your inbox for the link."
          : "Wrong email or password.",
    };
  }
  redirect("/");
}

export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  const displayName = field(formData, "name");
  const email = field(formData, "email");
  const password = formData.get("password");
  const confirm = formData.get("confirm");

  if (!displayName) return { error: "Enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  if (typeof password !== "string" || password.length < MIN_PASSWORD) {
    return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  }
  if (password !== confirm) return { error: "Passwords do not match." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${await siteOrigin()}/auth/confirm?next=/`,
    },
  });
  if (error) return { error: error.message };

  // Email confirmation turned off in Supabase: the user is logged in right away.
  if (data.session) redirect("/");

  return { message: `Almost done! We sent a confirmation link to ${email}. Open it to activate your account.` };
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email");
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteOrigin()}/auth/confirm?next=/reset-password`,
  });
  if (error) return { error: error.message };

  // Same message whether or not the account exists, so emails can't be probed.
  return { message: "If an account exists for that email, a reset link is on its way." };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = formData.get("password");
  const confirm = formData.get("confirm");
  if (typeof password !== "string" || password.length < MIN_PASSWORD) {
    return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  }
  if (password !== confirm) return { error: "Passwords do not match." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  redirect("/?passwordUpdated=1");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
