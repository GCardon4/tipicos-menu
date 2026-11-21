export const serviceTypes = ["waiter", "bill", "water", "napkins"] as const;
export type ServiceType = (typeof serviceTypes)[number];

export const isServiceType = (value: string): value is ServiceType =>
  (serviceTypes as readonly string[]).includes(value);

/** Etiquetas para el personal (el panel de administración está en español). */
export const serviceTypeLabelEs: Record<ServiceType, string> = {
  waiter: "Llamar al mesero",
  bill: "Pedir la cuenta",
  water: "Agua",
  napkins: "Servilletas",
};
