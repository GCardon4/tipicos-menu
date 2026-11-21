"use server";

import { isServiceType } from "@/lib/service";
import { createAnonClient } from "@/utils/supabase/anon";

export type RequestResult = "created" | "already_pending" | "invalid_table" | "error";

/** Registra una solicitud de servicio de una mesa (validada en la base de datos). */
export async function requestService(code: string, type: string): Promise<RequestResult> {
  if (typeof code !== "string" || code.length > 64 || !isServiceType(type)) return "error";

  const { data, error } = await createAnonClient().rpc("request_service", {
    p_code: code,
    p_type: type,
  });

  if (error) return "error";
  return data === "created" || data === "already_pending" || data === "invalid_table"
    ? data
    : "error";
}
