import { motion } from "framer-motion";

const COLORS = ["hsl(344, 55%, 72%)", "hsl(344, 37%, 60%)", "hsl(354, 45%, 58%)", "hsl(40, 33%, 80%)", "hsl(30, 25%, 85%)"];

/** A one-shot burst of falling confetti pieces, meant to unmount itself after a few seconds. */
export function ConfettiBurst() {
  const pieces = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const duration = 1.8 + Math.random() * 1.2;
        const rotate = 180 + Math.random() * 360;
        const width = 6 + Math.random() * 5;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, top: "-5%", left: `${left}%`, rotate: 0 }}
            animate={{ opacity: 0, top: "105%", rotate }}
            transition={{ duration, delay, ease: "easeIn" }}
            style={{
              position: "absolute",
              width,
              height: width * 1.6,
              background: COLORS[i % COLORS.length],
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}
