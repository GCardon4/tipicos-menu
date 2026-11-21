import Link from "next/link";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";

/**
 * Server Component: enlaces simples, sin JavaScript en el cliente.
 * `path` conserva la ruta al cambiar de idioma (ej. "/mesa/abc123").
 */
export function LanguageSwitcher({
  current,
  label,
  path = "",
}: {
  current: Locale;
  label: string;
  path?: string;
}) {
  return (
    <nav aria-label={label} className="flex rounded-full bg-surface-container p-0.5">
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={`/${locale}${path}`}
            lang={locale}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            title={localeLabels[locale].name}
            className={`flex h-9 min-w-11 items-center justify-center rounded-full px-3 text-xs font-bold tracking-wide transition-colors ${
              active
                ? "bg-primary-container text-surface"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {localeLabels[locale].short}
          </Link>
        );
      })}
    </nav>
  );
}
