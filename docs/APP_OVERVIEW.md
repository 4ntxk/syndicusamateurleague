# App Overview

## Product Summary

Syndicus Amateur League is a bilingual web application for publishing and tracking amateur e-sports tournaments. It serves as the public website for SAL events and combines:

- marketing-style landing content,
- tournament registration access,
- season/tournament schedule visibility,
- tournament detail pages,
- group-stage standings,
- played and scheduled match lists,
- playoff bracket visualization,
- sponsor and gallery sections.

The app is optimized around a simple editorial workflow: organizers update local data files in the repository, and the frontend renders them into a polished public site.

This is important context because the repository still contains some starter-stack infrastructure, but the real product today is primarily a data-driven event website rather than a full platform with admin tools, dashboards, or live match management.

## Main Use Case

The app is intended for players, viewers, and organizers who need a central place to:

- understand what SAL is,
- see which tournaments are active,
- register for upcoming tournaments,
- check tournament dates and deadlines,
- inspect current groups and standings,
- follow qualification into playoffs,
- see playoff bracket progression,
- browse event-related media links.

## Functional Areas

### Homepage

The homepage introduces the brand and gives visitors an immediate overview of the ecosystem.

Implemented in:

- [`src/app/[locale]/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/page.tsx)

Rendered sections include:

- sidebar navigation,
- hero section,
- season schedule,
- gallery teaser carousel,
- sponsor section,
- footer.

Related components:

- [`src/components/hero.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/hero.tsx)
- [`src/components/schedule.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/schedule.tsx)
- [`src/components/carousel.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/carousel.tsx)
- [`src/components/sponsors.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/sponsors.tsx)
- [`src/components/footer.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/footer.tsx)

### Registration Page

The registration page is a directory of tournaments with outbound registration links. Each card displays registration state and start date, and when registration is open it links externally to a Google Form.

Implemented in:

- [`src/app/[locale]/registration/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/registration/page.tsx)

This makes the app a public discovery and funnel layer, while actual sign-up collection happens outside the app.

### Tournaments Listing

The tournaments page lists active tournaments. The filtering logic currently favors events that are either:

- open for registration, or
- marked as ongoing.

Implemented in:

- [`src/app/[locale]/tournaments/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/tournaments/page.tsx)

### Tournament Detail Page

The tournament detail page is the most important part of the system. It is effectively the product's domain center.

Implemented in:

- [`src/app/[locale]/tournaments/[id]/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/tournaments/[id]/page.tsx)

This page includes:

- tabbed navigation inside the tournament view,
- tournament info and scheduling notes,
- player list rendering,
- group tables,
- match lists,
- playoff bracket generation and display,
- qualified-player summary blocks,
- localized labels and deadlines.

### Gallery

The gallery page is currently a branded placeholder that forwards users to a Google Drive folder rather than hosting gallery assets directly inside the app.

Implemented in:

- [`src/app/[locale]/gallery/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/gallery/page.tsx)

## Routing And Localization

The app is locale-prefixed and currently supports:

- Polish: `pl`
- English: `en`

Routing behavior:

- requests without a locale are redirected to the Polish version,
- the active locale is propagated through middleware,
- the selected locale is saved in cookies,
- sidebar language buttons swap the leading path segment while keeping the current route.

Relevant files:

- [`middleware.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/middleware.ts)
- [`src/components/sidebar.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/sidebar.tsx)
- [`src/i18n/config.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/i18n/config.ts)
- [`src/i18n/use-locale.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/i18n/use-locale.ts)
- [`src/i18n/translations.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/i18n/translations.ts)

## Data Model

The core domain data is stored in [`src/data/tournaments.json`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.json) and typed in [`src/data/tournaments.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.ts).

Each tournament object includes:

- `id`
- `title`
- `registrationDate`
- `startDate`
- `isRegistrationOpen`
- `isOngoing`
- `googleFormUrl`
- localized registration and status labels
- `players`
- `groups`
- optional `playoffs`

Each group includes:

- `name`
- `players`
- optional `advanceSlots`
- optional `placeholderAdvance`
- `standings`
- `matches.scheduled`
- `matches.played`

