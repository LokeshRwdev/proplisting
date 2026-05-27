"use client";

import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type GoogleAuthButtonProps = {
  mode: "sign-in" | "sign-up";
};

export function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function continueWithGoogle() {
    setIsLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const origin = window.location.origin;
      const nextPath = mode === "sign-up" ? "/properties/new" : "/";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setIsLoading(false);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to start Google authentication.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3.5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:border-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-100"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-white text-sm font-bold text-rose-600">
          G
        </span>
        {isLoading
          ? "Redirecting..."
          : mode === "sign-up"
            ? "Sign up with Google"
            : "Sign in with Google"}
      </button>
      {message ? (
        <p className="mt-3 text-sm font-medium text-red-600">{message}</p>
      ) : null}
    </div>
  );
}
