import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, matchLocale } from "@/lib/i18n/config";
import { isAdminClaims } from "@/lib/admin/auth-claims";
import { updateSession } from "@/utils/supabase/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Panel de administración: sesión de Supabase, sin i18n.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const { response, claims } = await updateSession(request);
    const isLogin = pathname === "/admin/login";
    const isAdmin = isAdminClaims(claims);

    const redirectTo = (path: string) => {
      const redirect = NextResponse.redirect(new URL(path, request.url));
      // Conserva las cookies de sesión refrescadas.
      response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
      return redirect;
    };

    if (!isAdmin && !isLogin) return redirectTo("/admin/login");
    if (isAdmin && isLogin) return redirectTo("/admin");
    return response;
  }

  // Carta pública: añade el idioma si falta (también para /mesa/<codigo>).
  const first = pathname.split("/")[1];
  if (hasLocale(first)) return;

  const locale = matchLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Ignora _next, api y cualquier archivo estático (con extensión).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
