# DIVA Community — design conventions

- Prefer soft, elegant styling over hard-edged boxes: `rounded-2xl` (not `rounded-lg`) on cards, borders lighter than full contrast (e.g. `border-border/50` or none), a subtle `shadow-sm`/`shadow-lg` instead of a visible border line where a lift is needed.
- Popovers/dialogs/tooltips: no default hard border — soften with `border-none` + shadow, rounded corners, matching the brand palette (plum / cream / powder) rather than stock component defaults.
- Don't box everything: secondary content (stat tiles, greetings) can sit on a soft tinted background (`bg-secondary/30`) or no background at all instead of a bordered card.
- Motion should feel gentle, not snappy: prefer ~0.4–0.5s durations with an eased-out curve (e.g. `[0.22, 1, 0.36, 1]`) over quick 0.2s defaults, and stagger multi-item entrances instead of having everything appear at once.

# Brand (DIVA Brand manuál 1.0)

- Colours live as tokens in `src/index.css` (`--diva-*` hex + the HSL theme tokens) and as Tailwind `diva-*` colours (`text-diva-terakotova`, `bg-diva-slivkova`, …). Use tokens, never new ad-hoc hex/hsl values.
- Palette: slivková #4A2F38 (primary, text), krémová #F4ECE3, krémová svetlá #FAF6F1 (page background), šalviová #55624F, terakotová #A85D42, púdrová #E3B9A7, čierna #1E1A1A. Roughly 60 % cream/white, 30 % plum, 10 % accents.
- Púdrová is for surfaces, lines and hover backgrounds only — never text (1.5:1). For readable accent text use terakotová.
- Cycle phases = seasons: menštruácia slivková (zima), folikulárna šalviová (jar), ovulácia púdrová (leto), luteálna terakotová (jeseň) — see `CYCLE_PHASE_COLORS` in `src/community/lib/cycle.ts` (`solid`/`onSolid` for filled days, `dot` for readable markers).
- Fonts: Cormorant Garamond for headings, motto and quotes (Regular / italic, never bold, never whole paragraphs); Jost for text, menus and buttons.
- Logos: `DivaLogo` (the mark, optionally animated) and `DivaWordmark` (main logo, motto follows the site language). Favicons at 16–48 px use the flower alone.

# Languages (SK / EN)

- The community app (`/community`) uses i18next JSON files in `src/i18n/locales/{sk,en}/common.json`.
- The public website keeps both languages side by side in the JSX via `useLang()` from `src/lib/lang.ts`: `l("Slovak text", "English text")`; data files use `{ sk, en }` objects read with `pick()`. Any new website text needs both.
- English copy should sound like her own voice: warm, relaxed, personal, not stiff or literal.
- Website defaults to Slovak (for Google); English via the SK · EN switcher or `?lang=en` links. Anything that can't be in English (admin-written posts, the Múdrosť lona poem) is left out of the English website entirely — no "only in Slovak" notes.
