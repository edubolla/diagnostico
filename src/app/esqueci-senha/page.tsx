"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type ResetState } from "./actions";

export default function EsqueciSenhaPage() {
  const [state, action, pending] = useActionState<ResetState, FormData>(requestPasswordReset, {});

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Recuperar acesso</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-brand">Esqueci minha senha</h1>
        </div>
        <form action={action} className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div>
            <label htmlFor="email" className="label">E-mail</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="nome@eduardometinger.com" className="input" />
          </div>
          {state.error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
          {state.message && <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{state.message}</p>}
          <button type="submit" disabled={pending} className="btn w-full">
            {pending ? "Enviando…" : "Enviar link de recuperação"}
          </button>
          <p className="text-center text-sm">
            <Link href="/login" className="font-semibold text-brand hover:underline">Voltar para o login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
