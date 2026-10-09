"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ClientFields } from "@/components/client-fields";
import { createClientRecord, type FormState } from "../actions";

export function NewClientForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createClientRecord, {});

  return (
    <form action={action} className="space-y-6 rounded-2xl border border-border bg-surface p-6">
      <ClientFields />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="btn">
          {pending ? "Salvando…" : "Cadastrar e abrir checklist"}
        </button>
        <Link href="/clientes" className="btn-ghost">Cancelar</Link>
      </div>
    </form>
  );
}
