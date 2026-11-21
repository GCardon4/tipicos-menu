import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";

import type es from "@/dictionaries/es.json";

/** es.json es la fuente de verdad: en/pt deben tener exactamente las mismas claves. */
export type Dictionary = typeof es;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  pt: () => import("@/dictionaries/pt.json").then((m) => m.default),
};

/** Idioma de la ruta actual (segmento raíz /[lang]). Solo en Server Components. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!value || !hasLocale(value)) notFound();
  return value;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
