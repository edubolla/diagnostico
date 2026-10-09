"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAllowedEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

// Respostas genéricas: não revelam qual domínio é aceito nem quem tem conta.
const LOGIN_ERROR = "E-mail ou senha incorretos.";
const SIGNUP_SENT = "Se os dados estiverem corretos, enviamos um link de confirmação para o seu e-mail.";

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!isAllowedEmail(email)) {
    return { error: LOGIN_ERROR };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Confirme seu e-mail pelo link que enviamos antes de entrar." };
    }
    return { error: LOGIN_ERROR };
  }

  redirect("/clientes");
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (!isAllowedEmail(email)) {
    return { message: SIGNUP_SENT };
  }

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    return { error: "Não foi possível criar a conta. Verifique os dados ou tente entrar." };
  }

  return { message: SIGNUP_SENT };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
