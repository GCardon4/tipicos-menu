import { createClient } from "@supabase/supabase-js";

/**
 * Cliente sin sesión para la carta pública. Solo puede llamar a las funciones
 * get_table_public / request_service (RLS impide leer o escribir tablas).
 */
export const createAnonClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
