"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  /**
   * If the caller's input has its own `id`, pass it here — we render a sibling
   * `<label htmlFor>` for explicit association. Omit to use implicit association
   * (we render an outer `<label>` wrapping the input).
   */
  htmlFor?: string;
  required?: boolean;
  /** Localised "required" word, read by screen readers. */
  requiredAriaSuffix?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Form field wrapper used by Contact and the admin project form.
 * Keeps a single source of truth for label/error styling + a11y wiring.
 * The error span uses `id="${htmlFor}-error"` so callers can pass that to
 * `aria-describedby` on their input.
 */
export function Field({
  label,
  htmlFor,
  required = false,
  requiredAriaSuffix,
  error,
  hint,
  className,
  children,
}: Props) {
  const labelText = (
    <>
      {label}
      {required && (
        <>
          <span aria-hidden className="ml-0.5 text-accent-pink">
            *
          </span>
          {requiredAriaSuffix && (
            <span className="sr-only"> ({requiredAriaSuffix})</span>
          )}
        </>
      )}
    </>
  );

  const body = (
    <>
      <div className="mt-2">{children}</div>
      {hint && !error && (
        <span className="mt-1 block text-xs text-ink-400">{hint}</span>
      )}
      {error && (
        <span
          id={htmlFor ? `${htmlFor}-error` : undefined}
          role="alert"
          className="mt-1 block text-xs text-accent-pink"
        >
          {error}
        </span>
      )}
    </>
  );

  if (htmlFor) {
    return (
      <div className={cn("block", className)}>
        <label htmlFor={htmlFor} className="label-muted block">
          {labelText}
        </label>
        {body}
      </div>
    );
  }
  return (
    <label className={cn("block", className)}>
      <span className="label-muted block">{labelText}</span>
      {body}
    </label>
  );
}
