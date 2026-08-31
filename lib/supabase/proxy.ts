import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublicConfig } from "./env";

export async function updateSession(request: NextRequest) {
  const config = supabasePublicConfig();
  if (!config) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const { data } = await supabase.auth.getClaims();
  const isPublicAdminPath = request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/setup" || request.nextUrl.pathname === "/api/admin/bootstrap";
  if (!data?.claims?.sub && !isPublicAdminPath) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/admin/login";
    destination.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    const redirect = NextResponse.redirect(destination);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }
  if (data?.claims?.sub && (request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/setup")) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/admin";
    destination.search = "";
    const redirect = NextResponse.redirect(destination);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }
  return response;
}
