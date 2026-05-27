import type { Metadata } from "next";
import Link from "next/link";

import { ListPropertyForm } from "@/components/forms/list-property-form";

export const metadata: Metadata = {
  title: "List Property",
  description:
    "Create a premium residential or commercial property listing on BhilaiProps.",
};

export default function NewPropertyPage() {
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
            {/* <p className="mt-5 text-base leading-7 text-zinc-600">
              Add pricing, specifications, location, amenities, and media. The
              backend validates the payload and stores the listing as pending
              for moderation.
            </p> */}
            {/* <div className="mt-8 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-zinc-950">Required backend</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                <li>Supabase Auth session cookie</li>
                <li>Profile row for the signed-in user</li>
                <li>RLS policies from `supabase/schema.sql`</li>
                <li>Supabase env variables in `.env.local`</li>
              </ul>
            </div> */}
          </aside>
          <ListPropertyForm />
        </div>
      </div>
    </main>
  );
}
