"use client";

import { useEffect } from "react";

/**
 * Activates `scroll-behavior: smooth` *only* during in-page anchor clicks, then
 * removes it. Keeps INP fast (no global smooth scroll) while preserving the
 * smooth-jump UX for anchor links.
 */
export function SmoothScrollOnAnchor() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: number | undefined;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      root.classList.add("smooth-scroll");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        root.classList.remove("smooth-scroll");
      }, 1000);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
