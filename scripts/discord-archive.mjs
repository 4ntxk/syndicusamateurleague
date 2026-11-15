import { ChannelType, PermissionFlagsBits } from "discord.js";

import {
  discordRequest,
  getDiscordConfig,
  normalizeDiscordName,
} from "./discord-lib.mjs";

const config = getDiscordConfig();
const confirmation = process.argv.find((argument) =>
  argument.startsWith("--confirm-archive="),
);

if (confirmation?.split("=")[1] !== config.guildId) {
  console.error(
    `Archive migration is locked. Run with --confirm-archive=${config.guildId}.`,
  );
  process.exit(1);
}

const archiveMonths = [
  {
    target: "ARCHIVE — JANUARY 2026",
    sources: [
      { names: ["ARCHIWUM -🏅SAL CUP Online STYCZEŃ#1"], prefix: "cup-1" },
      { names: ["Archiwum STYCZEŃ#1 -🎖️Playoffs"], prefix: "playoffs" },
      { names: ["Archiwum STYCZEŃ#1 - Grupa A"], prefix: "group-a" },
      { names: ["Archiwum STYCZEŃ#1 - Grupa B"], prefix: "group-b" },
      { names: ["Archiwum STYCZEŃ#1 - Grupa C"], prefix: "group-c" },
      { names: ["Archiwum STYCZEŃ#1 - Grupa D"], prefix: "group-d" },
      { names: ["Archiwum STYCZEŃ#1 - Grupa E"], prefix: "group-e" },
      { names: ["Archiwum STYCZEŃ#1 - Grupa F"], prefix: "group-f" },
    ],
  },
  {
    target: "ARCHIVE — FEBRUARY 2026",
    sources: [
      { names: ["ARCHIWUM -🏅SAL CUP Online LUTY#1"], prefix: "cup-1" },
    ],
  },
  {
    target: "ARCHIVE — MARCH 2026",
    sources: [
      { names: ["ARCHIWUM 🏅SAL CUP Online MARZEC#1"], prefix: "cup-1" },
    ],
  },
  {
    target: "ARCHIVE — APRIL 2026",
    sources: [
      { names: ["ARCHIWUM -🏅S1 SAL CUP Online APRIL#1"], prefix: "cup-1" },
    ],
  },
  {
    target: "ARCHIVE — MAY 2026",
    sources: [
      { names: ["ARCHIWUM - 🏅S1 SAL CUP Online MAY#2"], prefix: "cup-2" },
      { names: ["ARCHIWUM - 🏅S1 SAL CUP Online MAY#1"], prefix: "cup-1" },
    ],
  },
  {
    target: "ARCHIVE — JUNE 2026",
    sources: [
      { names: ["🏅S1 SAL CUP Online JUNE#1"], prefix: "cup-1" },
      { names: ["🥇SAL Cup Mundial"], prefix: "world-cup" },
    ],
  },
];

const englishSlug = (name) => {
  const replacements = new Map([
    ["turniej", "tournament"],
    ["turniejowy", "tournament"],
    ["ogolne", "general"],
    ["ogolny", "general"],
    ["ogloszenia", "announcements"],
    ["pytania", "questions"],
    ["wyniki", "results"],
    ["mecz", "match"],
    ["grupa", "group"],
    ["glosowy", "voice"],
    ["terminy", "schedule"],
    ["playoffy", "playoffs"],
  ]);

  return normalizeDiscordName(name)
    .split("-")
    .map((part) => replacements.get(part) ?? part)
    .join("-");
};

const findCategory = (categories, acceptedNames) => {
  const normalized = new Set(acceptedNames.map(normalizeDiscordName));
  return categories.find((category) =>
    normalized.has(normalizeDiscordName(category.name)),
  );
};

let roles = await discordRequest(`/guilds/${config.guildId}/roles`);
let channels = await discordRequest(`/guilds/${config.guildId}/channels`);

const everyoneRole = roles.find((role) => role.id === config.guildId);
const organiserRole = roles.find((role) => role.id === config.organiserRoleId);
const botRole = roles.find(
  (role) =>
    role.tags?.bot_id === config.applicationId ||
    normalizeDiscordName(role.name) ===
      normalizeDiscordName("SAL League Manager"),
);

if (!everyoneRole || !organiserRole || !botRole) {
  throw new Error("Required Discord roles could not be resolved.");
}

const privatePermissionOverwrites = [
  {
    id: everyoneRole.id,
    type: 0,
    deny: PermissionFlagsBits.ViewChannel.toString(),
    allow: "0",
  },
  {
    id: organiserRole.id,
    type: 0,
    allow: (
      PermissionFlagsBits.ViewChannel |
      PermissionFlagsBits.SendMessages |
      PermissionFlagsBits.ReadMessageHistory |
      PermissionFlagsBits.AttachFiles |
      PermissionFlagsBits.EmbedLinks
    ).toString(),
    deny: "0",
  },
  {
    id: botRole.id,
    type: 0,
    allow: (
      PermissionFlagsBits.ViewChannel |
      PermissionFlagsBits.ManageChannels |
      PermissionFlagsBits.SendMessages |
      PermissionFlagsBits.ManageMessages |
      PermissionFlagsBits.ReadMessageHistory |
      PermissionFlagsBits.AttachFiles |
      PermissionFlagsBits.EmbedLinks
    ).toString(),
    deny: "0",
  },
];

