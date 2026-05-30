import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ListPropertyForm } from "@/components/forms/list-property-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "List Property",
  description:
    "Create a premium residential or commercial property listing on PropertyDekho.",
};

export default async function NewPropertyPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect unauthenticated users to sign-in with a next param
    redirect(`/sign-in?next=${encodeURIComponent("/properties/new")}`);
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-950"
        >
          Back to home
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <aside className="lg:sticky lg:top-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
              Seller workspace
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              List a property with complete buyer-ready details.
            </h1>
          </aside>
          <ListPropertyForm />
        </div>
      </div>
    </main>
  );
}
