"use client";

export function SignOutButton() {
  return (
    <form action="/auth/sign-out" method="post">
      <button
        type="submit"
        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
      >
        Sign out
      </button>
    </form>
  );
}
