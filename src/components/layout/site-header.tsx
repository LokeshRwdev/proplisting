import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { getCurrentUserProfile } from "@/services/current-user";

export async function SiteHeader() {
  const profile = await getCurrentUserProfile();
  const firstName = profile?.fullName.split(" ")[0] ?? "";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/30 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-950">
          PropertyDekho
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-700 md:flex">
          <Link href="/#listings" className="hover:text-zinc-950">
            Buy
          </Link>
          <Link href="/#listings" className="hover:text-zinc-950">
            Rent
          </Link>
          <Link href="/#commercial" className="hover:text-zinc-950">
            Commercial
          </Link>
          <Link href="/#categories" className="hover:text-zinc-950">
            Categories
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {profile ? (
            <>
              <div className="hidden items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 sm:flex">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className="size-6 rounded-full object-cover"
                  />
                ) : null}
                <span>Hi {firstName}</span>
              </div>
              {profile.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 sm:inline-flex"
                >
                  Admin
                </Link>
              ) : null}
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 sm:inline-flex"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/properties/new"
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
          >
            List property
          </Link>
        </div>
      </div>
    </header>
  );
}
