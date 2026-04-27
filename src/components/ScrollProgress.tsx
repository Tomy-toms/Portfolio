/**
 * Pure-CSS progress bar driven by `animation-timeline: scroll(root)`. No JS,
 * no listeners. Browsers without scroll-driven animations hide the bar via the
 * `@supports not` rule in globals.css — graceful degradation, the bar isn't
 * critical UX.
 */
export function ScrollProgress() {
  return <div aria-hidden className="scroll-progress" />;
}
