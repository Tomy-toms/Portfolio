"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ variant = "default" }: { variant?: "default" | "mobile" }) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const isMobile = variant === "mobile";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full text-sm text-ink-200 transition hover:text-white disabled:opacity-60",
          isMobile
            ? "glass px-4 py-2"
            : "glass h-10 px-3"
        )}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span className="font-mono text-xs tracking-wider">
          {t(`${locale}Short` as "frShort" | "enShort")}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-2xl border border-white/10 bg-ink-900/95 p-1 shadow-xl shadow-black/30 backdrop-blur-xl"
          >
            {routing.locales.map((loc) => {
              const active = loc === locale;
              return (
                <li key={loc}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => switchTo(loc)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition",
                      active
                        ? "bg-white/5 text-white"
                        : "text-ink-200 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>{t(loc as "fr" | "en")}</span>
                    {active && <Check className="h-4 w-4 text-accent-cyan" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
