"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
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
  const [open, setOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Track scroll via classList on <body>, not React state — avoids re-rendering
  // the entire header on every scroll tick.
  useEffect(() => {
    const onScroll = () => {
      document.body.classList.toggle("is-scrolled", window.scrollY > 24);
    };
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

  // Move focus into the dialog on open, return it to the trigger on close.
  useEffect(() => {
    if (open) {
      closeBtnRef.current?.focus();
    } else {
      openBtnRef.current?.focus();
    }
  }, [open]);

  // Escape closes + Tab is trapped within the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-glow"
      >
        {t("skipToContent")}
      </a>

      <header className="nav-enter fixed inset-x-0 top-0 z-50">
        <div className="nav-shell container-page">
          <nav
            aria-label={t("primary")}
            className="nav-pill flex items-center justify-between rounded-full px-4 py-2"
          >
            <a
              href="#main"
              className="group flex items-center gap-2 pl-2"
              aria-label={t("home")}
            >
              <span
                aria-hidden
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 font-display text-xs font-semibold text-ink-100"
              >
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
              <a href="#contact" className="btn-primary hidden md:inline-flex">
                {t("cta")}
              </a>
              <button
                ref={openBtnRef}
                type="button"
                onClick={() => setOpen(true)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full glass"
                aria-label={t("openMenu")}
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          ref={dialogRef}
          className="menu-enter fixed inset-0 z-[60] bg-ink-950/95 md:hidden"
          style={{ backdropFilter: "blur(12px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="container-page flex h-full flex-col">
            <div className="flex items-center justify-between py-4">
              <span
                id="mobile-menu-title"
                className="font-display text-lg"
              >
                {t("mobileMenuTitle")}
              </span>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full glass"
                aria-label={t("closeMenu")}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="mt-10 flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <li
                  key={item.href}
                  className="menu-item"
                  style={{ ["--menu-delay" as string]: `${0.05 * i}s` }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-4 text-2xl font-display text-ink-100 hover:bg-white/5"
                  >
                    {t(item.key)}
                  </a>
                </li>
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
        </div>
      )}
    </>
  );
}
