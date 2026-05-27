import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to PropertyDekho with Google.",
};

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to manage listings and enquiries."
      copy="Use Google authentication for a secure account session."
      mode="sign-in"
      footer={
        <>
          New to PropertyDekho?{" "}
          <Link href="/sign-up" className="font-semibold text-rose-600">
            Create an account
          </Link>
        </>
      }
    />
  );
}

function AuthShell({
  eyebrow,
  title,
  copy,
  mode,
  footer,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  mode: "sign-in" | "sign-up";
  footer: ReactNode;
}) {
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
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-600">{copy}</p>
        <div className="mt-8">
          <GoogleAuthButton mode={mode} />
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">{footer}</p>
      </section>
    </main>
  );
}
