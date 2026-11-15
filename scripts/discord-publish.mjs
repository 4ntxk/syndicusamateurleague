import fs from "node:fs";
import path from "node:path";

import {
  discordRequest,
  getDiscordConfig,
  normalizeDiscordName,
} from "./discord-lib.mjs";

const config = getDiscordConfig();
const seasonPath = path.resolve(
  process.cwd(),
  "src",
  "data",
  "fc27-season-1-players.json",
);
const season = JSON.parse(fs.readFileSync(seasonPath, "utf8"));
const weekOnePath = path.resolve(
  process.cwd(),
  "src",
  "data",
  "fc27-season-1-week-1.json",
);
const weekOne = JSON.parse(fs.readFileSync(weekOnePath, "utf8"));
const channels = await discordRequest(`/guilds/${config.guildId}/channels`);
let roles = await discordRequest(`/guilds/${config.guildId}/roles`);
const botUser = await discordRequest("/users/@me");
const botRole = roles.find(
  (role) =>
    role.tags?.bot_id === config.applicationId ||
    normalizeDiscordName(role.name) ===
      normalizeDiscordName("SAL League Manager"),
);

if (!botRole) {
  throw new Error("SAL League Manager role was not found.");
}

let botAccessRole = roles.find((role) => role.name === "SAL Bot Access");
if (!botAccessRole) {
  botAccessRole = await discordRequest(`/guilds/${config.guildId}/roles`, {
    method: "POST",
    body: JSON.stringify({
      name: "SAL Bot Access",
      permissions: "0",
      hoist: false,
      mentionable: false,
      reason: "Technical access role for SAL managed channels",
    }),
  });
  roles = [...roles, botAccessRole];
}

await discordRequest(
  `/guilds/${config.guildId}/members/${botUser.id}/roles/${botAccessRole.id}`,
  { method: "PUT" },
);

const channelByName = (name) => {
  const matches = channels.filter((channel) => channel.name === name);
  if (matches.length !== 1) {
    throw new Error(
      `Expected one channel named ${name}, found ${matches.length}.`,
    );
  }
  return matches[0];
};

const footerFor = (key) => ({ text: `SAL_MANAGED:${key}` });
const purple = 0x8b5cf6;
const green = 0x10b981;
const gold = 0xf59e0b;

const managedMessage = (key, embeds) => ({
  allowed_mentions: { parse: [] },
  embeds: embeds.map((embed) => ({ ...embed, footer: footerFor(key) })),
});

