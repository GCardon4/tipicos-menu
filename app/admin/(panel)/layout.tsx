import Link from "next/link";
import { logout } from "../login/actions";

// Estático: la sesión se valida en cada página (dentro de Suspense) y en el proxy.
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  const linkClass =
    "flex h-10 items-center rounded-full px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container";

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/90 shadow-[0_1px_12px_rgba(2,45,26,0.06)] backdrop-blur-md print:hidden">
        <div className="mx-auto flex h-16 max-w-300 items-center justify-between gap-3 px-4 md:px-10">
          <nav aria-label="Panel" className="flex gap-1">
            <Link href="/admin" className={linkClass}>
              Solicitudes
            </Link>
            <Link href="/admin/mesas" className={linkClass}>
              Mesas
            </Link>
          </nav>
          <form action={logout}>
            <button type="submit" className={linkClass}>
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-300 px-4 py-8 md:px-10">{children}</main>
    </>
  );
}
