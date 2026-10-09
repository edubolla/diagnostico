import { NewClientForm } from "./new-client-form";

export default function NovoClientePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-brand">Novo cliente</h1>
        <p className="mt-1 text-sm text-muted">Só o nome é obrigatório. O resto pode ser preenchido depois.</p>
      </div>
      <NewClientForm />
    </div>
  );
}