Each played/scheduled match includes:

- `home`
- `away`
- optional `score`

This structure allows the app to function as a compact tournament publishing system without requiring a backend admin UI.

## Tournament Logic

### Group Stage

Groups are displayed with:

- standings table,
- scheduled matches,
- played matches,
- optional localized notices.

Standings and match information are read from tournament data and shown directly on the detail page.

### Qualification Logic

The playoff tab derives qualification context from group data. Based on the current implementation and repository guidance:

- players who actually played group matches matter for qualification display,
- advancement slots can differ by group,
- placeholders can be used when exact advancement is not finalized,
- the app tries to preserve a structured summary of qualified players by group.

### Playoff Logic

The bracket implementation is custom and contains non-trivial match resolution logic. The detail page:

- builds winners round entries from qualified players,
- deduplicates players,
- uses group and seed context,
- resolves scores from stored playoff result arrays,
- infers winners and losers of previous matches,
- propagates those inferred values into later bracket rounds,
- handles placeholder labels such as winner/loser references,
- renders different shapes for smaller and larger brackets,
- colors rounds based on current/upcoming state windows.

The repository memory in [`docs/AGENTS.md`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/docs/AGENTS.md) also records project-specific bracket constraints for the Playoffy tab, including:

- 16-player double elimination behavior,
- qualification source,
- pairing preferences,
- date windows,
- visual styling decisions,
- mobile bracket layout expectations.

That file should be treated as part of the domain documentation when editing playoff behavior.

## Content And Maintenance Workflow

The app is easiest to maintain when you think of it as three layers:

1. content data,
2. translated copy,
3. page/layout logic.

### Content Data Layer

Use this when changing:

- tournament titles,
- dates,
- statuses,
- players,
- group membership,
- standings,
- match lists,
- playoff result arrays.

Primary file:

- [`src/data/tournaments.json`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.json)

### Translation Layer

Use this when changing:

- labels,
- button text,
- tab names,
- schedule copy,
- deadline copy,
- playoff labels,
- English or Polish descriptions.

Primary file:

- [`src/i18n/translations.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/i18n/translations.ts)

### Presentation Logic Layer

Use this when changing:

- qualification rules,
- bracket generation,
- tab behavior,
- conditional rendering,
- mobile layout,
- custom tournament-specific edge cases.

Primary file:

- [`src/app/[locale]/tournaments/[id]/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/tournaments/[id]/page.tsx)

## Existing Maintenance Script

There are helper scripts for tournament maintenance:

- [`scripts/import-players.mjs`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/scripts/import-players.mjs)
- [`scripts/update-group-result.mjs`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/scripts/update-group-result.mjs)

Import players from a plain-text file:

```bash
node scripts/import-players.mjs --tournament 4 --file src/data/players.txt
```

Import players from pasted stdin:

```bash
Get-Content players.txt | node scripts/import-players.mjs --tournament 4
```

Record a group result:

```bash
node scripts/update-group-result.mjs "group A: player1 3:0 player2" --tournament 2
```

The player import script:

- expects one player nickname per line,
- accepts plain text from a file or stdin,
- trims whitespace,
- removes empty lines,
- deduplicates nicknames case-insensitively,
- writes the cleaned roster into the target tournament `players` array,
- supports `--append` when you do not want to replace the current list.

The group result script:

- parses group and score input,
- finds the target tournament,
- updates or inserts the played match,
- removes the match from scheduled fixtures,
- rebuilds standings from played results,
- writes the updated JSON back to disk.

This is useful because the app's data model is file-based, so repeatable maintenance scripts reduce manual editing mistakes.

## Visual And UX Direction

The app uses a strong esports-themed presentation language:

- dark background surfaces,
- purple/blue gradients,
- bright accent states,
- bold headings,
- compact data cards,
- left rail navigation on larger screens,
- collapsible mobile nav,
- custom tournament bracket visuals.

This matters when making UI changes because the current style is intentional and not just default Tailwind output.

## Stack Status

### Actively Driving The Product

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- local JSON content
- route middleware for locales

