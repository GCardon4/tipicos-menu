"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminClaims } from "@/lib/admin/auth-claims";
import { createClient } from "@/utils/supabase/server";

export type LoginState = { error?: string } | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Escribe tu correo y contraseña." };

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Correo o contraseña incorrectos." };

  const { data } = await supabase.auth.getClaims();
  if (!isAdminClaims(data?.claims)) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no tiene permisos de administrador." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/admin/login");
}
