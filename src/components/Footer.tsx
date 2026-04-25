import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { site } from "@/lib/site";

const NAV_ITEMS = [
  { key: "services", href: "/#services" },
  { key: "work", href: "/#projects" },
  { key: "method", href: "/#method" },
  { key: "faq", href: "/#faq" },
  { key: "contact", href: "/#contact" },
] as const;

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");

  return (
    <footer className="relative mt-20 border-t border-white/5 py-10">
      <div className="container-page flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-start">
        <div>
          <p className="font-display text-sm text-ink-200">
            {t("rights", { year: new Date().getFullYear(), name: site.shortName })}
          </p>
          <p className="mt-1 text-xs text-ink-400">{t("crafted")}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {NAV_ITEMS.map((n) => (
            <a
              key={n.href}
              href={`/${locale}${n.href}`}
              className="text-ink-300 hover:text-white transition"
            >
              {tNav(n.key)}
            </a>
          ))}
          <Link
            href={`/${locale}/legal`}
            className="text-ink-300 hover:text-white transition"
          >
            {t("legal")}
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className="text-ink-300 hover:text-white transition"
          >
            {t("privacy")}
          </Link>
          <Link
            href="/admin/login"
            className="text-ink-400 hover:text-white transition"
          >
            {t("admin")}
          </Link>
        </nav>
      </div>

      <div className="container-page mt-8 border-t border-white/5 pt-6">
        <address className="not-italic text-xs text-ink-500 leading-relaxed">
          <strong className="text-ink-400">{t("napLabel")}</strong>
          {" · "}
          <span>{t("napLocation")}</span>
          {" · "}
          <a
            href={`tel:${site.phone}`}
            className="hover:text-ink-300 transition"
          >
            {site.phone.replace("+33", "0").replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")}
          </a>
          {" · "}
          <a
            href={`mailto:${site.email}`}
            className="hover:text-ink-300 transition"
          >
            {site.email}
          </a>
        </address>
      </div>
    </footer>
  );
}
