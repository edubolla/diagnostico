import { redirect } from "next/navigation";
import { isAllowedEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && isAllowedEmail(user.email)) redirect("/clientes");

  const { erro } = await searchParams;
  const initialError =
    erro === "confirmacao" ? "O link de confirmação é inválido ou expirou. Tente entrar ou crie a conta novamente." : undefined;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Área restrita</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-brand">Diagnóstico de Ativos Digitais</h1>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <LoginForm initialError={initialError} />
        </div>
      </div>
    </main>
  );
}
