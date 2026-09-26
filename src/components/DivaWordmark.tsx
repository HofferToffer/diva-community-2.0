import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";
import { MARK_PETALS, MARK_RING } from "@/components/divaMark";

/**
 * The main DIVA logo from the brand manual: the mark, "DIVA" in Cormorant
 * Garamond, "COMMUNITY" in Jost, and the motto in Cormorant italic — Slovak or
 * English with the website language. Drawn in `currentColor`, so it takes the
 * palette colour from its text colour (plum on light, cream on dark).
 *
 * Laid out on the 2000-wide grid of the supplied logo artwork.
 */
export function DivaWordmark({
  className,
  motto = true,
  title = "DIVA Community",
}: {
  className?: string;
  /** "Logo bez motta" when false — for places where the motto would be too small to read. */
  motto?: boolean;
  title?: string;
}) {
  const { l } = useLang();
  // Mark placed so its dot and ring line up with the logo artwork.
  const k = 0.956;
  const markTransform = `translate(497.5 -23) scale(${k})`;

  return (
    <svg
      viewBox={motto ? "480 70 1040 1300" : "580 70 840 1150"}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label={title}
    >
      <g transform={markTransform}>
        {/* Thinner ring than the stand-alone mark, as in the main logo. */}
        <path d={MARK_RING} fill="none" stroke="currentColor" strokeWidth={5} />
        {MARK_PETALS.map((d, i) => (
          <path key={i} d={d} fill="currentColor" />
        ))}
        <circle cx={216} cy={511.5} r={15.5} fill="currentColor" />
      </g>

      <text
        x={1003}
        y={1107}
        textAnchor="middle"
        textLength={687}
        lengthAdjust="spacing"
        fill="currentColor"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 212, fontWeight: 400 }}
      >
        DIVA
      </text>
      <text
        x={1002}
        y={1193}
        textAnchor="middle"
        textLength={395}
        lengthAdjust="spacing"
        fill="currentColor"
        style={{ fontFamily: "'Jost', 'Helvetica Neue', Arial, sans-serif", fontSize: 47, fontWeight: 400 }}
      >
        COMMUNITY
      </text>
      {motto && (
        <text
          x={1001}
          y={1330}
          textAnchor="middle"
          fill="currentColor"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 72, fontStyle: "italic", fontWeight: 400 }}
        >
          {l("V jemnosti je naša sila", "In gentleness lies our strength")}
        </text>
      )}
    </svg>
  );
}
