"use client";

import { useEffect } from "react";

/**
 * Mounts once at the top of the layout. Watches every `.reveal` element with a
 * single shared IntersectionObserver and toggles `.is-visible` the first frame
 * each one enters the viewport. Replaces framer-motion's `whileInView` for
 * non-interactive entrance animations.
 *
 * The MutationObserver re-scan is rAF-debounced so DOM-heavy pages (Projects
 * sticky stack, filter changes) don't re-walk the document on every mutation.
 *
 * No props; renders nothing.
 */
export function RevealOnView() {
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add("is-visible");

    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      document.querySelectorAll(".reveal").forEach(reveal);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.querySelectorAll(".reveal").forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.01 }
    );

    const seen = new WeakSet<Element>();
    const observeAll = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((el) => {
          if (!seen.has(el)) {
            seen.add(el);
            io.observe(el);
          }
        });
    };
    observeAll();

    // Re-scan when client navigation injects new sections (filter changes etc.).
    // rAF-debounced so a burst of mutations only triggers one walk per frame.
    let scheduled = false;
    const scheduleScan = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        observeAll();
      });
    };
    const mo = new MutationObserver(scheduleScan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
