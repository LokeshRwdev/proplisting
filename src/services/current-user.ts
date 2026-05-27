import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentUserProfile = {
  id: string;
  email: string | null;
  fullName: string;
  avatarUrl: string | null;
  role: "USER" | "AGENT" | "ADMIN";
  isVerified: boolean;
};

function getFallbackName(email: string | null | undefined) {
  return email?.split("@")[0] ?? "user";
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, role, is_verified")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      return {
        id: user.id,
        email: user.email ?? null,
        fullName: getFallbackName(user.email),
        avatarUrl:
          typeof user.user_metadata.avatar_url === "string"
            ? user.user_metadata.avatar_url
            : null,
        role: "USER",
        isVerified: false,
      };
    }

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      role: profile.role,
      isVerified: profile.is_verified,
    };
  } catch {
    return null;
  }
}
