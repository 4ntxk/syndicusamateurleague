import { ChannelType } from "discord.js";

import {
  discordRequest,
  getDiscordConfig,
  normalizeDiscordName,
} from "./discord-lib.mjs";

const config = getDiscordConfig();
const confirmation = process.argv.find((argument) =>
  argument.startsWith("--confirm-layout="),
);

if (confirmation?.split("=")[1] !== config.guildId) {
  console.error(
    `Layout is locked. Run with --confirm-layout=${config.guildId}.`,
  );
  process.exit(1);
}

let channels = await discordRequest(`/guilds/${config.guildId}/channels`);
const category = (name) =>
  channels.find(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      normalizeDiscordName(channel.name) === normalizeDiscordName(name),
  );

const categoryRenames = [
  ["START HERE", "━━ 👋 START HERE ━━"],
  ["COMMUNITY", "━━ 💬 COMMUNITY ━━"],
  ["FC27 LEAGUE", "━━ ⚽ FC27 LEAGUE ━━"],
  ["FC27 — PLATINUM", "💎 FC27 — PLATINUM"],
  ["FC27 — GOLD", "🥇 FC27 — GOLD"],
  ["FC27 — SILVER", "🥈 FC27 — SILVER"],
  ["LOL 1V1", "━━ ⚔️ LOL 1V1 ━━"],
  ["ORGANISER AREA", "━━ 🛡️ ORGANISER AREA ━━"],
  ["LEGACY ARCHIVE", "━━ 🗂️ LEGACY ARCHIVE ━━"],
  ["ARCHIVE — JUNE 2026", "📦 ARCHIVE — JUNE 2026"],
  ["ARCHIVE — MAY 2026", "📦 ARCHIVE — MAY 2026"],
  ["ARCHIVE — APRIL 2026", "📦 ARCHIVE — APRIL 2026"],
  ["ARCHIVE — MARCH 2026", "📦 ARCHIVE — MARCH 2026"],
  ["ARCHIVE — FEBRUARY 2026", "📦 ARCHIVE — FEBRUARY 2026"],
  ["ARCHIVE — JANUARY 2026", "📦 ARCHIVE — JANUARY 2026"],
];

for (const [currentName, nextName] of categoryRenames) {
  const current = category(currentName);
  if (!current) throw new Error(`Category not found: ${currentName}`);
  if (current.name === nextName) continue;
  const updated = await discordRequest(`/channels/${current.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: nextName,
      reason: "Approved SAL visual layout cleanup",
    }),
  });
  channels = channels.map((channel) =>
    channel.id === updated.id ? updated : channel,
  );
  console.log(`[layout] renamed category: ${nextName}`);
}

const startHere = category("START HERE");
const community = category("COMMUNITY");
const fc27 = category("FC27 LEAGUE");
const organiser = category("ORGANISER AREA");
const legacy = category("LEGACY ARCHIVE");

const findChild = (parent, name, type) =>
  channels.find(
    (channel) =>
      channel.parent_id === parent.id &&
      channel.name === name &&
      (type === undefined || channel.type === type),
  );

const moveToLegacy = async (channel, nextName) => {
  if (!channel) return;
  await discordRequest(`/guilds/${config.guildId}/channels`, {
    method: "PATCH",
    body: JSON.stringify([
      {
        id: channel.id,
        parent_id: legacy.id,
        lock_permissions: true,
      },
    ]),
  });
  const updated = await discordRequest(`/channels/${channel.id}`);
  const renamed = await discordRequest(`/channels/${updated.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: nextName,
      reason: "Preserve superseded channel in private legacy archive",
    }),
  });
  channels = channels.map((candidate) =>
    candidate.id === renamed.id ? renamed : candidate,
  );
  console.log(`[layout] archived channel: ${nextName}`);
};

await moveToLegacy(
  findChild(startHere, "announcements", ChannelType.GuildText) ??
    findChild(legacy, "announcements", ChannelType.GuildText),
  "legacy-start-announcements",
);
await moveToLegacy(
  findChild(fc27, "💬・chat-league-general"),
  "legacy-fc27-general-chat",
);
await moveToLegacy(
  findChild(fc27, "📸・league-week-1-results"),
  "legacy-fc27-week-1-results",
);
await moveToLegacy(
  findChild(organiser, "general", ChannelType.GuildText),
  "legacy-organiser-general",
);

