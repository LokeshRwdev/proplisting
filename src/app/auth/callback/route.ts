import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function getProfileName(userMetadata: Record<string, unknown>, email?: string) {
  const fullName = userMetadata.full_name ?? userMetadata.name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  return email?.split("@")[0] ?? "PropertyDekho user";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next") ?? "/";
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";

  if (!code) {
    return NextResponse.redirect(
      new URL("/sign-in?error=missing-code", requestUrl.origin),
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/sign-in?error=oauth-failed", requestUrl.origin),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const metadata = user.user_metadata as Record<string, unknown>;
    const avatarUrl =
      typeof metadata.avatar_url === "string" ? metadata.avatar_url : null;

    await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name: getProfileName(metadata, user.email),
        email: user.email ?? null,
        avatar_url: avatarUrl,
        last_seen_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
