"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

const NAV_ITEMS = [
  { key: "services", href: "#services" },
  { key: "work", href: "#projects" },
  { key: "method", href: "#method" },
  { key: "faq", href: "#faq" },
  { key: "contact", href: "#contact" },
] as const;

export function Nav() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[padding] duration-300",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <div className="container-page">
          <nav
            className={cn(
              "flex items-center justify-between rounded-full px-4 py-2 transition-colors",
              scrolled
                ? "glass-strong shadow-lg shadow-black/20"
                : "bg-transparent"
            )}
          >
            <a
              href="#top"
              className="group flex items-center gap-2 pl-2"
              aria-label={t("home")}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 font-display text-xs font-semibold text-ink-100">
                TB
              </span>
              <span className="font-display text-sm font-semibold tracking-wide text-ink-100">
                {site.shortName}
              </span>
            </a>

            <ul className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="relative rounded-full px-3.5 py-1.5 text-sm text-ink-200 transition-colors hover:text-white"
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <a
                href="#contact"
                className="btn-primary hidden md:inline-flex"
              >
                {t("cta")}
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
                aria-label={t("openMenu")}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="container-page flex h-full flex-col">
              <div className="flex items-center justify-between py-4">
                <span className="font-display text-lg">{site.shortName}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full glass"
                  aria-label={t("closeMenu")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ul className="mt-10 flex flex-col gap-2">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-4 text-2xl font-display text-ink-100 hover:bg-white/5"
                    >
                      {t(item.key)}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto mb-8 flex flex-col gap-3">
                <LanguageSwitcher variant="mobile" />
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  {t("cta")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
