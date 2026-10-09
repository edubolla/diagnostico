type ClientValues = Partial<
  Record<
    | "name"
    | "segment"
    | "city"
    | "website"
    | "instagram"
    | "google_business"
    | "whatsapp"
    | "bm_admin"
    | "objective"
    | "notes",
    string | null
  >
>;

const FIELDS: { name: keyof ClientValues; label: string; placeholder?: string; wide?: boolean }[] = [
  { name: "segment", label: "Segmento", placeholder: "Ex.: clínica de estética" },
  { name: "city", label: "Cidade" },
  { name: "website", label: "Site", placeholder: "https://" },
  { name: "instagram", label: "Instagram", placeholder: "@perfil" },
  { name: "google_business", label: "Google Meu Negócio", placeholder: "Link ou nome exato" },
  { name: "whatsapp", label: "WhatsApp comercial" },
  { name: "bm_admin", label: "Quem administra o BM / anúncios", wide: true },
  { name: "objective", label: "Objetivo comercial", placeholder: "Mais leads, autoridade, recorrência…", wide: true },
];

export function ClientFields({ values = {} }: { values?: ClientValues }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="name" className="label">Nome do cliente *</label>
        <input id="name" name="name" required defaultValue={values.name ?? ""} className="input" />
      </div>
      {FIELDS.map((f) => (
        <div key={f.name} className={f.wide ? "sm:col-span-2" : undefined}>
          <label htmlFor={f.name} className="label">{f.label}</label>
          <input id={f.name} name={f.name} defaultValue={values[f.name] ?? ""} placeholder={f.placeholder} className="input" />
        </div>
      ))}
      <div className="sm:col-span-2">
        <label htmlFor="notes" className="label">Observações gerais</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={values.notes ?? ""} className="input" />
      </div>
    </div>
  );
}
