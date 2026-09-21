import { useMemo } from "react";
import { CYCLE_PHASE_COLORS, type CyclePhaseKey } from "@/community/lib/cycle";

const W = 280;
const H = 40;
const MID = 20;
const AMP = 11;
const CYCLES = 1.4;
const STEPS = 60;

function waveY(t: number) {
  return MID + AMP * Math.sin(2 * Math.PI * CYCLES * t);
}

/** A gentle wavy line with a dot marking today's position in the cycle — inspired by classic period-app "where am I" indicators. */
export function CyclePhaseWave({
  dayOfCycle,
  cycleLengthDays,
  phaseKey,
}: {
  dayOfCycle: number;
  cycleLengthDays: number;
  phaseKey: CyclePhaseKey;
}) {
  const progress = Math.min(1, Math.max(0, (dayOfCycle - 1) / Math.max(cycleLengthDays - 1, 1)));
  const color = CYCLE_PHASE_COLORS[phaseKey].dot;

  const points = useMemo(
    () => Array.from({ length: STEPS + 1 }, (_, i) => {
      const t = i / STEPS;
      return { t, x: t * W, y: waveY(t) };
    }),
    [],
  );

  const fullPath = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const travelled = points.filter((p) => p.t <= progress);
  const travelledPath = travelled.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const dotX = progress * W;
  const dotY = waveY(progress);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      <polyline points={fullPath} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-border" />
      {travelled.length > 1 && (
        <polyline points={travelledPath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
      <circle cx={dotX} cy={dotY} r="7" fill={color} opacity="0.18" />
      <circle cx={dotX} cy={dotY} r="4" fill={color} stroke="hsl(var(--card))" strokeWidth="1.5" />
    </svg>
  );
}
