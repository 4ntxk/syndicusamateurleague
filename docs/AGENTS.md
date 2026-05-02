# Project Memory (Playoffy Bracket)

Purpose: Keep continuity for bracket updates and styling decisions in the Playoffy tab.

## Bracket Behavior
- Playoff bracket is **16-player double elimination**.
- Winners Round 1 pairings are built **only from "Zakwalifikowani z grup"** (qualified players).
  - Qualified list = players who **played at least one group match** (same list shown in the Playoffy tab under "Qualified From Groups").
  - Pairing rule:
    - Prefer **points > 0 vs points <= 0**.
    - Avoid **same group** matchups when possible.
    - Best-effort fallback if constraints can’t be satisfied.
- If fewer than 16 qualified players, bracket does **not** render and the hint text is shown.

## Dates / Deadlines
Playoffs are Feb 9–15.
Option B schedule (displayed in the UI):
1) Feb 9–10: Winners Round of 16 + Losers Round 1
2) Feb 11–12: Winners Quarterfinals + Losers Round 2
3) Feb 13–14: Winners Semifinals + Losers Rounds 3–4
4) Feb 15: Winners Final + Losers Final + Grand Final

These dates are embedded in the bracket column titles (both PL and ENG).

## Visual Styling
- Current rounds:
  - Winners Round of 16
  - Losers Round 1
  - Highlighted **green** (`text-emerald-300`).
- Upcoming rounds: **purple** (`text-[#a83acd]`).
- Player nicknames: **purple** `#8b5cf6` + bold.
- Placeholder labels (e.g., "Winner W1", "Przegrany W1", "TBD"):
  - Muted purple `#7c3aed` at 70% opacity.
- Final cell is smaller, centered, and placed **above** Winners bracket.

## Mobile Layout
- Brackets stack into single column on small screens.
- Removed fixed min-width on mobile to prevent horizontal overflow.
- Groups table is `table-fixed` with truncation and horizontal scroll.

## Key Files
- Bracket UI: `src/app/[locale]/tournaments/[id]/page.tsx`
- Translations: `src/i18n/translations.ts`

## Notes
- English text is the reference; Polish is localized but includes the same structure.
- If you change dates, update both the deadlines block and the bracket column titles.

## Refactor Checkpoints
- Completed: tournament `Information` tab extracted to `src/components/tournament-detail/info-tab.tsx`.
- Completed: tournament `Players` tab extracted to `src/components/tournament-detail/players-tab.tsx`.
- Completed: `S1 SAL CUP Online APRIL#1` `Information` tab rewritten around the SAL regulations PDF.
- Completed: regulations / guardian-consent / Patronite links surfaced in the main user flows.
- Completed: plain-text roster import helper added at `scripts/import-players.mjs`.
- Development note: tournament maintenance is still active while the project is being refactored / revamped in-place. Favor small, reversible changes around group/playoff UI and data workflows.
- Current focus: continue decomposing `src/app/[locale]/tournaments/[id]/page.tsx` one tab at a time.
- Next checkpoint: extract `Groups`, then `Playoffs`.

## Tournament Update Workflow
- Use `src/data/tournaments.json` as the source of truth for live tournament data.
- Use `src/data/players.txt` only as a scratch import/staging file when collecting player lists.
- Keep player nicknames canonical and identical across `players`, `groups`, match results, and playoffs.
- Prefer `scripts/import-players.mjs` for importing roster lists from plain text instead of editing large player arrays manually.
- `scripts/import-players.mjs` expects one nickname per line for clean imports.
- Prefer `scripts/update-group-result.mjs` for group-result updates instead of manually editing standings.
- Organizer score-entry shorthand is acceptable in chat, for example: `playerA 5:0 playerB`, then `second match 3:0` for the reverse leg. Save the second result as the opposite home/away fixture so both legs appear in `Mecze rozegrane`.

## Resume Notes
- Next implementation checkpoint: extract the `Groups` tab.
- After that: extract the `Playoffs` tab.
- Then: move bracket helper logic out of `src/app/[locale]/tournaments/[id]/page.tsx`.
