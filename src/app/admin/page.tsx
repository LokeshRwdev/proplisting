import type { Metadata } from "next";
import Link from "next/link";

import { AdminListingsPanel } from "@/components/admin/admin-listings-panel";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Moderate and manage PropertyDekho property listings.",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 rounded-[32px] bg-zinc-950 p-6 text-white shadow-xl sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-200">
              Admin panel
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Listing operations
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
              Manage property submissions, approvals, rejections, edits,
              featured placement, and archives from one workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/properties/new"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-rose-50"
            >
              Create listing
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View site
            </Link>
          </div>
        </header>

        <AdminListingsPanel />
      </div>
    </main>
  );
}
