import { ChannelType, PermissionFlagsBits } from "discord.js";

import {
  discordRequest,
  getDiscordConfig,
  normalizeDiscordName,
  readDesiredStructure,
} from "./discord-lib.mjs";

const config = getDiscordConfig();
const desired = readDesiredStructure();
const confirmation = process.argv.find((argument) =>
  argument.startsWith("--confirm="),
);
const confirmedGuildId = confirmation?.split("=")[1];

if (confirmedGuildId !== config.guildId) {
  console.error(
    `Migration is locked. Run with --confirm=${config.guildId} after reviewing docs/discord-migration-plan.md.`,
  );
  process.exit(1);
}

const channelTypes = {
  text: ChannelType.GuildText,
  voice: ChannelType.GuildVoice,
  announcement: ChannelType.GuildAnnouncement,
  forum: ChannelType.GuildForum,
};

const findByNameOrAlias = (items, name, aliases = []) => {
  const acceptedNames = new Set(
    [name, ...aliases].map((value) => normalizeDiscordName(value)),
  );
  return items.find((item) =>
    acceptedNames.has(normalizeDiscordName(item.name)),
  );
};

const writeLog = (message) => console.log(`[migration] ${message}`);

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
  throw new Error(
    "Could not resolve @everyone, the configured organiser role or the bot role.",
  );
}

for (const roleName of desired.roles) {
  if (findByNameOrAlias(roles, roleName)) {
    writeLog(`role exists: ${roleName}`);
    continue;
  }

  const role = await discordRequest(`/guilds/${config.guildId}/roles`, {
    method: "POST",
    body: JSON.stringify({
      name: roleName,
      mentionable: false,
      hoist: false,
      permissions: "0",
      reason: "Approved SAL Discord migration",
    }),
  });
  roles.push(role);
  writeLog(`created role: ${roleName}`);
}

for (
  let categoryIndex = 0;
  categoryIndex < desired.categories.length;
  categoryIndex += 1
) {
  const categoryDefinition = desired.categories[categoryIndex];
  let categories = channels.filter(
    (channel) => channel.type === ChannelType.GuildCategory,
  );
  let category = findByNameOrAlias(
    categories,
    categoryDefinition.name,
    categoryDefinition.aliases,
  );

  const privatePermissionOverwrites = categoryDefinition.private
    ? [
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
      ]
    : undefined;

  if (!category) {
    category = await discordRequest(`/guilds/${config.guildId}/channels`, {
      method: "POST",
      body: JSON.stringify({
        name: categoryDefinition.name,
        type: ChannelType.GuildCategory,
        position: categoryIndex,
        permission_overwrites: privatePermissionOverwrites,
        reason: "Approved SAL Discord migration",
      }),
    });
    channels.push(category);
    writeLog(`created category: ${categoryDefinition.name}`);
  } else {
    const needsRename = category.name !== categoryDefinition.name;
    const needsPrivacyUpdate = categoryDefinition.private;

    if (needsRename || needsPrivacyUpdate) {
      category = await discordRequest(`/channels/${category.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...(needsRename ? { name: categoryDefinition.name } : {}),
          ...(needsPrivacyUpdate
            ? { permission_overwrites: privatePermissionOverwrites }
            : {}),
          reason: "Approved SAL Discord migration",
        }),
      });
      channels = channels.map((candidate) =>
        candidate.id === category.id ? category : candidate,
      );
      writeLog(
        `${needsRename ? "renamed" : "updated private permissions for"} category: ${categoryDefinition.name}`,
      );
    } else {
      writeLog(`category exists: ${categoryDefinition.name}`);
    }
  }

  for (
    let channelIndex = 0;
    channelIndex < categoryDefinition.channels.length;
    channelIndex += 1
  ) {
    const channelDefinition = categoryDefinition.channels[channelIndex];
    const desiredType = channelTypes[channelDefinition.type];
    const categoryChildren = channels.filter(
      (candidate) =>
        candidate.parent_id === category.id && candidate.type === desiredType,
    );
    let channel =
      findByNameOrAlias(
        categoryChildren,
        channelDefinition.name,
        channelDefinition.aliases,
      ) ??
      findByNameOrAlias(
        channels.filter((candidate) => candidate.type === desiredType),
        channelDefinition.name,
        channelDefinition.aliases,
      );

    if (!channel) {
      channel = await discordRequest(`/guilds/${config.guildId}/channels`, {
        method: "POST",
        body: JSON.stringify({
          name: channelDefinition.name,
          type: desiredType,
          parent_id: category.id,
          position: channelIndex,
          reason: "Approved SAL Discord migration",
        }),
      });
      channels.push(channel);
      writeLog(
        `created channel: ${categoryDefinition.name} / ${channelDefinition.name}`,
      );
      continue;
    }

    const needsRename = channel.name !== channelDefinition.name;
    const needsMove = channel.parent_id !== category.id;

    if (needsRename || needsMove) {
      channel = await discordRequest(`/channels/${channel.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...(needsRename ? { name: channelDefinition.name } : {}),
          ...(needsMove ? { parent_id: category.id } : {}),
          reason: "Approved SAL Discord migration",
        }),
      });
      channels = channels.map((candidate) =>
        candidate.id === channel.id ? channel : candidate,
      );
      writeLog(
        `${needsMove ? "moved" : "renamed"} channel: ${categoryDefinition.name} / ${channelDefinition.name}`,
      );
    } else {
      writeLog(
        `channel exists: ${categoryDefinition.name} / ${channelDefinition.name}`,
      );
    }
  }
}

writeLog("completed without deletion operations");
