import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdminClaims } from "./auth-claims";

/**
 * Guarda de acceso: el proxy es solo una primera barrera optimista,
 * esta verificación es la definitiva (y RLS en la base de datos la tercera).
 */
export async function requireAdmin() {
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getClaims();
  if (!isAdminClaims(data?.claims)) redirect("/admin/login");
  return supabase;
}
