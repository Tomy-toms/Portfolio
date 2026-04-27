"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionReveal } from "./SectionReveal";
import { cn } from "@/lib/utils";

type FaqItem = { q: string; a: string };

export function Faq() {
  const t = useTranslations("Faq");
  const items = t.raw("items") as FaqItem[];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        <SectionReveal className="max-w-3xl">
          <span className="label-muted">{t("eyebrow")}</span>
          <h2 className="section-heading mt-3">
            {t("titleA")}
            {t("titleAccent")}
            {t("titleB")}
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <ul className="mt-12 mx-auto max-w-3xl space-y-3">
            {items.map((item, i) => {
              const open = openIdx === i;
              return (
                <li
                  key={item.q}
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-colors",
                    open
                      ? "border-accent/40 bg-white/[0.04]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="font-display text-base text-white sm:text-lg">
                      {item.q}
                    </span>
                    <Plus
                      className={cn(
                        "h-5 w-5 shrink-0 text-accent-cyan transition-transform duration-300",
                        open && "rotate-45"
                      )}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-ink-200 sm:px-6 sm:pb-6">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
}
