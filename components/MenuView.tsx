import Image from "next/image";
import type { ReactNode } from "react";
import { CategoryNav } from "@/components/CategoryNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MenuSection } from "@/components/MenuSection";
import { menu } from "@/data/menu";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

interface Props {
  locale: Locale;
  dict: Dictionary;
  /** Ruta tras el idioma, para conservarla al cambiarlo (ej. "/mesa/abc"). */
  path?: string;
  /** Etiqueta de la mesa (ej. "Mesa 4") cuando se llega desde un QR. */
  tableLabel?: string;
  /** Contenido fijo inferior (barra de servicio). */
  footer?: ReactNode;
}

export function MenuView({ locale, dict, path, tableLabel, footer }: Props) {
  const navItems = menu.map(({ id, name }) => ({ id, label: name[locale] }));

  return (
    <>
      <div className="sticky top-0 z-40 bg-surface/90 shadow-[0_1px_12px_rgba(2,45,26,0.06)] backdrop-blur-md">
        <header className="mx-auto flex h-16 max-w-300 items-center justify-between gap-3 px-4 md:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/logotipo.svg"
              alt=""
              width={40}
              height={35}
              priority
              className="h-9 w-auto shrink-0"
            />
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-serif text-xl leading-6 font-semibold text-primary-container">
                <span className="truncate">{dict.brand}</span>
                {tableLabel && (
                  <span className="shrink-0 rounded-full bg-tertiary-fixed px-2 py-0.5 font-sans text-xs font-bold text-secondary">
                    {tableLabel}
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-on-surface-variant">{dict.tagline}</p>
            </div>
          </div>
          <LanguageSwitcher current={locale} label={dict.languageLabel} path={path} />
        </header>
        <div className="mx-auto max-w-300">
          <CategoryNav items={navItems} label={dict.categoriesLabel} />
        </div>
      </div>

      <main
        className={`mx-auto max-w-300 px-4 pt-6 md:px-10 md:pt-10 ${footer ? "pb-32" : "pb-12"}`}
      >
        <h1 className="sr-only">
          {dict.brand} · {dict.tagline}
        </h1>
        {/* 1 columna en móvil, 2 en tablet y 3 en escritorio (masonry con CSS). */}
        <div className="md:columns-2 md:gap-6 lg:columns-3">
          {menu.map((category) => (
            <MenuSection key={category.id} category={category} locale={locale} />
          ))}
        </div>
      </main>

      {footer}
    </>
  );
}
