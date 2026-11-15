import fs from "node:fs";
import path from "node:path";

const dataDirectory = path.resolve(process.cwd(), "src", "data");
const privateSeason = JSON.parse(
  fs.readFileSync(
    path.join(dataDirectory, "fc27-season-1-players.json"),
    "utf8",
  ),
);
const privateWeek = JSON.parse(
  fs.readFileSync(
    path.join(dataDirectory, "fc27-season-1-week-1.json"),
    "utf8",
  ),
);

const publicSeason = {
  id: privateSeason.id,
  status: privateSeason.status,
  startsAt: privateSeason.startsAt,
  endsAt: privateSeason.endsAt,
  players: privateSeason.players.map((player) => ({
    seed: player.seed,
    division: player.division,
    discordUsername: player.discordUsername,
    platform: player.platform,
  })),
};

const publicWeek = {
  seasonId: privateWeek.seasonId,
  week: privateWeek.week,
  startsAt: privateWeek.startsAt,
  deadlineAt: privateWeek.deadlineAt,
  fixtures: privateWeek.fixtures.map((fixture) => ({
    id: fixture.id,
    division: fixture.division,
    leg: fixture.leg,
    homeDiscordUsername: fixture.homeDiscordUsername,
    awayDiscordUsername: fixture.awayDiscordUsername,
    status: fixture.status,
  })),
};

fs.writeFileSync(
  path.join(dataDirectory, "fc27-season-1-public.json"),
  `${JSON.stringify(publicSeason, null, 2)}\n`,
  "utf8",
);
fs.writeFileSync(
  path.join(dataDirectory, "fc27-season-1-week-1-public.json"),
  `${JSON.stringify(publicWeek, null, 2)}\n`,
  "utf8",
);

console.log("Generated privacy-safe FC27 public data.");
