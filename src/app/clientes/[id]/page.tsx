import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { Checklist, type Review } from "./checklist";
import { ClientInfo } from "./client-info";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ClientePage({ params }: PageProps<"/clientes/[id]">) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const { supabase } = await requireUser();
  const [{ data: client }, { data: progress }, { data: reviewRows }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).maybeSingle(),
    supabase.from("checklist_progress").select("item_key").eq("client_id", id).eq("checked", true),
    supabase.from("section_reviews").select("section_key, score, status, notes").eq("client_id", id),
  ]);

  if (!client) notFound();

  const reviews: Record<string, Review> = {};
  for (const r of reviewRows ?? []) {
    reviews[r.section_key] = { score: r.score, status: r.status, notes: r.notes };
  }

  return (
    <div className="space-y-6">
      <Link href="/clientes" className="text-sm font-semibold text-muted hover:text-brand">← Todos os clientes</Link>
      <ClientInfo key={client.updated_at} client={client} />
      <Checklist
        clientId={client.id}
        initialChecked={(progress ?? []).map((p) => p.item_key)}
        reviews={reviews}
      />
    </div>
  );
}
