import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 py-10">
      <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm text-ink-200">
            © {new Date().getFullYear()} {site.shortName}.
          </p>
          <p className="mt-1 text-xs text-ink-400">
            Crafted with Next.js, Tailwind and Framer Motion.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm">
          {site.nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-ink-300 hover:text-white transition"
            >
              {n.label}
            </a>
          ))}
          <Link
            href="/admin/login"
            className="text-ink-400 hover:text-white transition"
          >
            Admin
          </Link>
        </nav>
      </div>
    </footer>
  );
}
