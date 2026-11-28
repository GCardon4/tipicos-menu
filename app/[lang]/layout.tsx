import type { Metadata } from "next";
import { jakarta, newsreader } from "@/lib/fonts";
import { locales } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Necesario para que las URLs absolutas de og:image funcionen al compartir.
const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");

const ogLocale = { es: "es_CO", en: "en_US", fr: "fr_FR" } as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const title = `${dict.brand} · ${dict.tagline}`;
  return {
    metadataBase,
    title,
    description: dict.metaDescription,
    openGraph: {
      type: "website",
      siteName: dict.brand,
      title,
      description: dict.metaDescription,
      locale: ogLocale[locale],
    },
    twitter: { card: "summary_large_image", title, description: dict.metaDescription },
    icons: { icon: { url: "/logotipo.svg", type: "image/svg+xml" } },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${newsreader.variable} ${jakarta.variable}`}>
      <body className="min-h-dvh bg-surface font-sans text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
