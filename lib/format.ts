const copFormatter = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

/** 25000 -> "$25.000" (formato colombiano, igual en los tres idiomas). */
export const formatPrice = (value: number) => `$${copFormatter.format(value)}`;
