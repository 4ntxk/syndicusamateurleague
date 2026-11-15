import fs from "node:fs";
import path from "node:path";

import { parse } from "csv-parse/sync";

import {
  discordRequest,
  getDiscordConfig,
  normalizeDiscordName,
} from "./discord-lib.mjs";

const config = getDiscordConfig();
const registrationPath = path.resolve(
  process.cwd(),
  "docs",
  "SAL League Registration (Odpowiedzi) - Liczba odpowiedzi_ 1.csv",
);
const outputPath = path.resolve(
  process.cwd(),
  "src",
  "data",
  "fc27-season-1-players.json",
);

const rawCsv = fs.readFileSync(registrationPath, "utf8");
const registrations = parse(rawCsv, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

const divisionField =
  "What is your current Division in EA SPORTS FC 27 Ultimate Team?";

const rankValue = (division) => {
  if (/elite/i.test(division)) return 0;
  const match = division.match(/division\s+(\d+)/i);
  return match ? Number(match[1]) : 99;
};

const members = await discordRequest(
  `/guilds/${config.guildId}/members?limit=1000`,
);
const roles = await discordRequest(`/guilds/${config.guildId}/roles`);

const candidatesFor = (discordUsername) => {
  const expected = normalizeDiscordName(discordUsername);
  return members.filter((member) => {
    const candidateNames = [
      member.user?.username,
      member.user?.global_name,
      member.nick,
    ].filter(Boolean);
    return candidateNames.some(
      (candidate) => normalizeDiscordName(candidate) === expected,
    );
  });
};

const sortedRegistrations = registrations
  .map((registration, registrationIndex) => ({
    registration,
    registrationIndex,
    rank: rankValue(registration[divisionField]),
  }))
  .sort((left, right) =>
    left.rank === right.rank
      ? left.registrationIndex - right.registrationIndex
      : left.rank - right.rank,
  );

const divisionForIndex = (index) => {
  if (index < 4) return "Platinum";
  if (index < 8) return "Gold";
  return "Silver";
};

const players = sortedRegistrations.map(({ registration, rank }, index) => {
  const discordUsername = registration["Discord Username / Discord ID"];
  const matches = candidatesFor(discordUsername);

  return {
    seed: index + 1,
    division: divisionForIndex(index),
    declaredRivalsDivision: registration[divisionField],
    declaredRivalsDivisionValue: rank,
    discordUsername,
    discordUserId: matches.length === 1 ? matches[0].user.id : null,
    discordMatchStatus:
      matches.length === 1
        ? "matched"
        : matches.length === 0
          ? "not-found"
          : "ambiguous",
    eaId: registration["EA ID"],
    platform: registration.Platform,
    country: registration["What country are you from?"],
  };
});

const season = {
  id: "fc27-season-1",
  status: "calibration",
  startsAt: "2026-11-16",
  endsAt: "2026-12-13",
  players,
};

fs.writeFileSync(outputPath, `${JSON.stringify(season, null, 2)}\n`, "utf8");

const matched = players.filter(
  (player) => player.discordMatchStatus === "matched",
);
const unresolved = players.filter(
  (player) => player.discordMatchStatus !== "matched",
);

console.log(`Imported ${players.length} FC27 Season 1 registrations.`);
console.log(`Discord matches: ${matched.length}/${players.length}.`);
console.log(
  `Divisions: Platinum ${players.filter((player) => player.division === "Platinum").length}, Gold ${players.filter((player) => player.division === "Gold").length}, Silver ${players.filter((player) => player.division === "Silver").length}.`,
);

if (unresolved.length > 0) {
  console.log("Unresolved Discord accounts:");
  for (const player of unresolved) {
    console.log(`- ${player.discordUsername}: ${player.discordMatchStatus}`);
  }
}

const roleConfirmation = process.argv.find((argument) =>
  argument.startsWith("--apply-roles="),
);

if (roleConfirmation?.split("=")[1] === config.guildId) {
  const roleByName = new Map(roles.map((role) => [role.name, role]));
  const fc27Role = roleByName.get("FC27 Player");

  if (!fc27Role) {
    throw new Error("FC27 Player role was not found.");
  }

  for (const player of matched) {
    const divisionRole = roleByName.get(player.division);
    if (!divisionRole) {
      throw new Error(`${player.division} role was not found.`);
    }

    for (const roleId of [fc27Role.id, divisionRole.id]) {
      await discordRequest(
        `/guilds/${config.guildId}/members/${player.discordUserId}/roles/${roleId}`,
        { method: "PUT" },
      );
    }
    console.log(
      `Assigned FC27 Player + ${player.division}: ${player.discordUsername}`,
    );
  }
}
