import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const ALLOWED_DOMAIN = "eduardometinger.com";

// Para onde o link do e-mail deve levar depois do login (ex.: redefinir senha).
export const AUTH_NEXT_COOKIE = "auth_next";

export function isAllowedEmail(email: string | null | undefined) {
  return !!email && email.trim().toLowerCase().split("@")[1] === ALLOWED_DOMAIN;
}

// Garante usuário logado e do domínio permitido. Use em toda página e Server Action.
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedEmail(user.email)) {
    if (user) await supabase.auth.signOut();
    redirect("/login");
  }

  return { supabase, user };
}
