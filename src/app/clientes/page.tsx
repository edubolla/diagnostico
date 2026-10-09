import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import { requireUser } from "@/lib/auth";
import { ALL_ITEM_KEYS, CLIENT_STATUS, TOTAL_ITEMS, type ClientStatus } from "@/lib/checklist";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "America/Sao_Paulo" });

export default async function ClientesPage({ searchParams }: PageProps<"/clientes">) {
  const { supabase } = await requireUser();
  const { arquivados } = await searchParams;
  const showArchived = arquivados === "1";

  let query = supabase
    .from("clients")
    .select("id, name, segment, city, status, updated_at")
    .order("updated_at", { ascending: false });
  query = showArchived ? query.eq("status", "arquivado") : query.neq("status", "arquivado");

  const [{ data: clients, error }, { data: progress }] = await Promise.all([
    query,
    supabase.from("checklist_progress").select("client_id, item_key").eq("checked", true),
  ]);

  const validKeys = new Set(ALL_ITEM_KEYS);
  const checkedByClient = new Map<string, number>();
  for (const row of progress ?? []) {
    if (!validKeys.has(row.item_key)) continue;
    checkedByClient.set(row.client_id, (checkedByClient.get(row.client_id) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand">Clientes</h1>
          <p className="mt-1 text-sm text-muted">
            {showArchived ? "Diagnósticos arquivados." : "Diagnósticos em andamento e concluídos."}{" "}
            <Link href={showArchived ? "/clientes" : "/clientes?arquivados=1"} className="font-semibold text-brand hover:underline">
              {showArchived ? "Ver ativos" : "Ver arquivados"}
            </Link>
          </p>
        </div>
        <Link href="/clientes/novo" className="btn">+ Novo cliente</Link>
      </div>

      {error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          Não foi possível carregar os clientes. Confira se o SQL de criação das tabelas já foi executado no Supabase.
        </p>
      )}

      {!error && (clients ?? []).length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="font-semibold">Nenhum cliente {showArchived ? "arquivado" : "cadastrado"} ainda.</p>
          {!showArchived && <p className="mt-1 text-sm text-muted">Cadastre o primeiro para abrir o checklist do diagnóstico.</p>}
        </div>
      )}

      <ul className="space-y-3">
        {(clients ?? []).map((c) => {
          const done = checkedByClient.get(c.id) ?? 0;
          return (
            <li key={c.id}>
              <Link
                href={`/clientes/${c.id}`}
                className="block rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-bold">{c.name}</p>
                    <p className="text-sm text-muted">{[c.segment, c.city].filter(Boolean).join(" · ") || "Sem segmento/cidade"}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-brand">
                      {CLIENT_STATUS[c.status as ClientStatus] ?? c.status}
                    </span>
                    <p className="mt-1 text-xs text-muted">Atualizado em {dateFormat.format(new Date(c.updated_at))}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar value={done} total={TOTAL_ITEMS} />
                  <p className="mt-1 text-xs text-muted">{done} de {TOTAL_ITEMS} itens concluídos</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
