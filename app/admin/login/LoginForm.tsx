"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const input =
  "h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-base outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Correo
        <input name="email" type="email" autoComplete="email" required className={input} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={input}
        />
      </label>
      <p role="alert" className="min-h-5 text-sm text-error">
        {state?.error}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-lg bg-primary-container font-semibold text-surface hover:bg-primary disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