const upsertManagedMessage = async (channelName, key, embeds) => {
  try {
    const channel = channelByName(channelName);
    const recentMessages = await discordRequest(
      `/channels/${channel.id}/messages?limit=100`,
    );
    const existing = recentMessages.find((message) =>
      message.embeds?.some(
        (embed) => embed.footer?.text === `SAL_MANAGED:${key}`,
      ),
    );
    const body = managedMessage(key, embeds);

    if (existing) {
      await discordRequest(`/channels/${channel.id}/messages/${existing.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      console.log(`[publish] updated #${channelName}: ${key}`);
      return true;
    }

    await discordRequest(`/channels/${channel.id}/messages`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    console.log(`[publish] posted #${channelName}: ${key}`);
    return true;
  } catch (error) {
    console.error(`[publish] skipped #${channelName}: ${error.message}`);
    return false;
  }
};

const divisionRoster = (division) =>
  season.players
    .filter((player) => player.division === division)
    .map(
      (player, index) =>
        `${index + 1}. **${player.discordUsername}** — ${player.platform}`,
    )
    .join("\n");

const divisionFixtures = (division) =>
  weekOne.fixtures
    .filter((fixture) => fixture.division === division)
    .map(
      (fixture) =>
        `**${fixture.id}** · ${fixture.homeDiscordUsername} vs ${fixture.awayDiscordUsername}`,
    )
    .join("\n");

await upsertManagedMessage("welcome", "welcome", [
  {
    title: "Welcome to Syndicus Amateur League",
    color: purple,
    description:
      "SAL is a free amateur esports community for FC27 and League of Legends. Start with the server rules, choose your game, and use the official league channels for schedules, results and support.",
    fields: [
      {
        name: "Start here",
        value:
          "1. Read **#rules**\n2. Check **#how-to-play**\n3. Review **#roles**\n4. Use **#general-chat** to meet the community",
      },
      {
        name: "Official communication",
        value:
          "League deadlines, rulings and material rule changes are published on this Discord server and at **sal.gg**.",
      },
    ],
  },
]);

await upsertManagedMessage("rules", "community-rules", [
  {
    title: "SAL Community Rules",
    color: purple,
    description:
      "Be respectful, compete fairly and help keep SAL welcoming. Participation means accepting the applicable competition rules and reasonable administrator decisions.",
    fields: [
      {
        name: "Respect",
        value:
          "No harassment, discrimination, threats, personal attacks or deliberately disruptive behaviour.",
      },
      {
        name: "Competitive integrity",
        value:
          "No cheating, account sharing, impersonation, match fixing, deliberate losses or fabricated evidence.",
      },
      {
        name: "Evidence and disputes",
        value:
          "Keep screenshots of results and scheduling attempts. Raise disputes privately through the official support channels.",
      },
      {
        name: "Administration",
        value:
          "Sanctions may include warnings, forfeits, point deductions, disqualification or future exclusion.",
      },
    ],
  },
]);

await upsertManagedMessage("how-to-play", "how-to-play", [
  {
    title: "How to compete in SAL",
    color: green,
    fields: [
      {
        name: "FC27",
        value:
          "Check **#fc27-rules**, find weekly fixtures in **#fc27-schedule**, arrange matches with opponents, then report evidence in **#fc27-results**.",
      },
      {
        name: "League of Legends 1v1",
        value:
          "Read **#lol-1v1-rules**, follow the bracket in **#lol-bracket**, and report completed series in **#lol-results**.",
      },
      {
        name: "Need help?",
        value:
          "Use the relevant support forum before a deadline. Do not post private evidence or personal information in public chat.",
      },
    ],
  },
]);

await upsertManagedMessage("roles", "roles", [
  {
    title: "League roles",
    color: purple,
    description:
      "SAL League Manager assigns competition roles from confirmed registrations. FC27 players also receive their current division role: Platinum, Gold or Silver.",
    fields: [
      {
        name: "Registration mismatch",
        value:
          "If your role is missing, contact an organiser in the appropriate support channel. Never post account credentials.",
      },
    ],
  },
]);

await upsertManagedMessage("bot-commands", "bot-commands", [
  {
    title: "SAL League Manager — Command guide",
    color: purple,
    description:
      "Commands work anywhere on this server. Type `/`, select **SAL League Manager**, then choose a command. Bot replies are private unless a result report creates an official forum post.",
    fields: [
      {
        name: "General commands",
        value:
          "`/sal-help` — display a private copy of this guide\n`/sal-status` — check whether the bot is online",
      },
      {
        name: "FC27 roster and fixtures",
        value:
          "`/fc27-roster [division]` — show registered players; division is optional\n`/fc27-fixtures [division]` — show Week 1 fixture IDs; division is optional",
      },
      {
        name: "Report an FC27 result",
        value:
          "Use `/fc27-report` and provide:\n• `fixture` — exact ID from `/fc27-fixtures`\n• `my-goals` — your score\n• `opponent-goals` — opponent's score\n• `screenshot` — final-score evidence",
      },
      {
        name: "Confirmation flow",
        value:
          "The bot creates a post in the correct division forum (`#platinum-results`, `#gold-results` or `#silver-results`) and mentions the opponent. The opponent selects **Confirm result** or **Dispute**.",
      },
      {
        name: "Important",
        value:
          "The winner normally submits the result. For a draw, either player may report. Use the correct fixture ID and never upload passwords or private account information.",
      },
      {
        name: "Organiser-only command",
        value:
          "`/sal-audit` — displays the local audit instruction and is restricted to server managers.",
      },
    ],
  },
]);

await upsertManagedMessage("fc27-announcements", "fc27-launch", [
  {
    title: "SAL FC27 Season 1",
    color: gold,
    description:
      "Season 1 is a four-week 1v1 Real Clubs calibration league with weekly promotion and relegation between Platinum, Gold and Silver.",
    fields: [
      { name: "Entry", value: "Free" },
      { name: "Season", value: "16 November–13 December 2026" },
      { name: "Weekly deadline", value: "Sunday, 23:59 CET" },
    ],
  },
]);

await upsertManagedMessage("fc27-rules", "fc27-rules", [
  {
    title: "SAL FC27 Season 1 — Match rules",
    color: gold,
    fields: [
      {
        name: "Mode",
        value:
          "1v1 Online Friendlies using real football clubs. Ultimate Team, national teams, World XI, Icons, All Stars and fantasy teams are prohibited.",
      },
      {
        name: "Settings",
        value:
          "Six-minute halves, Normal game speed and Professional difficulty. Draws are valid.",
      },
      {
        name: "Weekly fixtures",
        value:
          "Play every opponent in your division twice per week, once home and once away.",
      },
      {
        name: "League Points",
        value:
          "Win: 3 · Draw: 1 · Loss: 0. Tiebreakers: points, goal difference, goals scored, then head-to-head mini-table.",
      },
    ],
  },
  {
    title: "Scheduling, evidence and rulings",
    color: purple,
    fields: [
      {
        name: "Scheduling",
        value:
          "Contact opponents through Discord, add EA IDs and agree match times. Report non-response or missed arrangements with screenshots before the deadline.",
      },
      {
        name: "Reporting",
        value:
          "The winner posts a final-score screenshot; the loser confirms. For a draw, either player may report and the other confirms.",
      },
      {
        name: "Disconnect",
        value:
          "Normally a 3–0 loss for the disconnecting player unless both players document an agreed replay. SAL may retain a larger existing lead.",
      },
      {
        name: "Walkovers",
        value:
          "Only SAL may award a walkover after reviewing documented scheduling attempts. The standard score is 3–0.",
      },
      {
        name: "Minors",
        value:
          "Under-18 players require written parent/legal guardian consent sent to zgodaopiekuna@sal.gg.",
      },
    ],
  },
]);

await upsertManagedMessage("fc27-schedule", "fc27-schedule", [
  {
    title: "FC27 Season 1 schedule",
    color: gold,
    fields: [
      { name: "Week 1", value: "16–22 November 2026" },
      { name: "Week 2", value: "23–29 November 2026" },
      { name: "Week 3", value: "30 November–6 December 2026" },
      { name: "Week 4", value: "7–13 December 2026" },
      {
        name: "Default weekly deadline",
        value:
          "Sunday, 23:59 CET. Exact fixture notices published by SAL take precedence.",
      },
      {
        name: "Movement",
        value:
          "After Weeks 1–3, the top two eligible players in Gold and Silver move up; the bottom two in Platinum and Gold move down.",
      },
    ],
  },
]);

await upsertManagedMessage("fc27-season-standings", "fc27-initial-divisions", [
  {
    title: "FC27 Season 1 — Initial divisions",
    color: gold,
    description:
      "Initial placement is based on the declared Division Rivals rank submitted during registration.",
    fields: [
      { name: "Platinum", value: divisionRoster("Platinum") },
      { name: "Gold", value: divisionRoster("Gold") },
      { name: "Silver", value: divisionRoster("Silver") },
    ],
  },
]);

for (const division of ["Platinum", "Gold", "Silver"]) {
  await upsertManagedMessage(
    `${division.toLowerCase()}-fixtures`,
    `fc27-week-1-${division.toLowerCase()}`,
    [
      {
        title: `${division} — Week 1 fixtures`,
        color: gold,
        description: divisionFixtures(division),
        fields: [
          {
            name: "Deadline",
            value: "Sunday, 22 November 2026 at 23:59 CET",
          },
          {
            name: "Match format",
            value:
              "Online Friendlies · Real clubs · Six-minute halves · Normal speed · Professional difficulty",
          },
          {
            name: "Reporting",
            value: `The winner uses \`/fc27-report\`; the bot posts it in #${division.toLowerCase()}-results. For a draw, either player may report.`,
          },
        ],
      },
    ],
  );
}

await upsertManagedMessage("lol-1v1-rules", "lol-1v1-rules", [
  {
    title: "SAL League of Legends 1v1",
    color: purple,
    description:
      "A SAL adaptation of the Tyler1 All-Stars 1v1 format, played on the current live patch.",
    fields: [
      {
        name: "Tournament",
        value:
          "1v1 on Howling Abyss · Double elimination · Best-of-3 · Grand Final Best-of-5",
      },
      {
        name: "Win conditions",
        value:
          "Win a game by achieving First Blood, destroying the first enemy turret, or reaching 100 CS first.",
      },
      {
        name: "Champion select",
        value:
          "Blind Pick. Mirror matches are allowed. A champion that wins a game is locked for that winning player for the rest of the series; a losing champion may be selected again.",
      },
      {
        name: "Restrictions",
        value:
          "No recalls. Execute counts as a loss. Banned: Tryndamere, Lee Sin, Renekton, Qiyana and Akali; Demolish and Guardian's Horn are also prohibited.",
      },
      {
        name: "Scheduling and disputes",
        value:
          "Arrange series through Discord, report results with evidence, and raise connection or rules disputes with organisers promptly.",
      },
    ],
  },
]);

await upsertManagedMessage("lol-bracket", "lol-bracket", [
  {
    title: "LoL 1v1 bracket",
    color: purple,
    description:
      "The double-elimination bracket and match deadlines will be published here after registration closes. Tournament size and any byes will be confirmed before play begins.",
  },
]);

await upsertManagedMessage("archive-index", "archive-index", [
  {
    title: "SAL Legacy Archive",
    color: purple,
    description:
      "Historical tournament channels are preserved in private monthly categories for organiser reference.",
    fields: [
      {
        name: "2026 archive",
        value:
          "January · February · March · April · May · June\nMessages and attachments remain in their original channels.",
      },
    ],
  },
]);

const unresolved = season.players.filter(
  (player) => player.discordMatchStatus !== "matched",
);
await upsertManagedMessage("player-management", "fc27-import-status", [
  {
    title: "FC27 Season 1 registration import",
    color: unresolved.length === 0 ? green : gold,
    description: `${season.players.length} registrations imported. ${season.players.length - unresolved.length} Discord accounts matched automatically.`,
    fields: [
      {
        name: "Requires organiser review",
        value:
          unresolved.length > 0
            ? unresolved
                .map(
                  (player) =>
                    `**${player.discordUsername}** — ${player.discordMatchStatus}`,
                )
                .join("\n")
            : "None",
      },
    ],
  },
]);

await upsertManagedMessage("bot-logs", "migration-complete", [
  {
    title: "SAL Discord migration complete",
    color: green,
    description:
      "The English FC27, LoL, Community and Organiser structure is active. Historical channels were consolidated into private monthly archives without deleting messages or attachments.",
  },
]);

console.log("Managed Discord content published successfully.");
