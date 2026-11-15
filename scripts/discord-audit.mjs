import fs from "node:fs";
import path from "node:path";

import {
  channelTypeName,
  discordRequest,
  getDiscordConfig,
  normalizeDiscordName,
  readDesiredStructure,
} from "./discord-lib.mjs";

const config = getDiscordConfig();
const desired = readDesiredStructure();

const [bot, guild, channels, roles, members] = await Promise.all([
  discordRequest("/users/@me"),
  discordRequest(`/guilds/${config.guildId}`),
  discordRequest(`/guilds/${config.guildId}/channels`),
  discordRequest(`/guilds/${config.guildId}/roles`),
  discordRequest(`/guilds/${config.guildId}/members?limit=1000`),
]);

const categories = channels
  .filter((channel) => channel.type === 4)
  .sort((a, b) => a.position - b.position);
const currentRoleNames = new Map(
  roles.map((role) => [normalizeDiscordName(role.name), role]),
);

const findByNameOrAlias = (items, name, aliases = []) => {
  const acceptedNames = new Set(
    [name, ...aliases].map((value) => normalizeDiscordName(value)),
  );
  return items.find((item) =>
    acceptedNames.has(normalizeDiscordName(item.name)),
  );
};

const desiredChannelTypeCodes = {
  text: [0],
  voice: [2],
  announcement: [5],
  forum: [15],
};

const sapphire = members.find(
  (member) =>
    member.user?.bot &&
    normalizeDiscordName(member.user.username).includes("sapphire"),
);
const sapphireRoles = sapphire
  ? roles
      .filter((role) => sapphire.roles.includes(role.id))
      .map((role) => role.name)
  : [];
const sapphireOverwrites = sapphire
  ? channels.filter((channel) =>
      channel.permission_overwrites?.some(
        (overwrite) =>
          overwrite.id === sapphire.user.id ||
          sapphire.roles.includes(overwrite.id),
      ),
    )
  : [];

const desiredCategories = desired.categories.map((category) => {
  const existingCategory = findByNameOrAlias(
    categories,
    category.name,
    category.aliases,
  );

  return {
    name: category.name,
    currentName: existingCategory?.name ?? null,
    status: existingCategory
      ? normalizeDiscordName(existingCategory.name) ===
        normalizeDiscordName(category.name)
        ? "exists"
        : "rename"
      : "create",
    channels: category.channels.map((channel) => {
      const children = existingCategory
        ? channels.filter(
            (candidate) =>
              candidate.parent_id === existingCategory.id &&
              desiredChannelTypeCodes[channel.type]?.includes(candidate.type),
          )
        : [];
      const existingChannel =
        findByNameOrAlias(children, channel.name, channel.aliases) ??
        findByNameOrAlias(
          channels.filter((candidate) =>
            desiredChannelTypeCodes[channel.type]?.includes(candidate.type),
          ),
          channel.name,
          channel.aliases,
        );
      const sameCategory = existingChannel?.parent_id === existingCategory?.id;
      const sameName =
        existingChannel &&
        normalizeDiscordName(existingChannel.name) ===
          normalizeDiscordName(channel.name);

      let status = "create";
      if (existingChannel && sameCategory && sameName) status = "exists";
      else if (existingChannel && sameCategory) status = "rename";
      else if (existingChannel) status = "move-and-rename";

      return {
        ...channel,
        currentName: existingChannel?.name ?? null,
        status,
      };
    }),
  };
});

const desiredRoles = desired.roles.map((name) => ({
  name,
  status: currentRoleNames.has(normalizeDiscordName(name))
    ? "exists"
    : "create",
}));

const snapshot = {
  generatedAt: new Date().toISOString(),
  bot: { id: bot.id, username: bot.username },
  guild: { id: guild.id, name: guild.name },
  counts: {
    members: members.length,
    channels: channels.length,
    categories: categories.length,
    roles: roles.length,
  },
  desiredRoles,
  desiredCategories,
  sapphire: sapphire
    ? {
        id: sapphire.user.id,
        username: sapphire.user.username,
        roles: sapphireRoles,
        permissionOverwriteChannels: sapphireOverwrites.map(
          (channel) => channel.name,
        ),
      }
    : null,
  currentCategories: categories.map((category) => ({
    name: category.name,
    channels: channels
      .filter((channel) => channel.parent_id === category.id)
      .sort((a, b) => a.position - b.position)
      .map((channel) => ({
        name: channel.name,
        type: channelTypeName(channel.type),
      })),
  })),
  uncategorizedChannels: channels
    .filter((channel) => channel.type !== 4 && !channel.parent_id)
    .map((channel) => ({
      name: channel.name,
      type: channelTypeName(channel.type),
    })),
};

