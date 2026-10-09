"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export type NewPasswordState = { error?: string };

export async function updatePassword(_prev: NewPasswordState, formData: FormData): Promise<NewPasswordState> {
  const { supabase } = await requireUser();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
  if (password !== confirm) return { error: "As senhas não são iguais." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.code === "same_password") return { error: "Escolha uma senha diferente da anterior." };
    return { error: "Não foi possível salvar a nova senha. Peça um novo link e tente de novo." };
  }

  redirect("/clientes");
}
