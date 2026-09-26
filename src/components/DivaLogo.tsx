import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Traced from the brand mark on a 1024 grid: an open circle with a four-petal
// flower sitting in its gap on the left.
const RING = "M268.2 320.25 A382.5 382.5 0 1 1 268.2 702.75";
const PETALS = [
  "M216 333 Q258 408 216 483 Q174 408 216 333Z", // top
  "M245 511.5 Q319.5 553.5 394 511.5 Q319.5 469.5 245 511.5Z", // right
  "M216 540 Q258 615 216 690 Q174 615 216 540Z", // bottom
  "M38 511.5 Q112.5 553.5 187 511.5 Q112.5 469.5 38 511.5Z", // left
];

/**
 * The DIVA mark. `animated` draws the ring in, lets the petals open one by one
 * and then keeps the flower gently breathing.
 */
export function DivaLogo({
  className,
  animated = false,
  strokeWidth = 12,
  title,
}: {
  className?: string;
  animated?: boolean;
  /** Ring thickness on the 1024 grid — bump it up for tiny sizes. */
  strokeWidth?: number;
  title?: string;
}) {
  const ringProps = {
    d: RING,
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
  };

  return (
    <svg
      viewBox="24 104 980 816"
      className={cn("h-auto w-full", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {animated ? (
        <motion.path
          {...ringProps}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.2 }}
        />
      ) : (
        <path {...ringProps} />
      )}

      {/* The flower is symmetric, so framer's default pivot (its own centre) is the dot. */}
      <motion.g
        animate={animated ? { rotate: [0, 8, 0, -8, 0], scale: [1, 1.04, 1, 1.04, 1] } : undefined}
        transition={animated ? { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.8 } : undefined}
      >
        {PETALS.map((d, i) =>
          animated ? (
            <motion.path
              key={i}
              d={d}
              fill="currentColor"
              style={{ transformOrigin: "216px 511.5px", transformBox: "view-box" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.9 + i * 0.12 }}
            />
          ) : (
            <path key={i} d={d} fill="currentColor" />
          ),
        )}
        <circle cx={216} cy={511.5} r={15.5} fill="currentColor" />
      </motion.g>
    </svg>
  );
}
