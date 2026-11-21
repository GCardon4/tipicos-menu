import type { Metadata } from "next";
import { jakarta, newsreader } from "@/lib/fonts";
import { locales } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(await getLocale());
  return {
    title: `${dict.brand} · ${dict.tagline}`,
    description: dict.metaDescription,
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