const legacyIndex = findCategory(
  channels.filter((channel) => channel.type === ChannelType.GuildCategory),
  ["LEGACY ARCHIVE"],
);

if (!legacyIndex) {
  throw new Error("LEGACY ARCHIVE category was not found.");
}

let archiveIndexChannel = channels.find(
  (channel) =>
    channel.parent_id === legacyIndex.id && channel.name === "archive-index",
);

if (!archiveIndexChannel) {
  archiveIndexChannel = await discordRequest(
    `/guilds/${config.guildId}/channels`,
    {
      method: "POST",
      body: JSON.stringify({
        name: "archive-index",
        type: ChannelType.GuildText,
        parent_id: legacyIndex.id,
        permission_overwrites: privatePermissionOverwrites,
        reason: "Approved SAL archive consolidation",
      }),
    },
  );
  channels.push(archiveIndexChannel);
  console.log("[archive] created LEGACY ARCHIVE / archive-index");
}

const deletedCategoryNames = [];

for (let monthIndex = 0; monthIndex < archiveMonths.length; monthIndex += 1) {
  const month = archiveMonths[monthIndex];
  let categories = channels.filter(
    (channel) => channel.type === ChannelType.GuildCategory,
  );
  let target = findCategory(categories, [month.target]);

  if (!target) {
    const reusableSource = month.sources
      .map((source) => findCategory(categories, source.names))
      .find(Boolean);

    if (reusableSource) {
      target = await discordRequest(`/channels/${reusableSource.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: month.target,
          permission_overwrites: privatePermissionOverwrites,
          reason: "Approved SAL archive consolidation",
        }),
      });
      channels = channels.map((channel) =>
        channel.id === target.id ? target : channel,
      );
      console.log(`[archive] renamed category to ${month.target}`);
    } else {
      target = await discordRequest(`/guilds/${config.guildId}/channels`, {
        method: "POST",
        body: JSON.stringify({
          name: month.target,
          type: ChannelType.GuildCategory,
          permission_overwrites: privatePermissionOverwrites,
          reason: "Approved SAL archive consolidation",
        }),
      });
      channels.push(target);
      console.log(`[archive] created category ${month.target}`);
    }
  } else {
    target = await discordRequest(`/channels/${target.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        permission_overwrites: privatePermissionOverwrites,
        reason: "Approved SAL archive consolidation",
      }),
    });
    channels = channels.map((channel) =>
      channel.id === target.id ? target : channel,
    );
  }

  const monthPrefixes = month.sources.map((source) => `${source.prefix}-`);

  for (const sourceDefinition of month.sources) {
    categories = channels.filter(
      (channel) => channel.type === ChannelType.GuildCategory,
    );
    const source = findCategory(categories, [
      ...sourceDefinition.names,
      ...(sourceDefinition.names.some(
        (name) =>
          normalizeDiscordName(name) === normalizeDiscordName(target.name),
      )
        ? [target.name]
        : []),
    ]);
    const sourceId = source?.id ?? target.id;
    const sourceChannels = channels.filter(
      (channel) => channel.parent_id === sourceId && channel.type !== 4,
    );

    for (const channel of sourceChannels) {
      if (channel.id === archiveIndexChannel.id) continue;

      const alreadyPrefixed = monthPrefixes.some((prefix) =>
        channel.name.startsWith(prefix),
      );
      const nextName = alreadyPrefixed
        ? channel.name
        : `${sourceDefinition.prefix}-${englishSlug(channel.name)}`.slice(
            0,
            100,
          );

      const updatedChannel = await discordRequest(`/channels/${channel.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: nextName,
          parent_id: target.id,
          permission_overwrites: privatePermissionOverwrites,
          reason: "Approved SAL archive consolidation",
        }),
      });
      channels = channels.map((candidate) =>
        candidate.id === channel.id ? updatedChannel : candidate,
      );
    }

    if (source && source.id !== target.id) {
      const remainingChildren = channels.filter(
        (channel) => channel.parent_id === source.id,
      );
      if (remainingChildren.length > 0) {
        throw new Error(
          `Refusing to delete non-empty category ${source.name}; ${remainingChildren.length} child channel(s) remain.`,
        );
      }

      await discordRequest(`/channels/${source.id}`, { method: "DELETE" });
      channels = channels.filter((channel) => channel.id !== source.id);
      deletedCategoryNames.push(source.name);
      console.log(`[archive] removed empty category ${source.name}`);
    }
  }

  const monthChannelCount = channels.filter(
    (channel) => channel.parent_id === target.id,
  ).length;
  if (monthChannelCount > 50) {
    throw new Error(
      `${month.target} exceeds Discord's 50-channel category limit (${monthChannelCount}).`,
    );
  }
  console.log(`[archive] ${month.target}: ${monthChannelCount} channel(s)`);
}

console.log(
  `[archive] completed; removed ${deletedCategoryNames.length} empty source category/categories`,
);
