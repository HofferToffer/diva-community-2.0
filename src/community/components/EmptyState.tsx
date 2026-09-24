import type { ReactNode } from "react";
import illBranch from "@/assets/ill-branch.png";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  illustration,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  illustration?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-card/60 px-6 py-12 text-center">
      <img
        src={illustration ?? illBranch}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={512}
        height={512}
        className="mx-auto mb-4 h-24 w-auto opacity-80"
      />
      <h3 className="font-display text-2xl text-foreground">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

const TONE_STYLES = {
  primary: "border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card glow-primary",
  accent: "border-accent/30 bg-gradient-to-br from-accent/15 via-card to-card glow-accent",
} as const;

export function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: keyof typeof TONE_STYLES;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card px-4 py-4 text-center shadow-elevated-sm",
        tone && TONE_STYLES[tone],
      )}
    >
      <p className="font-body text-2xl font-light leading-none text-foreground/90">{value}</p>
      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  );
}
