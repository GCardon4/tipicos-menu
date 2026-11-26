import Image from "next/image";
import type { ReactNode } from "react";
import { CategoryNav } from "@/components/CategoryNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MenuSection } from "@/components/MenuSection";
import { menu } from "@/data/menu";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";
import mainImg from "@/public/images/main.jpg";

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
        <section className="mb-8 grid items-center gap-5 md:mb-10 md:grid-cols-[3fr_2fr] md:gap-10">
          {/* Proporción natural de la foto: el logo está abajo a la izquierda y no se recorta. */}
          <Image
            src={mainImg}
            alt={dict.hero.imageAlt}
            placeholder="blur"
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1200px) 690px, (min-width: 768px) 58vw, 100vw"
            className="h-auto w-full rounded-xl shadow-[0_8px_24px_rgba(40,25,15,0.12)]"
          />
          <div>
            <p className="text-xs font-bold tracking-[0.04em] text-secondary uppercase">
              {dict.hero.eyebrow}
            </p>
            <h1 className="mt-1 font-serif text-4xl leading-11 font-semibold text-primary md:text-5xl md:leading-14">
              {dict.brand}
            </h1>
            <p className="mt-1 font-serif text-xl leading-7 text-primary-container">
              {dict.tagline}
            </p>
            <p className="mt-3 leading-6 text-on-surface-variant">{dict.hero.intro}</p>
          </div>
        </section>
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
