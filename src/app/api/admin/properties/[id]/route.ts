import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  softDeleteAdminProperty,
  updateAdminProperty,
} from "@/services/admin-properties";
import { adminPropertyUpdateSchema } from "@/validations/admin-property";

type AdminPropertyRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: AdminPropertyRouteContext,
) {
  try {
    const supabase = await createSupabaseServerClient();
    const admin = await requireAdmin(supabase);

    if (!admin.ok) {
      return NextResponse.json(
        { message: admin.message },
        { status: admin.status },
      );
    }

    const rawBody: unknown = await request.json().catch(() => null);
    const parsed = adminPropertyUpdateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid listing update.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    const { id } = await context.params;
    const property = await updateAdminProperty(supabase, id, parsed.data);

    return NextResponse.json({ property });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update listing.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: AdminPropertyRouteContext,
) {
  try {
    const supabase = await createSupabaseServerClient();
    const admin = await requireAdmin(supabase);

    if (!admin.ok) {
      return NextResponse.json(
        { message: admin.message },
        { status: admin.status },
      );
    }

    const { id } = await context.params;
    await softDeleteAdminProperty(supabase, id);

    return NextResponse.json({ message: "Listing archived." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete listing.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
