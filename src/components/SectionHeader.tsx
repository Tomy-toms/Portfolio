import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  titleA: string;
  titleAccent?: string;
  titleB?: string;
  /** Wraps titleAccent in the violet→cyan gradient span. */
  accent?: boolean;
  intro?: string;
  headingClassName?: string;
  introClassName?: string;
};

/**
 * Returns a Fragment (eyebrow + h2 + optional intro) so it slots into any
 * existing wrapper (Reveal, grid cell, decorative card) without adding extra DOM.
 * Markup must stay identical to the previous hand-written version — SEO + a11y
 * audits validated against this exact structure.
 */
export function SectionHeader({
  eyebrow,
  titleA,
  titleAccent,
  titleB,
  accent = false,
  intro,
  headingClassName,
  introClassName,
}: Props) {
  return (
    <>
      <span className="label-muted">{eyebrow}</span>
      <h2 className={cn("section-heading mt-3", headingClassName)}>
        {titleA}
        {titleAccent != null &&
          (accent ? (
            <span className="text-gradient-accent">{titleAccent}</span>
          ) : (
            titleAccent
          ))}
        {titleB}
      </h2>
      {intro && (
        <p className={cn("mt-6 text-ink-300", introClassName)}>{intro}</p>
      )}
    </>
  );
}
