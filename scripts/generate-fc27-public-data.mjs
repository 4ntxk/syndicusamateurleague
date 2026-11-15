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
const reportPath = path.resolve(
  process.cwd(),
  ".discord-data",
  "fc27-reports.json",
);
const reports = fs.existsSync(reportPath)
  ? JSON.parse(fs.readFileSync(reportPath, "utf8")).reports
  : [];

const standings = privateSeason.players.map((player) => ({
  division: player.division,
  discordUsername: player.discordUsername,
  played: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
}));

for (const report of reports) {
  if (report.status !== "confirmed" || report.test) continue;

  const fixture = privateWeek.fixtures.find(
    (candidate) => candidate.id === report.fixtureId,
  );
  if (!fixture) continue;

  const home = standings.find(
    (player) =>
      player.discordUsername === fixture.homeDiscordUsername &&
      player.division === fixture.division,
  );
  const away = standings.find(
    (player) =>
      player.discordUsername === fixture.awayDiscordUsername &&
      player.division === fixture.division,
  );
  if (!home || !away) continue;

  home.played += 1;
  away.played += 1;
  home.goalsFor += report.homeGoals;
  home.goalsAgainst += report.awayGoals;
  away.goalsFor += report.awayGoals;
  away.goalsAgainst += report.homeGoals;

  if (report.homeGoals > report.awayGoals) {
    home.wins += 1;
    away.losses += 1;
  } else if (report.homeGoals < report.awayGoals) {
    away.wins += 1;
    home.losses += 1;
  } else {
    home.draws += 1;
    away.draws += 1;
  }
}

for (const player of standings) {
  player.points = player.wins * 3 + player.draws;
  player.goalDifference = player.goalsFor - player.goalsAgainst;
  delete player.goalsFor;
  delete player.goalsAgainst;
}

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

publicSeason.standings = standings;

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
