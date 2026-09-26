import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const COLORS = ["#E3B9A7", "#4A2F38", "#A85D42", "#55624F", "#F4ECE3"]; // brand palette

/** A one-shot burst of falling confetti pieces, meant to unmount itself after a few seconds. */
export function ConfettiBurst({ className }: { className?: string }) {
  const pieces = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className={cn("pointer-events-none fixed inset-0 z-50 overflow-hidden", className)} aria-hidden="true">
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
