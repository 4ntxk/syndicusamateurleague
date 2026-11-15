"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CalendarDays, Gamepad2, Shield, Swords, Trophy } from "lucide-react";
import Sidebar from "../../../components/sidebar";
import Footer from "../../../components/footer";
import playersData from "../../../data/fc27-season-1-public.json";
import fixturesData from "../../../data/fc27-season-1-week-1-public.json";

const divisionStyles = {
  Platinum: "border-violet-300 bg-violet-300 text-[#100c17]",
  Gold: "border-[#a83acd] bg-[#a83acd] text-white",
  Silver: "border-[#2815d3] bg-[#2815d3] text-white",
};

type ConfirmedResult = {
  fixtureId: string;
  division: string;
  homeUsername: string;
  awayUsername: string;
  homeGoals: number;
  awayGoals: number;
};

export default function LeaguesPage() {
  const [activeNav, setActiveNav] = useState("leagues");
  const [activeGame, setActiveGame] = useState<"fc27" | "lol">("fc27");
  const [division, setDivision] = useState<"Platinum" | "Gold" | "Silver">(
    "Platinum",
  );
  const [confirmedResults, setConfirmedResults] = useState<ConfirmedResult[]>([]);

  useEffect(() => {
    fetch("/api/fc27/results", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { results: [] }))
      .then((data: { results?: ConfirmedResult[] }) =>
        setConfirmedResults(data.results ?? []),
      )
      .catch(() => setConfirmedResults([]));
  }, []);

  const players = useMemo(
    () => playersData.players.filter((player) => player.division === division),
    [division],
  );
  const fixtures = useMemo(
    () =>
      fixturesData.fixtures.filter((fixture) => fixture.division === division),
    [division],
  );
  const standings = useMemo(
    () => {
      const rows = players.map((player) => ({
        ...player,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalDifference: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      }));

      for (const result of confirmedResults) {
        if (result.division !== division) continue;
        const fixture = fixtures.find((entry) => entry.id === result.fixtureId);
        if (!fixture) continue;
        const home = rows.find((row) => row.discordUsername === fixture.homeDiscordUsername);
        const away = rows.find((row) => row.discordUsername === fixture.awayDiscordUsername);
        if (!home || !away) continue;

        home.played += 1;
        away.played += 1;
        home.goalsFor += result.homeGoals;
        home.goalsAgainst += result.awayGoals;
        away.goalsFor += result.awayGoals;
        away.goalsAgainst += result.homeGoals;

        if (result.homeGoals > result.awayGoals) {
          home.wins += 1;
          away.losses += 1;
        } else if (result.homeGoals < result.awayGoals) {
          away.wins += 1;
          home.losses += 1;
        } else {
          home.draws += 1;
          away.draws += 1;
        }
      }

      for (const row of rows) {
        row.points = row.wins * 3 + row.draws;
        row.goalDifference = row.goalsFor - row.goalsAgainst;
      }

      return rows.sort(
        (a, b) =>
          b.points - a.points ||
          b.goalDifference - a.goalDifference ||
          b.goalsFor - a.goalsFor,
      );
    },
    [confirmedResults, division, fixtures, players],
  );

  return (
    <div className="flex min-h-screen bg-[#100b18]">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <main className="min-w-0 flex-1">
        <section className="relative overflow-hidden border-b border-white/15 px-4 py-16 md:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,#100b18_0%,#100b18_46%,rgba(40,21,211,0.42)_46%,rgba(168,58,205,0.2)_100%)]" />
          <div className="pointer-events-none absolute right-[12%] bottom-0 h-1 w-56 bg-[#a83acd]" />
          <div className="relative mx-auto max-w-6xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-black tracking-[0.25em] text-violet-300 uppercase">
              <span className="h-px w-8 bg-[#a83acd]" />
              Syndicus Amateur League
            </p>
            <h1 className="max-w-4xl text-5xl leading-[0.94] font-black tracking-[-0.045em] text-white uppercase md:text-7xl">
              League <span className="text-[#a83acd]">hub</span>
            </h1>
            <p className="mt-5 max-w-2xl border-l-2 border-[#2815d3] pl-4 text-base leading-7 text-white/65 md:text-lg">
              Schedules, divisions, fixtures and format details for FC27 and
              League of Legends.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveGame("fc27")}
                className={`border px-5 py-3 text-sm font-black tracking-wide uppercase transition ${activeGame === "fc27" ? "border-[#a83acd] bg-[#a83acd] text-white" : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"}`}
              >
                FC27 Season 1
              </button>
              <button
                type="button"
                onClick={() => setActiveGame("lol")}
                className={`border px-5 py-3 text-sm font-black tracking-wide uppercase transition ${activeGame === "lol" ? "border-[#2815d3] bg-[#2815d3] text-white" : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"}`}
              >
                LoL 1v1
              </button>
            </div>
          </div>
        </section>

        {activeGame === "fc27" ? (
          <section className="px-4 py-12 md:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [String(playersData.players.length), "Players"],
                  ["3", "Divisions"],
                  ["4", "Season weeks"],
                  [String(fixturesData.fixtures.length), "Week 1 fixtures"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="border-l-2 border-violet-400/70 bg-gradient-to-r from-violet-500/15 to-[#171020] p-5"
                  >
                    <p className="text-3xl font-black text-white">{value}</p>
                    <p className="mt-1 text-sm text-white/55">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
                <div className="border border-violet-300/20 bg-gradient-to-br from-[#21142f] via-[#15101d] to-[#100b18] p-5 md:p-7">
                  <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-amber-300 uppercase">
                        Week 1
                      </p>
                      <h2 className="mt-1 text-2xl font-black text-white">
                        Divisions and fixtures
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["Platinum", "Gold", "Silver"] as const).map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setDivision(name)}
                        className={`border px-4 py-2 text-xs font-black tracking-wide uppercase transition ${division === name ? divisionStyles[name] : "border-white/15 text-white/55 hover:border-white/40 hover:text-white"}`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-hidden border-y border-white/15">
                    <table className="w-full text-left text-sm">
                    <thead className="bg-[#2815d3]/25 text-[10px] tracking-[0.18em] text-violet-100/75 uppercase">
                        <tr>
                          <th className="px-4 py-3">#</th>
                          <th className="px-4 py-3">Player</th>
                          <th className="px-3 py-3 text-right">P</th>
                          <th className="px-3 py-3 text-right">W</th>
                          <th className="hidden px-3 py-3 text-right sm:table-cell">D</th>
                          <th className="hidden px-3 py-3 text-right sm:table-cell">L</th>
                          <th className="px-3 py-3 text-right">GD</th>
                          <th className="px-3 py-3 text-right">PTS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/8">
                        {standings.map((player, index) => (
                          <tr
                            key={player.discordUsername}
                            className="text-white/75"
                          >
                            <td className="px-4 py-3 text-white/35">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 font-semibold text-white">
                              {player.discordUsername}
                            </td>
                            <td className="px-3 py-3 text-right tabular-nums">{player.played}</td>
                            <td className="px-3 py-3 text-right tabular-nums">{player.wins}</td>
                            <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell">{player.draws}</td>
                            <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell">{player.losses}</td>
                            <td className="px-3 py-3 text-right font-bold tabular-nums">{player.goalDifference > 0 ? `+${player.goalDifference}` : player.goalDifference}</td>
                            <td className="px-3 py-3 text-right font-black text-violet-200 tabular-nums">{player.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                    {fixtures.map((fixture) => (
                      <div
                        key={fixture.id}
                        className="bg-[#120d1a] p-3 transition-colors hover:bg-[#2815d3]/15"
                      >
                        <p className="text-[10px] font-bold tracking-wider text-white/35">
                          {fixture.id}
                        </p>
                        <p className="mt-1 truncate text-sm text-white/80">
                          {fixture.homeDiscordUsername}{" "}
                          <span className="text-white/30">vs</span>{" "}
                          {fixture.awayDiscordUsername}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="space-y-4">
                  <InfoCard icon={CalendarDays} title="16 Nov – 13 Dec 2026">
                    Four seven-day rounds. Week 1 fixtures are due Sunday,
                    22 November at 23:59 CET.
                  </InfoCard>
                  <InfoCard
                    icon={Shield}
                    title="Weekly movement"
                  >
                    The top two in Gold and Silver move up. The bottom two in
                    Platinum and Gold move down after Weeks 1–3.
                  </InfoCard>
                  <InfoCard
                    icon={Trophy}
                    title="Season Points"
                  >
                    Weekly placement awards SP. The final ranking uses total
                    SP, with the latest weekly SP as the first tiebreaker.
                  </InfoCard>
                </aside>
              </div>
            </div>
          </section>
        ) : (
          <section className="px-4 py-12 md:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <div className="border-l-2 border-[#2815d3] bg-gradient-to-br from-[#2815d3]/20 to-[#100b18] p-6 md:p-8">
                  <Gamepad2 className="h-10 w-10 text-violet-300" />
                  <h2 className="mt-5 text-3xl font-black tracking-tight text-white uppercase">
                    League of Legends 1v1
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-white/60">
                    A SAL adaptation of the Tyler1 All-Stars format on Howling
                    Abyss.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Bracket", "Double elimination · Best-of-3"],
                      ["Final", "Best-of-5"],
                      ["Win conditions", "First Blood · First turret · 100 CS"],
                      [
                        "Champion select",
                        "Blind Pick · Mirror matches allowed",
                      ],
                      [
                        "Champion lockout",
                        "Winning champion locked for the series",
                      ],
                    ].map(([title, value]) => (
                      <div
                        key={title}
                        className="border-t border-white/15 bg-black/15 p-4"
                      >
                        <p className="text-sm font-bold text-white">{title}</p>
                        <p className="mt-1 text-sm text-white/50">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-violet-300/20 bg-gradient-to-br from-[#21142f] to-[#100b18] p-6 md:p-8">
                  <Swords className="h-9 w-9 text-violet-300" />
                  <h3 className="mt-5 text-xl font-black text-white">
                    Registration and bracket
                  </h3>
                  <p className="mt-3 text-white/55">
                    Registration dates and the bracket will be announced on
                    Discord. Follow the league channels for updates.
                  </p>
                  <div className="mt-6 border-l-2 border-[#a83acd] bg-[#a83acd]/[0.07] p-4 text-sm text-violet-100/75">
                    Tryndamere, Lee Sin, Renekton, Qiyana, Akali, Demolish and
                    Guardian&apos;s Horn are prohibited.
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        <Footer />
      </main>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Trophy;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t-2 border-[#a83acd]/70 bg-gradient-to-r from-[#a83acd]/10 to-[#171020] p-5">
      <Icon className="h-6 w-6 text-violet-300" />
      <h3 className="mt-4 font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/55">{children}</p>
    </div>
  );
}
