# Discord migration plan

Generated: 2026-11-15T09:39:15.558Z

## Safety status

- Read-only audit completed successfully.
- No channels, categories, roles, permissions or messages were changed.
- Existing tournament archives are preserved.
- No automatic deletion is included in the migration.
- Sapphire remains installed until replacement features pass verification.

## Current server

- Server: Syndicus Amateur League
- Members visible to the bot: 105
- Channels: 205
- Categories: 15
- Roles: 12

## Planned additions

### Roles to create

- None

### Categories to create

- None

### Categories to reuse and rename

- None

### Channels to create

- None

### Existing channels to reuse

- None

## Existing areas requiring organiser review

These areas are deliberately not moved or archived automatically:

- ━━ 👋 START HERE ━━ (7 channels)
- ━━ 💬 COMMUNITY ━━ (7 channels)
- ━━ ⚽ FC27 LEAGUE ━━ (7 channels)
- 💎 FC27 — PLATINUM (3 channels)
- 🥇 FC27 — GOLD (3 channels)
- 🥈 FC27 — SILVER (3 channels)
- ━━ ⚔️ LOL 1V1 ━━ (5 channels)
- ━━ 🛡️ ORGANISER AREA ━━ (8 channels)
- ━━ 🗂️ LEGACY ARCHIVE ━━ (5 channels)
- 📦 ARCHIVE — JUNE 2026 (21 channels)
- 📦 ARCHIVE — MAY 2026 (30 channels)
- 📦 ARCHIVE — APRIL 2026 (12 channels)
- 📦 ARCHIVE — MARCH 2026 (24 channels)
- 📦 ARCHIVE — FEBRUARY 2026 (25 channels)
- 📦 ARCHIVE — JANUARY 2026 (29 channels)

## Sapphire replacement gate

Sapphire is present with roles: BOT, Sapphire. Direct permission references were found in 0 channel(s). Remove Sapphire only after welcome, role assignment, logging and moderation dependencies have been checked.

## Proposed migration sequence

1. Create SAL league roles beneath the SAL League Manager role.
2. Create the new English categories and channels without touching legacy areas.
3. Configure the private ORGANISER AREA for the Admin role.
4. Publish FC27 and LoL rules, schedules and result workflows.
5. Import and match the 13 FC27 registrations to Discord members.
6. Verify welcome, role assignment and logging replacements.
7. Move approved historical categories under LEGACY ARCHIVE in a separate reviewed operation.
8. Remove Sapphire manually only after the replacement checklist passes.
