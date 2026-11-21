"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  items: { id: string; label: string }[];
  label: string;
}

/**
 * Único Client Component de la carta: resalta la categoría visible.
 * Los enlaces son anclas normales, así que funciona (sin resaltado) aunque falle el JS.
 */
export function CategoryNav({ items, label }: Props) {
  const [active, setActive] = useState(items[0]?.id);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Franja estrecha bajo la barra sticky: una sola sección activa a la vez.
      { rootMargin: "-140px 0px -60% 0px" },
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  // Mantiene la pastilla activa visible en el scroll horizontal (sin mover la página).
  useEffect(() => {
    const nav = navRef.current;
    const pill = nav?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!nav || !pill) return;
    nav.scrollTo({
      left: pill.offsetLeft - (nav.clientWidth - pill.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className="no-scrollbar relative flex gap-2 overflow-x-auto px-4 py-2 md:justify-center md:px-10"
    >
      {items.map(({ id, label: text }) => {
        const isActive = id === active;
        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={isActive ? "true" : undefined}
            className={`flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? "bg-primary-container text-surface"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {text}
          </a>
        );
      })}
    </nav>
  );
}
