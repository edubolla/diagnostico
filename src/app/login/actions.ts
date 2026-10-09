"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ALLOWED_DOMAIN, isAllowedEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!isAllowedEmail(email)) {
    return { error: `Acesso permitido apenas para e-mails @${ALLOWED_DOMAIN}.` };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Confirme seu e-mail pelo link que enviamos antes de entrar." };
    }
    return { error: "E-mail ou senha incorretos." };
  }

  redirect("/clientes");
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!isAllowedEmail(email)) {
    return { error: `Cadastro permitido apenas para e-mails @${ALLOWED_DOMAIN}.` };
  }
  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
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

  return { message: "Conta criada. Enviamos um link de confirmação para o seu e-mail." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
