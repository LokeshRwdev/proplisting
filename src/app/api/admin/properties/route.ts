import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listAdminProperties } from "@/services/admin-properties";
import { propertyStatusSchema } from "@/validations/admin-property";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const admin = await requireAdmin(supabase);

    if (!admin.ok) {
      return NextResponse.json(
        { message: admin.message },
        { status: admin.status },
      );
    }

    const statusParam = request.nextUrl.searchParams.get("status");
    const queryParam = request.nextUrl.searchParams.get("q")?.trim();
    const status = statusParam
      ? propertyStatusSchema.safeParse(statusParam)
      : null;

    if (statusParam && !status?.success) {
      return NextResponse.json(
        { message: "Invalid listing status." },
        { status: 422 },
      );
    }

    const properties = await listAdminProperties(supabase, {
      status: status?.success ? status.data : undefined,
      query: queryParam || undefined,
    });

    return NextResponse.json({ properties });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load listings.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
