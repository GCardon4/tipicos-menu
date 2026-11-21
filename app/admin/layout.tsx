import type { Metadata } from "next";
import { jakarta, newsreader } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Panel · Típicos",
  robots: { index: false, follow: false },
};

// Layout raíz propio del panel (español, sin i18n). No lee datos de la petición.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="es" className={`${newsreader.variable} ${jakarta.variable}`}>
      <body className="min-h-dvh bg-surface font-sans text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
