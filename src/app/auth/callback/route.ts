import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_NEXT_COOKIE } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_NEXT = ["/clientes", "/redefinir-senha"];

// Destino dos links enviados por e-mail pelo Supabase (confirmação de conta e recuperação de senha).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const supabase = await createClient();

  let error: unknown = null;
  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  } else {
    error = true;
  }

  const cookieStore = await cookies();
  const savedNext = cookieStore.get(AUTH_NEXT_COOKIE)?.value;
  cookieStore.delete(AUTH_NEXT_COOKIE);

  if (error) {
    return NextResponse.redirect(`${origin}/login?erro=confirmacao`);
  }

  const next =
    type === "recovery" ? "/redefinir-senha" : ALLOWED_NEXT.includes(savedNext ?? "") ? savedNext! : "/clientes";
  return NextResponse.redirect(`${origin}${next}`);
}