### Present In The Repo But Not Central To The Current Product

- Prisma
- NextAuth
- tRPC

These pieces appear to remain from the original T3 setup. They may become useful later, but at the moment they do not define the public tournament experience as strongly as the content files and page logic do.

## Important Files

High-signal files for future contributors:

- [`README.md`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/README.md)
- [`docs/AGENTS.md`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/docs/AGENTS.md)
- [`src/data/tournaments.json`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.json)
- [`src/data/tournaments.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.ts)
- [`src/i18n/translations.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/i18n/translations.ts)
- [`src/components/sidebar.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/sidebar.tsx)
- [`src/app/[locale]/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/page.tsx)
- [`src/app/[locale]/registration/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/registration/page.tsx)
- [`src/app/[locale]/tournaments/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/tournaments/page.tsx)
- [`src/app/[locale]/tournaments/[id]/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/tournaments/[id]/page.tsx)
- [`src/components/tournament-detail/info-tab.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/tournament-detail/info-tab.tsx)
- [`src/components/tournament-detail/players-tab.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/tournament-detail/players-tab.tsx)
- [`middleware.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/middleware.ts)

## Refactor Checkpoints

Current UI refactor progress:

1. Completed: extracted the tournament detail `Information` tab into [`src/components/tournament-detail/info-tab.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/tournament-detail/info-tab.tsx).
2. Completed: added tournament-specific info section titles and bullets in [`src/data/tournaments.json`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.json).
3. Completed: extracted the tournament detail `Players` tab into [`src/components/tournament-detail/players-tab.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components/tournament-detail/players-tab.tsx).
4. Completed: reworked `S1 SAL CUP Online APRIL#1` information content based on the SAL regulations PDF and surfaced subscription/access requirements in the tournament brief.
5. Completed: added locale-aware regulations and legal-guardian-consent links across homepage, registration, tournaments, and tournament detail flows.
6. Completed: added plain-text roster import support via [`scripts/import-players.mjs`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/scripts/import-players.mjs).
7. Next: extract the remaining tournament detail tabs (`groups`, `playoffs`) into standalone components.
8. Later: move bracket calculation helpers out of the page component into dedicated modules.

## Tournament Update Workflow

Recommended workflow for future tournament setup:

1. Create the tournament shell in [`src/data/tournaments.json`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.json):
   title, dates, labels, registration links, and tournament-specific `info`.
2. Collect the raw player list in a scratch source first:
   use [`src/data/players.txt`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/players.txt) or another plain-text list as a staging area.
3. Normalize player nicknames before inserting them into JSON:
   keep one canonical spelling per player and reuse it in `players`, `groups`, match results, and playoffs.
4. Import the confirmed player list with [`scripts/import-players.mjs`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/scripts/import-players.mjs) instead of hand-editing JSON where possible.
5. Once seeding/groups are ready, copy those names into `groups[].players` and initialize `standings`, `matches.scheduled`, and `matches.played`.
6. During the event, update results with [`scripts/update-group-result.mjs`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/scripts/update-group-result.mjs) when possible instead of hand-editing standings.

Practical rule:

- treat `players` as the confirmed tournament roster,
- treat `groups` as the structured competitive phase,
- treat [`src/data/players.txt`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/players.txt) as a temporary import/staging file, not the source of truth.
- for imports, prefer one nickname per line before running [`scripts/import-players.mjs`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/scripts/import-players.mjs).

## Resume Notes

When work resumes, highest-value next steps are:

1. extract the `Groups` tab from [`src/app/[locale]/tournaments/[id]/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/tournaments/[id]/page.tsx),
2. extract the `Playoffs` tab,
3. separate bracket-generation helpers from render code,
4. if roster intake becomes frequent, improve [`scripts/import-players.mjs`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/scripts/import-players.mjs) to better handle pasted spreadsheet exports with headings.

## Short Version

If someone asks "what is this app?", the most accurate short answer is:

Syndicus Amateur League is a bilingual Next.js tournament website for publishing SAL e-sports events, registrations, group standings, and custom playoff brackets from locally maintained tournament data.
