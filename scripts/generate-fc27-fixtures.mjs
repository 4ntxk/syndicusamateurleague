import fs from "node:fs";
import path from "node:path";

const playersPath = path.resolve(
  process.cwd(),
  "src",
  "data",
  "fc27-season-1-players.json",
);
const outputPath = path.resolve(
  process.cwd(),
  "src",
  "data",
  "fc27-season-1-week-1.json",
);

const season = JSON.parse(fs.readFileSync(playersPath, "utf8"));
const divisions = ["Platinum", "Gold", "Silver"];

const fixturesForDivision = (division) => {
  const players = season.players.filter(
    (player) => player.division === division,
  );
  const fixtures = [];
  let sequence = 1;

  for (let firstIndex = 0; firstIndex < players.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < players.length;
      secondIndex += 1
    ) {
      const first = players[firstIndex];
      const second = players[secondIndex];

      fixtures.push({
        id: `W1-${division.toUpperCase()}-${String(sequence).padStart(2, "0")}`,
        division,
        leg: 1,
        homeDiscordUsername: first.discordUsername,
        homeDiscordUserId: first.discordUserId,
        awayDiscordUsername: second.discordUsername,
        awayDiscordUserId: second.discordUserId,
        status: "scheduled",
      });
      sequence += 1;

      fixtures.push({
        id: `W1-${division.toUpperCase()}-${String(sequence).padStart(2, "0")}`,
        division,
        leg: 2,
        homeDiscordUsername: second.discordUsername,
        homeDiscordUserId: second.discordUserId,
        awayDiscordUsername: first.discordUsername,
        awayDiscordUserId: first.discordUserId,
        status: "scheduled",
      });
      sequence += 1;
    }
  }

  return fixtures;
};

const week = {
  seasonId: season.id,
  week: 1,
  startsAt: "2026-11-16T00:00:00+01:00",
  deadlineAt: "2026-11-22T23:59:00+01:00",
  fixtures: divisions.flatMap(fixturesForDivision),
};

fs.writeFileSync(outputPath, `${JSON.stringify(week, null, 2)}\n`, "utf8");

console.log(`Generated ${week.fixtures.length} FC27 Week 1 fixtures.`);
for (const division of divisions) {
  console.log(
    `${division}: ${week.fixtures.filter((fixture) => fixture.division === division).length}`,
  );
}