const outputDirectory = path.resolve(process.cwd(), ".discord-audit");
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, "snapshot.json"),
  `${JSON.stringify(snapshot, null, 2)}\n`,
);

const createRoles = desiredRoles.filter((role) => role.status === "create");
const createCategories = desiredCategories.filter(
  (category) => category.status === "create",
);
const renameCategories = desiredCategories.filter(
  (category) => category.status === "rename",
);
const createChannels = desiredCategories.flatMap((category) =>
  category.channels
    .filter((channel) => channel.status === "create")
    .map((channel) => ({ ...channel, category: category.name })),
);
const reuseChannels = desiredCategories.flatMap((category) =>
  category.channels
    .filter(
      (channel) =>
        channel.status === "rename" || channel.status === "move-and-rename",
    )
    .map((channel) => ({ ...channel, category: category.name })),
);

const report = `# Discord migration plan

Generated: ${snapshot.generatedAt}

## Safety status

- Read-only audit completed successfully.
- No channels, categories, roles, permissions or messages were changed.
- Existing tournament archives are preserved.
- No automatic deletion is included in the migration.
- Sapphire remains installed until replacement features pass verification.

## Current server

- Server: ${snapshot.guild.name}
- Members visible to the bot: ${snapshot.counts.members}
- Channels: ${snapshot.counts.channels}
- Categories: ${snapshot.counts.categories}
- Roles: ${snapshot.counts.roles}

## Planned additions

### Roles to create

${createRoles.map((role) => `- ${role.name}`).join("\n") || "- None"}

### Categories to create

${createCategories.map((category) => `- ${category.name}`).join("\n") || "- None"}

### Categories to reuse and rename

${renameCategories.map((category) => `- ${category.currentName} → ${category.name}`).join("\n") || "- None"}

### Channels to create

${createChannels.map((channel) => `- ${channel.category} / #${channel.name} (${channel.type})`).join("\n") || "- None"}

### Existing channels to reuse

${reuseChannels.map((channel) => `- #${channel.currentName} → ${channel.category} / #${channel.name}`).join("\n") || "- None"}

## Existing areas requiring organiser review

These areas are deliberately not moved or archived automatically:

${snapshot.currentCategories.map((category) => `- ${category.name} (${category.channels.length} channels)`).join("\n")}

## Sapphire replacement gate

${
  snapshot.sapphire
    ? `Sapphire is present with roles: ${snapshot.sapphire.roles.join(", ") || "none beyond @everyone"}. Direct permission references were found in ${snapshot.sapphire.permissionOverwriteChannels.length} channel(s). Remove Sapphire only after welcome, role assignment, logging and moderation dependencies have been checked.`
    : "Sapphire was not found during this audit."
}

## Proposed migration sequence

1. Create SAL league roles beneath the SAL League Manager role.
2. Create the new English categories and channels without touching legacy areas.
3. Configure the private ORGANISER AREA for the Admin role.
4. Publish FC27 and LoL rules, schedules and result workflows.
5. Import and match the 13 FC27 registrations to Discord members.
6. Verify welcome, role assignment and logging replacements.
7. Move approved historical categories under LEGACY ARCHIVE in a separate reviewed operation.
8. Remove Sapphire manually only after the replacement checklist passes.
`;

const reportPath = path.resolve(
  process.cwd(),
  "docs",
  "discord-migration-plan.md",
);
fs.writeFileSync(reportPath, report, "utf8");

console.log(`Discord audit completed for ${guild.name}.`);
console.log(
  `Snapshot: ${path.relative(process.cwd(), path.join(outputDirectory, "snapshot.json"))}`,
);
console.log(`Migration plan: ${path.relative(process.cwd(), reportPath)}`);
console.log(
  `Planned: ${createRoles.length} role(s), ${createCategories.length} new and ${renameCategories.length} reused categories, ${createChannels.length} new and ${reuseChannels.length} reused channel(s).`,
);
