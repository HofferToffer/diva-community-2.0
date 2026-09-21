/** Staggered entrance for a page's top-level sections, e.g. `<motion.section {...fadeUp(0)}>`. */
export const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
});
