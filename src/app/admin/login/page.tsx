"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { errorMessage } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("from") ?? "";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/admin";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Login failed");
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-gradient-accent">Admin</h1>
          <p className="mt-2 text-sm text-ink-300">
            Sign in to manage projects and messages.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="glass-strong rounded-3xl p-6 sm:p-8 space-y-4"
        >
          <label className="block">
            <span className="label-muted">Email</span>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input pl-10"
                placeholder="admin@example.com"
              />
            </div>
          </label>
          <label className="block">
            <span className="label-muted">Password</span>
            <div className="relative mt-2">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                minLength={8}
                className="input pl-10"
                placeholder="••••••••"
              />
            </div>
          </label>
          {error && (
            <p className="rounded-xl bg-accent-pink/10 border border-accent-pink/30 px-4 py-3 text-sm text-accent-pink">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
