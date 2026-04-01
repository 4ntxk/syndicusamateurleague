# Syndicus Amateur League

Syndicus Amateur League (`SAL`) is a bilingual tournament website for presenting amateur e-sports events. The app is built as a public-facing platform where visitors can:

- browse the season schedule,
- open tournament registration links,
- view active tournament cards,
- inspect tournament details,
- review group-stage standings and played/scheduled matches,
- follow playoff brackets,
- switch between Polish and English,
- open sponsor and gallery links.

This repository is not a generic starter anymore. The real product is a content-driven tournament site whose main source of truth is local JSON data in [`src/data/tournaments.json`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.json).

## What This App Is

The app acts as a lightweight competition hub for SAL events. It is designed primarily as a read-only tournament portal rather than a full admin panel.

Core characteristics:

- public marketing and information site,
- bilingual routing with Polish as default,
- static/data-driven tournament publishing,
- custom tournament detail pages,
- custom group tables and match lists,
- custom playoff bracket rendering logic,
- Google Forms based registration,
- Google Drive based gallery linking,
- sponsor showcase and homepage sections.

In practice, organizers update tournament content directly in the repository data files, and the frontend renders that content into user-facing tournament pages.

## Current Product Surface

Main routes:

- `/{locale}`: homepage with hero, schedule, gallery preview, sponsors, and footer,
- `/{locale}/registration`: tournament registration overview with external Google Form links,
- `/{locale}/tournaments`: active tournaments listing,
- `/{locale}/tournaments/{id}`: tournament detail page with tabs for info, players, groups, and playoffs,
- `/{locale}/gallery`: gallery placeholder page linking to Google Drive,
- `/{locale}/about`: minimal informational page.

Supported locales:

- `pl`
- `en`

Locale handling is enforced by [`middleware.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/middleware.ts), which redirects non-localized requests to `/pl/...` and stores the current locale in a cookie.

## How The App Works

### 1. Tournament content is stored locally

Tournament data lives in:

- [`src/data/tournaments.json`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.json)
- typed through [`src/data/tournaments.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.ts)

Each tournament entry contains:

- metadata such as title, dates, registration state, and status labels,
- player list,
- groups,
- standings,
- scheduled and played matches,
- optional playoff result collections.

The frontend does not currently fetch tournament state from a CMS or live database. The website is mostly driven by the checked-in JSON data file.

### 2. Translations are code-based

All UI text is maintained in:

- [`src/i18n/translations.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/i18n/translations.ts)

That file holds:

- navigation labels,
- page copy,
- tournament detail tab labels,
- playoff labels,
- schedule text,
- registration text,
- gallery and footer copy.

English is effectively the structural reference for many product strings, with Polish localized alongside it.

### 3. The tournament detail page contains the main domain logic

The most domain-specific implementation is in:

- [`src/app/[locale]/tournaments/[id]/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/tournaments/[id]/page.tsx)

This page is responsible for:

- rendering tabbed tournament content,
- showing schedule and info sections,
- listing players,
- showing group standings and matches,
- calculating qualified players from played group matches,
- rendering playoff brackets,
- resolving scores and winners through multiple rounds,
- applying localized bracket labels and deadline text,
- adapting bracket layout for smaller screens.

This file is the center of the app's tournament presentation logic.

## Playoff Behavior

The repo currently contains custom playoff logic tied to SAL tournament presentation rules.

Important behavior already embedded in the app:

- playoff brackets are rendered from tournament data and derived outcomes,
- qualified players are derived from group-stage participation/results rather than simply from raw registration,
- the app supports double-elimination bracket presentation,
- the playoff tab includes qualified-player summaries grouped by original group,
- round labels and deadline text are localized,
- mobile layout compresses the bracket into stacked columns.

Project-specific bracket assumptions and styling decisions are also documented in [`docs/AGENTS.md`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/docs/AGENTS.md).

## Visual Style

The site uses a dark, neon-leaning tournament presentation style with strong purple gradients and accent colors.

Common UI traits:

- left sidebar navigation,
- purple and blue gradient headers,
- dark content panels,
- bold tournament titles,
- card-based layouts,
- responsive behavior for mobile and desktop,
- hand-tuned playoff visuals rather than a generic library component.

Global styling entry:

- [`src/styles/globals.css`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/styles/globals.css)

## Tech Stack

Primary stack in active use:

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- local JSON data
- custom locale middleware

Scaffolded or partially retained from the original T3 template:

- Prisma
- NextAuth
- tRPC

These systems still exist in the repository, but the current user-facing tournament experience is largely content-driven and does not depend on a live authenticated workflow.

Relevant files:

- [`prisma/schema.prisma`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/prisma/schema.prisma)
- [`src/server/auth/config.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/server/auth/config.ts)
- [`src/server/api/root.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/server/api/root.ts)

## Project Structure

Key directories:

- [`src/app`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app): app routes and page entry points
- [`src/components`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/components): UI sections and shared components
- [`src/data`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data): tournament data and source content
- [`src/i18n`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/i18n): localization helpers and translation dictionaries
- [`src/server`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/server): retained server/auth/api scaffolding
- [`scripts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/scripts): maintenance scripts for tournament content

## Local Development

Install dependencies:

```bash
npm install
```

Create an env file from the example:

```bash
copy .env.example .env
```

Start development:

```bash
npm run dev
```

If you want to bypass env validation during local iteration:

```bash
npm run dev:skip
```

Useful commands:

```bash
npm run build
npm run lint
npm run typecheck
npm run format:write
```

## Environment Variables

Defined in:

- [`.env.example`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/.env.example)
- [`src/env.js`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/env.js)

Variables currently expected:

- `AUTH_SECRET`
- `AUTH_DISCORD_ID`
- `AUTH_DISCORD_SECRET`
- `DATABASE_URL`

For the current content-driven site, not all of these are required for basic frontend editing, but they remain part of the repository because auth/database scaffolding is still present.

## Content Maintenance

The most important manual workflow today is updating tournament data.

Typical edit targets:

- [`src/data/tournaments.json`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/data/tournaments.json)
- [`src/i18n/translations.ts`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/i18n/translations.ts)
- [`src/app/[locale]/tournaments/[id]/page.tsx`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/src/app/[locale]/tournaments/[id]/page.tsx)

There is also a helper script for recording a played group match and recalculating standings:

```bash
node scripts/update-group-result.mjs "group A: player1 3:0 player2" --tournament 2
```

Script location:

- [`scripts/update-group-result.mjs`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/scripts/update-group-result.mjs)

## Detailed Documentation

For a more thorough description of the app, domain model, route behavior, and maintenance workflow, see:

- [`docs/APP_OVERVIEW.md`](/C:/Users/anton/OneDrive/Desktop/projekty/syndicusamateurleague/syndicusamateurleague/docs/APP_OVERVIEW.md)
