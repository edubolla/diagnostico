"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { login, signup, type AuthState } from "./actions";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState<AuthState, FormData>(login, {
    error: initialError,
  });
  const [signupState, signupAction, signupPending] = useActionState<AuthState, FormData>(signup, {});

  const isLogin = mode === "login";
  const state = isLogin ? loginState : signupState;
  const pending = isLogin ? loginPending : signupPending;

  return (
    <form action={isLogin ? loginAction : signupAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input"
        />
      </div>
      <div>
        <label htmlFor="password" className="label">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={isLogin ? undefined : 8}
          autoComplete={isLogin ? "current-password" : "new-password"}
          className="input"
        />
      </div>

      {state.error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      {state.message && <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn w-full">
        {pending ? "Aguarde…" : isLogin ? "Entrar" : "Criar conta"}
      </button>

      {isLogin && (
        <p className="text-center text-sm">
          <Link href="/esqueci-senha" className="font-semibold text-brand underline-offset-2 hover:underline">
            Esqueci minha senha
          </Link>
        </p>
      )}

      <p className="text-center text-sm text-muted">
        {isLogin ? "Primeiro acesso?" : "Já tem conta?"}{" "}
        <button
          type="button"
          onClick={() => setMode(isLogin ? "signup" : "login")}
          className="font-semibold text-brand underline-offset-2 hover:underline"
        >
          {isLogin ? "Criar conta" : "Entrar"}
        </button>
      </p>
    </form>
  );
}
