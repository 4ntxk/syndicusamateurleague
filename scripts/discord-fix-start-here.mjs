import { PermissionFlagsBits } from "discord.js";

import {
  discordRequest,
  getDiscordConfig,
  normalizeDiscordName,
} from "./discord-lib.mjs";

const config = getDiscordConfig();
let channels = await discordRequest(`/guilds/${config.guildId}/channels`);
const roles = await discordRequest(`/guilds/${config.guildId}/roles`);

const findCategory = (name) =>
  channels.find(
    (channel) =>
      channel.type === 4 &&
      normalizeDiscordName(channel.name) === normalizeDiscordName(name),
  );
const startHere = findCategory("START HERE");
const stagingCategory = findCategory("COMMUNITY");
const botAccessRole = roles.find(
  (role) => normalizeDiscordName(role.name) === "sal-bot-access",
);

if (!startHere || !stagingCategory || !botAccessRole) {
  throw new Error("START HERE, COMMUNITY or SAL Bot Access was not found.");
}

const allow = (
  PermissionFlagsBits.ViewChannel |
  PermissionFlagsBits.SendMessages |
  PermissionFlagsBits.ReadMessageHistory |
  PermissionFlagsBits.EmbedLinks |
  PermissionFlagsBits.AttachFiles
).toString();

for (const channelName of [
  "welcome",
  "rules",
  "how-to-play",
  "roles",
  "bot-commands",
]) {
  let channel = channels.find(
    (candidate) =>
      candidate.name === channelName && candidate.parent_id === startHere.id,
  );
  if (!channel) throw new Error(`#${channelName} was not found in START HERE.`);

  channel = await discordRequest(`/channels/${channel.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      parent_id: stagingCategory.id,
      reason: "Prepare SAL-managed START HERE publishing access",
    }),
  });

  await discordRequest(
    `/channels/${channel.id}/permissions/${botAccessRole.id}`,
    {
      method: "PUT",
      body: JSON.stringify({ type: 0, allow, deny: "0" }),
    },
  );

  channel = await discordRequest(`/channels/${channel.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      parent_id: startHere.id,
      reason: "Restore START HERE channel after access repair",
    }),
  });
  channels = channels.map((candidate) =>
    candidate.id === channel.id ? channel : candidate,
  );
  console.log(`[start-here] repaired #${channelName}`);
}
