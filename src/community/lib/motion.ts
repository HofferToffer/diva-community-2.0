/** Staggered entrance for a page's top-level sections, e.g. `<motion.section {...fadeUp(0)}>`. */
export const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
});

/**
 * A gentle, continuous float+pulse for decorative icon badges (tip icons,
 * feature icons, stat tiles) — not for functional/interactive icons like
 * nav buttons, where movement would just look broken. `i` staggers several
 * icons in the same group so they don't bob in lockstep.
 */
export const floatIcon = (i = 0) => ({
  animate: { y: [0, -7, 0], scale: [1, 1.05, 1] },
  transition: {
    duration: 2.2,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: (i % 8) * 0.15,
  },
});
