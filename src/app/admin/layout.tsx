import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { getSessionFromCookies } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionFromCookies();

  return (
    <div className="min-h-[100dvh]">
      {session && (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="font-display text-lg text-gradient-accent"
              >
                Admin
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link
                  href="/admin"
                  className="text-ink-200 hover:text-white transition"
                >
                  Projects
                </Link>
                <Link
                  href="/admin/messages"
                  className="text-ink-200 hover:text-white transition"
                >
                  Messages
                </Link>
                <Link
                  href="/"
                  className="text-ink-400 hover:text-white transition"
                >
                  ← Site
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden sm:inline text-ink-400">
                {session.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
