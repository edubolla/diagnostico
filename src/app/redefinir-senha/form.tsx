"use client";

import { useActionState } from "react";
import { updatePassword, type NewPasswordState } from "./actions";

export function NewPasswordForm() {
  const [state, action, pending] = useActionState<NewPasswordState, FormData>(updatePassword, {});

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div>
        <label htmlFor="password" className="label">Nova senha</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
      </div>
      <div>
        <label htmlFor="confirm" className="label">Repita a nova senha</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className="input" />
      </div>
      {state.error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn w-full">
        {pending ? "Salvando…" : "Salvar nova senha"}
      </button>
    </form>
  );
}
