import { useEffect, useState } from "react";

export type PreviewMode = "off" | "cycle" | "ttc" | "pregnant" | "postpartum" | "menopause";
export interface AdminPreview {
  mode: PreviewMode;
  cycleDay: number; // 1..cycleLength
  cycleLength: number;
  periodLength: number; // 1..14
  pregnancyWeek: number; // 1..42
  postpartumWeek: number; // 1..12
  menopauseStage: string | null;
}

const KEY = "diva-admin-cycle-preview";
const EVENT = "diva-admin-preview-change";
export const DEFAULT_PREVIEW: AdminPreview = {
  mode: "off",
  cycleDay: 1,
  cycleLength: 28,
  periodLength: 5,
  pregnancyWeek: 12,
  postpartumWeek: 2,
  menopauseStage: null,
};

export function readPreview(): AdminPreview {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_PREVIEW, ...JSON.parse(raw) } : DEFAULT_PREVIEW;
  } catch {
    return DEFAULT_PREVIEW;
  }
}

export function writePreview(p: AdminPreview) {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event(EVENT));
}

export function useAdminPreview(): [AdminPreview, (p: AdminPreview) => void] {
  const [p, setP] = useState<AdminPreview>(readPreview);
  useEffect(() => {
    const h = () => setP(readPreview());
    window.addEventListener(EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return [p, writePreview];
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return iso(d);
};

/** Returns a display-only copy of the profile with simulated life phase. Never saved. */
export function applyPreview<T extends Record<string, unknown>>(profile: T, p: AdminPreview): T {
  if (p.mode === "off") return profile;
  const base = {
    ...profile,
    is_pregnant: false,
    is_postpartum: false,
    is_menopause: false,
    is_trying_to_conceive: false,
  };
  switch (p.mode) {
    case "cycle":
    case "ttc":
      return {
        ...base,
        is_trying_to_conceive: p.mode === "ttc",
        cycle_length_days: p.cycleLength,
        period_length_days: p.periodLength,
        last_period_date: daysAgo(p.cycleDay - 1),
      };
    case "pregnant":
      return { ...base, is_pregnant: true, last_period_date: daysAgo((p.pregnancyWeek - 1) * 7) };
    case "postpartum":
      return { ...base, is_postpartum: true, postpartum_since: daysAgo((p.postpartumWeek - 1) * 7) };
    case "menopause":
      return { ...base, is_menopause: true, menopause_stage: p.menopauseStage };
  }
}
