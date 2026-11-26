import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { hasLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

// Imagen que se ve al compartir el enlace (WhatsApp, Telegram, Facebook…).
// WhatsApp no admite SVG, por eso se genera un PNG de 1200×630 en el servidor.
export const alt = "La Casa de los Típicos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(hasLocale(lang) ? lang : defaultLocale);

  const svg = await readFile(path.join(process.cwd(), "public", "logotipo.svg"));
  const logo = `data:image/svg+xml;base64,${svg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          background: "#fff9ee",
          color: "#1c432f",
          padding: 64,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={460} height={400} style={{ objectFit: "contain" }} />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>{dict.brand}</div>
          <div style={{ fontSize: 40, marginTop: 24, lineHeight: 1.25 }}>{dict.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
