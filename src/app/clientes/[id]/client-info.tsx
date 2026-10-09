"use client";

import { useActionState, useState } from "react";
import { ClientFields } from "@/components/client-fields";
import { CLIENT_STATUS } from "@/lib/checklist";
import { updateClientRecord, type FormState } from "../actions";

type Client = {
  id: string;
  name: string;
  status: string;
  segment: string | null;
  city: string | null;
  website: string | null;
  instagram: string | null;
  google_business: string | null;
  whatsapp: string | null;
  bm_admin: string | null;
  objective: string | null;
  notes: string | null;
};

const LINKS: { key: keyof Client; label: string; href?: (v: string) => string }[] = [
  { key: "website", label: "Site", href: (v) => (v.startsWith("http") ? v : `https://${v}`) },
  { key: "instagram", label: "Instagram", href: (v) => `https://instagram.com/${v.replace(/^@/, "")}` },
  { key: "google_business", label: "Google Meu Negócio", href: (v) => (v.startsWith("http") ? v : `https://www.google.com/search?q=${encodeURIComponent(v)}`) },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "bm_admin", label: "Administra o BM" },
  { key: "objective", label: "Objetivo" },
];

export function ClientInfo({ client }: { client: Client }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const result = await updateClientRecord(client.id, prev, formData);
      if (!result.error) setEditing(false);
      return result;
    },
    {},
  );

  if (editing) {
    return (
      <form action={action} className="space-y-6 rounded-2xl border border-border bg-surface p-6">
        <ClientFields values={client} />
        <div className="max-w-xs">
          <label htmlFor="status" className="label">Status do diagnóstico</label>
          <select id="status" name="status" defaultValue={client.status} className="input">
            {Object.entries(CLIENT_STATUS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        {state.error && <p className="text-sm text-danger">{state.error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={pending} className="btn">{pending ? "Salvando…" : "Salvar"}</button>
          <button type="button" onClick={() => setEditing(false)} className="btn-ghost">Cancelar</button>
        </div>
      </form>
    );
  }

  const filled = LINKS.filter((l) => client[l.key]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand">{client.name}</h1>
          <p className="text-sm text-muted">
            {[client.segment, client.city].filter(Boolean).join(" · ") || "Sem segmento/cidade"} ·{" "}
            {CLIENT_STATUS[client.status as keyof typeof CLIENT_STATUS] ?? client.status}
          </p>
        </div>
        <button type="button" onClick={() => setEditing(true)} className="btn-ghost">Editar dados</button>
      </div>
      {filled.length > 0 && (
        <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {filled.map((l) => {
            const value = client[l.key]!;
            return (
              <div key={l.key}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{l.label}</dt>
                <dd className="break-words">
                  {l.href ? (
                    <a href={l.href(value)} target="_blank" rel="noopener noreferrer" className="text-brand underline-offset-2 hover:underline">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
      {client.notes && <p className="mt-5 whitespace-pre-wrap border-t border-border pt-4 text-sm">{client.notes}</p>}
      {state.message && <p className="mt-3 text-sm text-accent">{state.message}</p>}
    </div>
  );
}