const renameChannel = async (parent, currentName, nextName, type) => {
  const current = findChild(parent, currentName, type);
  if (!current || current.name === nextName) return;
  const updated = await discordRequest(`/channels/${current.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: nextName,
      reason: "SAL channel layout cleanup",
    }),
  });
  channels = channels.map((channel) =>
    channel.id === updated.id ? updated : channel,
  );
  console.log(`[layout] renamed channel: ${nextName}`);
};

await renameChannel(
  startHere,
  "❓questions",
  "questions",
  ChannelType.GuildText,
);
await renameChannel(
  fc27,
  "🔊・league-general-voice",
  "fc27-general-voice",
  ChannelType.GuildVoice,
);
await renameChannel(
  organiser,
  "Admin",
  "organiser-voice",
  ChannelType.GuildVoice,
);

const emptyVoiceCategory = category("Voice channels");
if (emptyVoiceCategory) {
  const children = channels.filter(
    (channel) => channel.parent_id === emptyVoiceCategory.id,
  );
  if (children.length !== 0) {
    throw new Error("Refusing to remove non-empty Voice channels category.");
  }
  await discordRequest(`/channels/${emptyVoiceCategory.id}`, {
    method: "DELETE",
  });
  channels = channels.filter((channel) => channel.id !== emptyVoiceCategory.id);
  console.log("[layout] removed empty category: Voice channels");
}

const categoryOrder = [
  "START HERE",
  "COMMUNITY",
  "FC27 LEAGUE",
  "FC27 — PLATINUM",
  "FC27 — GOLD",
  "FC27 — SILVER",
  "LOL 1V1",
  "ORGANISER AREA",
  "LEGACY ARCHIVE",
  "ARCHIVE — JUNE 2026",
  "ARCHIVE — MAY 2026",
  "ARCHIVE — APRIL 2026",
  "ARCHIVE — MARCH 2026",
  "ARCHIVE — FEBRUARY 2026",
  "ARCHIVE — JANUARY 2026",
];
const categoryPositions = categoryOrder.map((name, position) => {
  const target = category(name);
  if (!target) throw new Error(`Category missing during ordering: ${name}`);
  return { id: target.id, position };
});
await discordRequest(`/guilds/${config.guildId}/channels`, {
  method: "PATCH",
  body: JSON.stringify(categoryPositions),
});

const channelOrders = [
  [
    startHere,
    [
      "welcome",
      "rules",
      "announcements",
      "how-to-play",
      "roles",
      "bot-commands",
      "questions",
    ],
  ],
  [
    community,
    [
      "general-chat",
      "fc27-chat",
      "lol-chat",
      "looking-for-game",
      "clips-and-highlights",
      "suggestions",
      "general-voice",
    ],
  ],
  [
    fc27,
    [
      "fc27-announcements",
      "fc27-rules",
      "fc27-schedule",
      "fc27-season-standings",
      "fc27-results",
      "fc27-support",
      "fc27-general-voice",
    ],
  ],
  [
    organiser,
    [
      "organiser-chat",
      "player-management",
      "match-review",
      "disputes",
      "walkover-requests",
      "suggestions-review",
      "bot-logs",
      "organiser-voice",
    ],
  ],
];

for (const divisionName of ["platinum", "gold", "silver"]) {
  const parent = category(`FC27 — ${divisionName.toUpperCase()}`);
  channelOrders.push([
    parent,
    [
      `${divisionName}-fixtures`,
      `${divisionName}-results`,
      `${divisionName}-chat`,
      `${divisionName}-voice`,
    ],
  ]);
}

for (const [parent, order] of channelOrders) {
  const updates = order
    .map((name, position) => {
      const target = channels.find(
        (channel) => channel.parent_id === parent.id && channel.name === name,
      );
      return target ? { id: target.id, position } : null;
    })
    .filter(Boolean);
  await discordRequest(`/guilds/${config.guildId}/channels`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

console.log("[layout] visual ordering completed");
