import { requireUser } from "@/lib/auth";
import { NewPasswordForm } from "./form";

export default async function RedefinirSenhaPage() {
  const { user } = await requireUser();

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{user.email}</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-brand">Criar nova senha</h1>
        </div>
        <NewPasswordForm />
      </div>
    </main>
  );
}
