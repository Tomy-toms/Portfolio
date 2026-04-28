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
          <p className="mt-1 text-xs text-ink-300">{t("crafted")}</p>
        </div>

        <nav aria-label={t("footerNavAria")} className="-mx-3 flex flex-wrap gap-x-1 gap-y-1 text-sm">
          {NAV_ITEMS.map((n) => (
            <a
              key={n.href}
              href={`/${locale}${n.href}`}
              className="px-3 py-2 text-ink-200 hover:text-white transition-colors"
            >
              {tNav(n.key)}
            </a>
          ))}
          <Link
            href={`/${locale}/legal`}
            className="px-3 py-2 text-ink-200 hover:text-white transition-colors"
          >
            {t("legal")}
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className="px-3 py-2 text-ink-200 hover:text-white transition-colors"
          >
            {t("privacy")}
          </Link>
          <Link
            href="/admin/login"
            className="px-3 py-2 text-ink-300 hover:text-white transition-colors"
          >
            {t("admin")}
          </Link>
        </nav>
      </div>

      <div className="container-page mt-8 border-t border-white/5 pt-6">
        <address className="not-italic text-xs text-ink-300 leading-relaxed">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <strong className="text-ink-200">{t("napLabel")}</strong>
            <span aria-hidden className="text-ink-500">·</span>
            <span>{t("napLocation")}</span>
            <span aria-hidden className="text-ink-500">·</span>
            <a
              href={`tel:${site.phone}`}
              aria-label={t("phoneAria")}
              className="py-1 hover:text-white transition-colors"
            >
              {site.phone.replace("+33", "0").replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")}
            </a>
            <span aria-hidden className="text-ink-500">·</span>
            <a
              href={`mailto:${site.email}`}
              aria-label={t("emailAria")}
              className="py-1 hover:text-white transition-colors"
            >
              {site.email}
            </a>
          </div>
        </address>
      </div>
    </footer>
  );
}
