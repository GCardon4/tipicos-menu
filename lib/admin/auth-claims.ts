/** El rol se guarda en app_metadata: el usuario no puede modificarlo desde el cliente. */
export const isAdminClaims = (
  claims: { app_metadata?: Record<string, unknown> } | null | undefined,
) => claims?.app_metadata?.role === "admin";
