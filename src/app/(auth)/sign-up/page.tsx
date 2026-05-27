import type { Metadata } from "next";
import Link from "next/link";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a PropertyDekho account with Google.",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-5 py-12">
      <section className="w-full max-w-md rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xl sm:p-8">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-500 transition hover:text-zinc-950"
        >
          PropertyDekho
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
          Create account
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Sign up to list and manage properties.
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-600">
          Google sign-up creates your PropertyDekho profile automatically, so you
          can submit listings for admin review.
        </p>
        <div className="mt-8">
          <GoogleAuthButton mode="sign-up" />
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-rose-600">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
