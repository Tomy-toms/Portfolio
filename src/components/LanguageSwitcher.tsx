"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Move focus into the listbox on open; on close, restore focus to the trigger.
  useEffect(() => {
    if (open) {
      const first = listRef.current?.querySelector<HTMLButtonElement>(
        '[role="option"][aria-selected="true"]'
      ) ?? listRef.current?.querySelector<HTMLButtonElement>('[role="option"]');
      first?.focus();
    }
  }, [open]);

  // Escape closes + ↑/↓ moves through options.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (!listRef.current) return;
      const options = Array.from(
        listRef.current.querySelectorAll<HTMLButtonElement>('[role="option"]')
      );
      if (options.length === 0) return;
      const current = options.indexOf(document.activeElement as HTMLButtonElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = options[(current + 1) % options.length];
        next?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = options[(current - 1 + options.length) % options.length];
        prev?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        options[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        options[options.length - 1]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function switchTo(next: Locale) {
    setOpen(false);
    buttonRef.current?.focus();
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const isMobile = variant === "mobile";

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full text-sm text-ink-200 transition hover:text-white disabled:opacity-60",
          isMobile ? "glass px-4 py-2" : "glass h-10 px-3"
        )}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span className="font-mono text-xs tracking-wider">
          {t(`${locale}Short` as "frShort" | "enShort")}
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={t("label")}
          className="lang-pop absolute right-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-2xl border border-white/10 bg-ink-900/95 p-1 shadow-xl shadow-black/30 backdrop-blur-md"
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
                  {active && <Check className="h-4 w-4 text-accent-cyan" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
