"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";

export type TableFormState = { error?: string; ok?: boolean } | undefined;

export async function createTable(
  _prev: TableFormState,
  formData: FormData,
): Promise<TableFormState> {
  const supabase = await requireAdmin();
  const number = Number(formData.get("number"));
  const label = String(formData.get("label") ?? "").trim().slice(0, 40);

  if (!Number.isInteger(number) || number < 1 || number > 9999) {
    return { error: "El número de mesa debe ser un entero entre 1 y 9999." };
  }

  const { error } = await supabase
    .from("restaurant_tables")
    .insert({ number, label: label || null });

  if (error) {
    return {
      error: error.code === "23505" ? `La mesa ${number} ya existe.` : "No se pudo crear la mesa.",
    };
  }

  revalidatePath("/admin/mesas");
  return { ok: true };
}

export async function setTableActive(id: string, active: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("restaurant_tables").update({ active }).eq("id", id);
  revalidatePath("/admin/mesas");
}

export async function deleteTable(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("restaurant_tables").delete().eq("id", id);
  revalidatePath("/admin/mesas");
}
