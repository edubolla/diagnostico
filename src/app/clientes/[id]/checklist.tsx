"use client";

import { useActionState, useState, useTransition } from "react";
import { ProgressBar } from "@/components/progress-bar";
import { CHECKLIST, SECTION_STATUS, TOTAL_ITEMS, type ChecklistSection } from "@/lib/checklist";
import { saveSectionReview, toggleChecklistItem, type FormState } from "../actions";

export type Review = { score: number | null; status: string; notes: string | null };

export function Checklist({
  clientId,
  initialChecked,
  reviews,
}: {
  clientId: string;
  initialChecked: string[];
  reviews: Record<string, Review>;
}) {
  const [checked, setChecked] = useState(() => new Set(initialChecked));
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggle(key: string) {
    const next = !checked.has(key);
    const update = (on: boolean) =>
      setChecked((prev) => {
        const copy = new Set(prev);
        if (on) copy.add(key);
        else copy.delete(key);
        return copy;
      });

    update(next);
    setError(null);
    startTransition(async () => {
      const result = await toggleChecklistItem(clientId, key, next);
      if (result.error) {
        update(!next);
        setError(result.error);
      }
    });
  }

  const totalDone = CHECKLIST.reduce(
    (sum, s) => sum + s.groups.reduce((n, g) => n + g.items.filter((i) => checked.has(i.key)).length, 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">Progresso do diagnóstico</span>
          <span className="text-muted">{totalDone} de {TOTAL_ITEMS} itens</span>
        </div>
        <div className="mt-2">
          <ProgressBar value={totalDone} total={TOTAL_ITEMS} />
        </div>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </div>

      {CHECKLIST.map((section) => (
        <Section
          key={section.key}
          clientId={clientId}
          section={section}
          checked={checked}
          onToggle={toggle}
          review={reviews[section.key]}
        />
      ))}
    </div>
  );
}

function Section({
  clientId,
  section,
  checked,
  onToggle,
  review,
}: {
  clientId: string;
  section: ChecklistSection;
  checked: Set<string>;
  onToggle: (key: string) => void;
  review?: Review;
}) {
  const items = section.groups.flatMap((g) => g.items);
  const done = items.filter((i) => checked.has(i.key)).length;

  return (
    <details open className="group rounded-2xl border border-border bg-surface">
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 p-5">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-brand">{section.title}</h2>
          {section.description && <p className="text-sm text-muted">{section.description}</p>}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {section.scored && review?.score != null && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">Nota {review.score}/10</span>
          )}
          <span className={`font-semibold tabular-nums ${done === items.length ? "text-accent" : "text-muted"}`}>
            {done}/{items.length}
          </span>
          <span className="text-muted transition group-open:rotate-180">▾</span>
        </div>
      </summary>

      <div className="space-y-5 border-t border-border p-5">
        {section.groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{group.title}</h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isChecked = checked.has(item.key);
                return (
                  <li key={item.key}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-background">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggle(item.key)}
                        className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
                      />
                      <span className={`text-sm ${isChecked ? "text-muted line-through" : ""}`}>{item.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <ReviewForm clientId={clientId} section={section} review={review} />
      </div>
    </details>
  );
}

function ReviewForm({ clientId, section, review }: { clientId: string; section: ChecklistSection; review?: Review }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveSectionReview.bind(null, clientId, section.key),
    {},
  );

  return (
    <form action={action} className="space-y-3 rounded-xl bg-background p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {section.scored && (
          <div>
            <label className="label" htmlFor={`score-${section.key}`}>Nota (0 a 10)</label>
            <select id={`score-${section.key}`} name="score" defaultValue={review?.score ?? ""} className="input">
              <option value="">Sem nota</option>
              {Array.from({ length: 11 }, (_, n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="label" htmlFor={`status-${section.key}`}>Status</label>
          <select id={`status-${section.key}`} name="status" defaultValue={review?.status ?? "pendente"} className="input">
            {Object.entries(SECTION_STATUS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor={`notes-${section.key}`}>Observações e achados</label>
        <textarea
          id={`notes-${section.key}`}
          name="notes"
          rows={4}
          defaultValue={review?.notes ?? ""}
          placeholder="Registre números (posts em 30 dias, nota do Google, PageSpeed…), o que está bom, o que está ruim e o impacto no negócio."
          className="input"
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn">{pending ? "Salvando…" : "Salvar etapa"}</button>
        {state.error && <span className="text-sm text-danger">{state.error}</span>}
        {state.message && !pending && <span className="text-sm text-accent">{state.message}</span>}
      </div>
    </form>
  );
}
