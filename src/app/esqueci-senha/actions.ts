"use server";

import { cookies, headers } from "next/headers";
import { AUTH_NEXT_COOKIE, isAllowedEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ResetState = { error?: string; message?: string };

// Mesma resposta exista ou não a conta (e seja qual for o e-mail), para não dar pistas.
const RESET_SENT =
  "Se houver uma conta com esse e-mail, enviamos um link para criar uma nova senha. Abra o link neste mesmo navegador.";

export async function requestPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isAllowedEmail(email)) {
    return { message: RESET_SENT };
  }

  const origin = (await headers()).get("origin") ?? "";
  (await cookies()).set(AUTH_NEXT_COOKIE, "/redefinir-senha", {
    httpOnly: true,
    sameSite: "lax",
    secure: origin.startsWith("https"),
    maxAge: 60 * 60,
    path: "/",
  });

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback`,
  });
  if (error?.status === 429) {
    return { error: "Muitas tentativas. Aguarde alguns minutos e tente de novo." };
  }

  return { message: RESET_SENT };
}
