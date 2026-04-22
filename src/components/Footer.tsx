import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";

const NAV_ITEMS = [
  { key: "about", href: "#about" },
  { key: "work", href: "#projects" },
  { key: "skills", href: "#skills" },
  { key: "journey", href: "#experience" },
  { key: "contact", href: "#contact" },
] as const;

export async function Footer() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");

  return (
    <footer className="relative mt-20 border-t border-white/5 py-10">
      <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm text-ink-200">
            {t("rights", { year: new Date().getFullYear(), name: site.shortName })}
          </p>
          <p className="mt-1 text-xs text-ink-400">{t("crafted")}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm">
          {NAV_ITEMS.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-ink-300 hover:text-white transition"
            >
              {tNav(n.key)}
            </a>
          ))}
          <Link
            href="/admin/login"
            className="text-ink-400 hover:text-white transition"
          >
            {t("admin")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
