import Image from "next/image";
import { headers } from "next/headers";
import QRCode from "qrcode";
import {
  DeleteTableButton,
  NewTableForm,
  PrintButton,
} from "@/components/admin/TableControls";
import { requireAdmin } from "@/lib/admin/auth";
import { setTableActive } from "./actions";

interface Table {
  id: string;
  number: number;
  label: string | null;
  code: string;
  active: boolean;
}

async function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function qrDataUrl(url: string) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1c432f", light: "#ffffff" },
  });
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default async function TablesPage() {
  const supabase = await requireAdmin();
  const [{ data }, base] = await Promise.all([
    supabase.from("restaurant_tables").select("id,number,label,code,active").order("number"),
    siteUrl(),
  ]);

  const tables = (data ?? []) as Table[];
  const nextNumber = (tables.at(-1)?.number ?? 0) + 1;
  // El enlace no lleva idioma: el proxy elige el del navegador del cliente.
  const cards = await Promise.all(
    tables.map(async (t) => {
      const url = `${base}/mesa/${t.code}`;
      return { ...t, url, qr: await qrDataUrl(url) };
    }),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h1 className="font-serif text-3xl font-semibold text-primary">Mesas</h1>
        {cards.length > 0 && <PrintButton />}
      </div>

      <div className="mt-6 rounded-lg bg-surface-container-lowest p-4 shadow-[0_2px_16px_rgba(28,67,47,0.06)] print:hidden">
        <NewTableForm nextNumber={nextNumber} />
      </div>

      {cards.length === 0 ? (
        <p className="mt-8 text-center text-on-surface-variant print:hidden">
          Aún no hay mesas. Crea la primera para generar su QR.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2">
          {cards.map((t) => {
            const name = t.label || `Mesa ${t.number}`;
            return (
              <li
                key={t.id}
                className={`break-inside-avoid rounded-lg bg-surface-container-lowest p-4 shadow-[0_2px_16px_rgba(28,67,47,0.06)] ${
                  t.active ? "" : "opacity-60 print:hidden"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-serif text-2xl font-semibold text-primary">{name}</h2>
                  {!t.active && (
                    <span className="rounded-full bg-error-container px-2 py-0.5 text-xs font-semibold text-error">
                      Inactiva
                    </span>
                  )}
                </div>
                <Image
                  src={t.qr}
                  alt={`Código QR de ${name}`}
                  width={200}
                  height={200}
                  unoptimized
                  className="mx-auto my-3 size-48"
                />
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-center text-xs text-on-surface-variant underline"
                >
                  {t.url}
                </a>
                <div className="mt-3 flex items-center justify-between print:hidden">
                  <form action={setTableActive.bind(null, t.id, !t.active)}>
                    <button
                      type="submit"
                      className="h-9 rounded-lg px-3 text-sm font-semibold text-primary-container hover:bg-surface-container"
                    >
                      {t.active ? "Desactivar" : "Activar"}
                    </button>
                  </form>
                  <DeleteTableButton id={t.id} name={name} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
