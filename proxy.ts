import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet: any, headers: any) {
          cookiesToSet.forEach(
            ({ name, value }: { name: string; value: string }) => {
              request.cookies.set(name, value);
            }
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }: {
              name: string;
              value: string;
              options?: any;
            }) => {
              supabaseResponse.cookies.set(name, value, options);
            }
          );

          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, String(value));
          });
        },
      } as any,
    } as any
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};