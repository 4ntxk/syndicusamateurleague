"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CalendarDays, Gamepad2, Shield, Swords, Trophy } from "lucide-react";
import Sidebar from "../../../components/sidebar";
import Footer from "../../../components/footer";
import { useLocale } from "../../../i18n/use-locale";
import playersData from "../../../data/fc27-season-1-public.json";
import fixturesData from "../../../data/fc27-season-1-week-1-public.json";

const divisionStyles = {
  Platinum: "border-cyan-300/30 bg-cyan-300/5 text-cyan-200",
  Gold: "border-amber-300/30 bg-amber-300/5 text-amber-200",
  Silver: "border-slate-300/30 bg-slate-300/5 text-slate-200",
};

export default function LeaguesPage() {
  const [activeNav, setActiveNav] = useState("leagues");
  const [activeGame, setActiveGame] = useState<"fc27" | "lol">("fc27");
  const [division, setDivision] = useState<"Platinum" | "Gold" | "Silver">(
    "Platinum",
  );
  const locale = useLocale();
  const isEnglish = locale === "en";

  const players = useMemo(
    () => playersData.players.filter((player) => player.division === division),
    [division],
  );
  const fixtures = useMemo(
    () =>
      fixturesData.fixtures.filter((fixture) => fixture.division === division),
    [division],
  );

  return (
    <div className="flex min-h-screen bg-[#0b0712]">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <main className="min-w-0 flex-1">
        <section className="relative overflow-hidden border-b border-violet-400/20 px-4 py-16 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.25),transparent_40%),linear-gradient(135deg,#130b24,#08060d)]" />
          <div className="relative mx-auto max-w-6xl">
            <p className="mb-3 text-xs font-black tracking-[0.25em] text-violet-300 uppercase">
              Syndicus Amateur League
            </p>
            <h1 className="max-w-4xl text-4xl font-black text-white md:text-6xl">
              {isEnglish ? "Season 1 league hub" : "Centrum ligowe Sezonu 1"}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
              {isEnglish
                ? "Schedules, divisions, fixtures and rules for the new FC27 and League of Legends formats."
                : "Terminarze, dywizje, mecze i zasady nowych formatów FC27 oraz League of Legends."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveGame("fc27")}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${activeGame === "fc27" ? "bg-amber-300 text-black" : "bg-white/8 text-white hover:bg-white/15"}`}
              >
                FC27 Season 1
              </button>
              <button
                type="button"
                onClick={() => setActiveGame("lol")}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${activeGame === "lol" ? "bg-violet-400 text-black" : "bg-white/8 text-white hover:bg-white/15"}`}
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
                  ["13", isEnglish ? "Players" : "Zawodników"],
                  ["3", isEnglish ? "Active divisions" : "Aktywne dywizje"],
                  ["4", isEnglish ? "Season weeks" : "Tygodnie sezonu"],
                  ["44", isEnglish ? "Week 1 fixtures" : "Mecze Week 1"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                  >
                    <p className="text-3xl font-black text-white">{value}</p>
                    <p className="mt-1 text-sm text-white/55">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
                <div className="rounded-2xl border border-white/10 bg-[#120c1d] p-5 md:p-7">
                  <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-amber-300 uppercase">
                        Week 1
                      </p>
                      <h2 className="mt-1 text-2xl font-black text-white">
                        {isEnglish
                          ? "Divisions and fixtures"
                          : "Dywizje i mecze"}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["Platinum", "Gold", "Silver"] as const).map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setDivision(name)}
                          className={`rounded-full border px-4 py-2 text-sm font-bold transition ${division === name ? divisionStyles[name] : "border-white/10 text-white/55 hover:text-white"}`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-xs tracking-wider text-white/45 uppercase">
                        <tr>
                          <th className="px-4 py-3">#</th>
                          <th className="px-4 py-3">Player</th>
                          <th className="hidden px-4 py-3 sm:table-cell">
                            Platform
                          </th>
                          <th className="px-4 py-3 text-right">LP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/8">
                        {players.map((player, index) => (
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
                            <td className="hidden px-4 py-3 sm:table-cell">
                              {player.platform}
                            </td>
                            <td className="px-4 py-3 text-right font-bold">
                              0
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {fixtures.map((fixture) => (
                      <div
                        key={fixture.id}
                        className="rounded-xl border border-white/8 bg-black/15 p-3"
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
                  <InfoCard icon={CalendarDays} title="16 Nov — 13 Dec 2026">
                    {isEnglish
                      ? "Four seven-day rounds. Default deadline: Sunday, 23:59 CET."
                      : "Cztery siedmiodniowe rundy. Domyślny deadline: niedziela, 23:59 CET."}
                  </InfoCard>
                  <InfoCard
                    icon={Shield}
                    title={
                      isEnglish ? "Weekly movement" : "Cotygodniowe zmiany"
                    }
                  >
                    {isEnglish
                      ? "Top two in Gold and Silver move up; bottom two in Platinum and Gold move down after Weeks 1–3."
                      : "Top 2 Gold i Silver awansuje, a dolna 2 Platinum i Gold spada po tygodniach 1–3."}
                  </InfoCard>
                  <InfoCard
                    icon={Trophy}
                    title={isEnglish ? "Season Points" : "Season Points"}
                  >
                    {isEnglish
                      ? "Weekly placement awards SP. Final ranking uses total SP, then the latest weekly SP as tiebreakers."
                      : "Miejsce w tygodniu przyznaje SP. Ranking końcowy liczy sumę SP, a potem wyniki najnowszych tygodni."}
                  </InfoCard>
                </aside>
              </div>
            </div>
          </section>
        ) : (
          <section className="px-4 py-12 md:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <div className="rounded-2xl border border-violet-400/20 bg-violet-500/5 p-6 md:p-8">
                  <Gamepad2 className="h-10 w-10 text-violet-300" />
                  <h2 className="mt-5 text-3xl font-black text-white">
                    League of Legends 1v1
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-white/60">
                    {isEnglish
                      ? "A SAL adaptation of the Tyler1 All-Stars format on Howling Abyss."
                      : "Format SAL inspirowany Tyler1 All-Stars, rozgrywany na Howling Abyss."}
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Double elimination", "Best-of-3 · Final Best-of-5"],
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
                        className="rounded-xl border border-white/10 bg-black/15 p-4"
                      >
                        <p className="text-sm font-bold text-white">{title}</p>
                        <p className="mt-1 text-sm text-white/50">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#120c1d] p-6 md:p-8">
                  <Swords className="h-9 w-9 text-violet-300" />
                  <h3 className="mt-5 text-xl font-black text-white">
                    {isEnglish ? "Bracket status" : "Status drabinki"}
                  </h3>
                  <p className="mt-3 text-white/55">
                    {isEnglish
                      ? "Registration and bracket dates will be announced on Discord. Tournament size and byes are confirmed after registration closes."
                      : "Zapisy i daty drabinki zostaną ogłoszone na Discordzie. Liczba graczy i wolne losy będą potwierdzone po zamknięciu zapisów."}
                  </p>
                  <div className="mt-6 rounded-xl border border-violet-400/20 bg-violet-400/5 p-4 text-sm text-violet-100/75">
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
    <div className="rounded-2xl border border-white/10 bg-[#120c1d] p-5">
      <Icon className="h-6 w-6 text-amber-300" />
      <h3 className="mt-4 font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/55">{children}</p>
    </div>
  );
}
