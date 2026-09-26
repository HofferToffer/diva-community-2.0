# DIVA Community — design conventions

- Prefer soft, elegant styling over hard-edged boxes: `rounded-2xl` (not `rounded-lg`) on cards, borders lighter than full contrast (e.g. `border-border/50` or none), a subtle `shadow-sm`/`shadow-lg` instead of a visible border line where a lift is needed.
- Popovers/dialogs/tooltips: no default hard border — soften with `border-none` + shadow, rounded corners, matching the app's warm/pink palette rather than stock component defaults.
- Don't box everything: secondary content (stat tiles, greetings) can sit on a soft tinted background (`bg-secondary/30`) or no background at all instead of a bordered card.
- Motion should feel gentle, not snappy: prefer ~0.4–0.5s durations with an eased-out curve (e.g. `[0.22, 1, 0.36, 1]`) over quick 0.2s defaults, and stagger multi-item entrances instead of having everything appear at once.

# Languages (SK / EN)

- The community app (`/community`) uses i18next JSON files in `src/i18n/locales/{sk,en}/common.json`.
- The public website keeps both languages side by side in the JSX via `useLang()` from `src/lib/lang.ts`: `l("Slovak text", "English text")`; data files use `{ sk, en }` objects read with `pick()`. Any new website text needs both.
- English copy should sound like her own voice: warm, relaxed, personal, not stiff or literal.
- Website defaults to Slovak (for Google); English via the SK · EN switcher or `?lang=en` links. Anything that can't be in English (admin-written posts, the Múdrosť lona poem) is left out of the English website entirely — no "only in Slovak" notes.
