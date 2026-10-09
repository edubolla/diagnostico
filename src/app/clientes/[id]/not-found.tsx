import Link from "next/link";

export default function ClienteNaoEncontrado() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-10 text-center">
      <p className="font-semibold">Cliente não encontrado.</p>
      <Link href="/clientes" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">Voltar para a lista</Link>
    </div>
  );
}
