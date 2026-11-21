import type { ServiceType } from "@/lib/service";

export interface PendingRequest {
  id: string;
  type: ServiceType;
  created_at: string;
  table: { number: number; label: string | null };
}

/** Columnas + relación para consultar solicitudes pendientes con su mesa. */
export const PENDING_SELECT = "id,type,created_at,restaurant_tables(number,label)";

type Row = {
  id: string;
  type: ServiceType;
  created_at: string;
  restaurant_tables:
    | { number: number; label: string | null }
    | { number: number; label: string | null }[]
    | null;
};

export function toPendingRequests(rows: unknown): PendingRequest[] {
  return ((rows ?? []) as Row[]).flatMap((row) => {
    const table = Array.isArray(row.restaurant_tables)
      ? row.restaurant_tables[0]
      : row.restaurant_tables;
    return table
      ? [{ id: row.id, type: row.type, created_at: row.created_at, table }]
      : [];
  });
}
