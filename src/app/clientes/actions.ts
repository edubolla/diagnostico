"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { ALL_ITEM_KEYS, CLIENT_STATUS, SECTION_KEYS, SECTION_STATUS } from "@/lib/checklist";

export type FormState = { error?: string; message?: string };

const CLIENT_FIELDS = [
  "name",
  "segment",
  "city",
  "website",
  "instagram",
  "google_business",
  "whatsapp",
  "bm_admin",
  "objective",
  "notes",
] as const;

function readClientFields(formData: FormData) {
  const data: Record<string, string | null> = {};
  for (const field of CLIENT_FIELDS) {
    const value = String(formData.get(field) ?? "").trim();
    data[field] = value || null;
  }
  return data;
}

export async function createClientRecord(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireUser();
  const fields = readClientFields(formData);
  if (!fields.name) return { error: "Informe o nome do cliente." };

  const { data, error } = await supabase.from("clients").insert(fields).select("id").single();
  if (error) return { error: "Não foi possível cadastrar o cliente." };

  revalidatePath("/clientes");
  redirect(`/clientes/${data.id}`);
}

export async function updateClientRecord(
  clientId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase } = await requireUser();
  const fields = readClientFields(formData);
  if (!fields.name) return { error: "Informe o nome do cliente." };

  const status = String(formData.get("status") ?? "");
  const update = {
    ...fields,
    ...(status in CLIENT_STATUS ? { status } : {}),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("clients").update(update).eq("id", clientId);
  if (error) return { error: "Não foi possível salvar os dados." };

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${clientId}`);
  return { message: "Dados salvos." };
}

export async function toggleChecklistItem(clientId: string, itemKey: string, checked: boolean) {
  const { supabase, user } = await requireUser();
  if (!ALL_ITEM_KEYS.includes(itemKey)) return { error: "Item inválido." };

  const now = new Date().toISOString();
  const { error } = await supabase.from("checklist_progress").upsert({
    client_id: clientId,
    item_key: itemKey,
    checked,
    updated_by: user.id,
    updated_at: now,
  });
  if (error) return { error: "Não foi possível salvar." };

  await supabase.from("clients").update({ updated_at: now }).eq("id", clientId);
  revalidatePath("/clientes");
  return {};
}

export async function saveSectionReview(
  clientId: string,
  sectionKey: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase, user } = await requireUser();
  if (!SECTION_KEYS.includes(sectionKey)) return { error: "Etapa inválida." };

  const rawScore = String(formData.get("score") ?? "");
  const score = rawScore === "" ? null : Number(rawScore);
  if (score !== null && (!Number.isInteger(score) || score < 0 || score > 10)) {
    return { error: "A nota deve ser de 0 a 10." };
  }
  const status = String(formData.get("status") ?? "pendente");
  if (!(status in SECTION_STATUS)) return { error: "Status inválido." };
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const now = new Date().toISOString();
  const { error } = await supabase.from("section_reviews").upsert({
    client_id: clientId,
    section_key: sectionKey,
    score,
    status,
    notes,
    updated_by: user.id,
    updated_at: now,
  });
  if (error) return { error: "Não foi possível salvar." };

  await supabase.from("clients").update({ updated_at: now }).eq("id", clientId);
  revalidatePath(`/clientes/${clientId}`);
  revalidatePath("/clientes");
  return { message: "Salvo." };
}
