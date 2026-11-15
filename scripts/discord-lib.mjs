import fs from "node:fs";
import path from "node:path";

const requiredEnvironmentVariables = [
  "DISCORD_BOT_TOKEN",
  "DISCORD_APPLICATION_ID",
  "DISCORD_GUILD_ID",
  "DISCORD_ORGANISER_ROLE_ID",
];

export const getDiscordConfig = () => {
  const missing = requiredEnvironmentVariables.filter(
    (name) => !process.env[name],
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing Discord environment variables: ${missing.join(", ")}`,
    );
  }

  return {
    token: process.env.DISCORD_BOT_TOKEN,
    applicationId: process.env.DISCORD_APPLICATION_ID,
    guildId: process.env.DISCORD_GUILD_ID,
    organiserRoleId: process.env.DISCORD_ORGANISER_ROLE_ID,
  };
};

export const discordRequest = async (route, options = {}, attempt = 0) => {
  const { token } = getDiscordConfig();
  const response = await fetch(`https://discord.com/api/v10${route}`, {
    ...options,
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "SAL-League-Manager (https://sal.gg, 1.0)",
      ...options.headers,
    },
  });

  if (response.status === 429 && attempt < 5) {
    const rateLimit = await response.json();
    const retryAfterMilliseconds = Math.ceil(
      Number(rateLimit.retry_after ?? 1) * 1000,
    );
    await new Promise((resolve) =>
      setTimeout(resolve, retryAfterMilliseconds + 100),
    );
    return discordRequest(route, options, attempt + 1);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord API ${response.status} on ${route}: ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const readDesiredStructure = () => {
  const structurePath = path.resolve(
    process.cwd(),
    "src",
    "data",
    "discord-server-structure.json",
  );
  return JSON.parse(fs.readFileSync(structurePath, "utf8"));
};

export const normalizeDiscordName = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

export const channelTypeName = (type) => {
  const names = {
    0: "text",
    2: "voice",
    4: "category",
    5: "announcement",
    13: "stage",
    15: "forum",
  };
  return names[type] ?? `type-${type}`;
};
