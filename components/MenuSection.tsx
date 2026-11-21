import { formatPrice } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import type { MenuCategory } from "@/data/menu";

/** Server Component: cero JavaScript en el cliente para la lista de platos. */
export function MenuSection({
  category,
  locale,
}: {
  category: MenuCategory;
  locale: Locale;
}) {
  const headingId = `${category.id}-title`;

  return (
    <section
      id={category.id}
      aria-labelledby={headingId}
      className="mb-6 scroll-mt-32 break-inside-avoid rounded-lg bg-surface-container-lowest p-5 shadow-[0_2px_16px_rgba(28,67,47,0.06)]"
    >
      <h2
        id={headingId}
        className="font-serif text-[1.625rem] leading-[2.125rem] font-semibold text-primary md:text-[2rem] md:leading-10"
      >
        {category.name[locale]}
      </h2>

      <ul className="mt-3 divide-y divide-primary-container/10">
        {category.items.map((item) => (
          <li key={item.id} className="py-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-base leading-snug font-semibold text-on-surface">
                {item.name[locale]}
              </h3>
              <span
                aria-hidden
                className="min-w-4 flex-1 translate-y-[-0.2em] border-b border-dotted border-outline-variant"
              />
              <span className="font-bold whitespace-nowrap text-primary tabular-nums">
                {formatPrice(item.price)}
              </span>
            </div>
            {item.details && (
              <p className="mt-1 text-sm leading-5 text-on-surface-variant">
                {item.details[locale]}
              </p>
            )}
          </li>
        ))}
      </ul>

      {category.note && (
        <p className="mt-3 rounded-md bg-tertiary-fixed/30 px-3 py-2 text-xs leading-4 font-medium text-secondary">
          {category.note[locale]}
        </p>
      )}
    </section>
  );
}
