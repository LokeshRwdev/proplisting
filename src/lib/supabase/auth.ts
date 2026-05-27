import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export async function requireAdmin(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false as const,
      status: 401,
      message: "You must be signed in.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "ADMIN") {
    return {
      ok: false as const,
      status: 403,
      message: "Admin access is required.",
    };
  }

  return {
    ok: true as const,
    user,
    profile,
  };
}
