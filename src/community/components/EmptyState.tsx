import type { ReactNode } from "react";
import illBranch from "@/assets/ill-branch.png";

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

export function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card px-4 py-4 text-center shadow-elevated-sm">
      <p className="font-body text-2xl font-light leading-none text-foreground/90">{value}</p>
      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  );
}
