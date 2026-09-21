# DIVA Community — design conventions

- Prefer soft, elegant styling over hard-edged boxes: `rounded-2xl` (not `rounded-lg`) on cards, borders lighter than full contrast (e.g. `border-border/50` or none), a subtle `shadow-sm`/`shadow-lg` instead of a visible border line where a lift is needed.
- Popovers/dialogs/tooltips: no default hard border — soften with `border-none` + shadow, rounded corners, matching the app's warm/pink palette rather than stock component defaults.
- Don't box everything: secondary content (stat tiles, greetings) can sit on a soft tinted background (`bg-secondary/30`) or no background at all instead of a bordered card.
- Motion should feel gentle, not snappy: prefer ~0.4–0.5s durations with an eased-out curve (e.g. `[0.22, 1, 0.36, 1]`) over quick 0.2s defaults, and stagger multi-item entrances instead of having everything appear at once.
