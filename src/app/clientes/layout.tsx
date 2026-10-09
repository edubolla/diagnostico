import { AppHeader } from "@/components/app-header";
import { requireUser } from "@/lib/auth";

export default async function ClientesLayout({ children }: LayoutProps<"/clientes">) {
  const { user } = await requireUser();

  return (
    <>
      <AppHeader email={user.email ?? ""} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </>
  );
}
