import Link from "next/link";
import { logout } from "@/app/login/actions";

export function AppHeader({ email }: { email: string }) {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/clientes" className="text-lg font-extrabold tracking-tight">
          Diagnóstico de Ativos Digitais
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-white/70 sm:inline">{email}</span>
          <form action={logout}>
            <button type="submit" className="rounded-lg border border-white/30 px-3 py-1.5 font-semibold hover:bg-white/10">
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
