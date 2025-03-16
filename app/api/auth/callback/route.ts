import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_code = searchParams.get("error_code");
  const next = searchParams.get("next") ?? "/";
  if (error) {
    return NextResponse.redirect(
      `${origin}/error?code=${error_code}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(
          `https://${forwardedHost}${next}`
        );
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      console.error(error);
    }
  }

  return NextResponse.redirect(`${origin}/error`);
}
