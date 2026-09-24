import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCommunityAuth } from "@/community/context/CommunityAuthProvider";

function isTodayBirthday(dateOfBirth: string | null, today = new Date()): boolean {
  if (!dateOfBirth) return false;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return false;
  return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
}

function firstName(name: string | null | undefined): string {
  if (!name) return "";
  return name.trim().split(/\s+/)[0] ?? "";
}

const CONFETTI = [
  { top: "9%", left: "12%", size: 8, shape: "circle", color: "hsl(344 37% 70%)" },
  { top: "15%", left: "78%", size: 10, shape: "circle", color: "hsl(32 50% 68%)" },
  { top: "24%", left: "24%", size: 6, shape: "circle", color: "hsl(40 33% 90%)" },
  { top: "19%", left: "67%", size: 7, shape: "square", color: "hsl(344 37% 70%)" },
  { top: "31%", left: "10%", size: 6, shape: "square", color: "hsl(32 50% 68%)" },
  { top: "12%", left: "46%", size: 9, shape: "circle", color: "hsl(40 33% 90%)" },
] as const;

/**
 * Shown once per calendar day, the first time she opens the community app
 * on her birthday (matched by month+day from her profile, any year) — a
 * localStorage flag (per profile + date) keeps it from reappearing on every
 * navigation within the same day.
 */
export function BirthdayGreeting() {
  const { t } = useTranslation();
  const { profile } = useCommunityAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!profile || !isTodayBirthday(profile.date_of_birth)) return;
    const today = new Date();
    const storageKey = `diva-birthday-seen-${profile.id}-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    try {
      if (localStorage.getItem(storageKey)) return;
      localStorage.setItem(storageKey, "1");
    } catch {
      // Private browsing or blocked storage — show it anyway, just without the once-per-day memory.
    }
    setVisible(true);
  }, [profile]);

  if (!profile) return null;
  const name = firstName(profile.name);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] overflow-hidden bg-[hsl(30_15%_12%)]"
          onClick={() => setVisible(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t("birthday.ariaLabel", { defaultValue: "Narodeninová gratulácia" })}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, hsl(344 28% 62% / 0.35), transparent 55%), radial-gradient(circle at 75% 75%, hsl(32 45% 46% / 0.3), transparent 55%)",
            }}
          />
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="pointer-events-none absolute"
              style={{
                top: c.top,
                left: c.left,
                width: c.size,
                height: c.size,
                background: c.color,
                borderRadius: c.shape === "circle" ? "9999px" : "2px",
              }}
              aria-hidden="true"
            />
          ))}

          <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-[hsl(40_33%_96%/0.25)] bg-[hsl(40_33%_96%/0.12)] text-3xl shadow-[0_0_28px_2px_hsl(344_28%_62%/0.3)]"
              aria-hidden="true"
            >
              🎂
            </motion.div>

            <p className="mt-5 font-display text-sm uppercase tracking-[0.18em] text-[hsl(344_37%_78%)]">
              {t("birthday.kicker", { defaultValue: "Dnes je tvoj deň" })}
            </p>

            <p className="mt-2.5 font-display text-4xl font-semibold leading-tight text-[hsl(40_33%_96%)]">
              {name
                ? t("birthday.titleWithName", { defaultValue: "Všetko najlepšie, {{name}} 🎉", name })
                : t("birthday.title", { defaultValue: "Všetko najlepšie! 🎉" })}
            </p>

            <p className="mt-4 max-w-[270px] text-sm leading-relaxed text-[hsl(40_30%_88%/0.85)]">
              {t("birthday.subtitle", {
                defaultValue: "Nech je tento rok plný sily, nežnosti a chvíľ len pre teba. Si diva.",
              })}{" "}
              💕
            </p>

            <button
              type="button"
              onClick={() => setVisible(false)}
              className="mt-7 rounded-full bg-[hsl(40_33%_96%)] px-7 py-3 text-sm font-medium text-[hsl(30_15%_20%)] transition-opacity hover:opacity-90"
            >
              {t("birthday.continueButton", { defaultValue: "Pokračovať do appky" })}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
