"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TournamentInfoTab } from "../../../../components/tournament-detail/info-tab";
import { TournamentPlayersTab } from "../../../../components/tournament-detail/players-tab";
import Sidebar from "../../../../components/sidebar";
import Footer from "../../../../components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  getRegistrationFormUrl,
  hasRegistrationForm,
  tournaments,
  type TournamentMatch,
} from "../../../../data/tournaments";
import { useLocale } from "../../../../i18n/use-locale";
import { getTranslations } from "../../../../i18n/translations";
import {
  getGuardianConsentUrl,
  isSeasonOneTournament,
} from "../../../../lib/guardian-consent";
import { getRegulationsUrl } from "../../../../lib/regulations";

type BracketMatchProps = {
  label: string;
  home: string;
  away: string;
  size?: "compact" | "normal";
  score?: string;
};

const BracketMatch = ({
  label,
  home,
  away,
  size = "normal",
  score,
}: BracketMatchProps) => {
  const isCompact = size === "compact";
  const wrapperClass = isCompact ? "p-2 text-[10.5px]" : "p-2 text-[11px]";
  const rowClass = isCompact
    ? "px-2 py-0.5 text-[10.5px]"
    : "px-2 py-1 text-[11px]";
  const labelClass = isCompact ? "mb-1 text-[9.5px]" : "mb-1 text-[10px]";
  const placeholderRegex = /^(Winner|Loser|Zwycięzca|Przegrany)\b|^TBD$/i;
  const scoreRegex = /(\d+)\s*:\s*(\d+)/;
  const homeIsPlaceholder = placeholderRegex.test(home);
  const awayIsPlaceholder = placeholderRegex.test(away);
  const parsedScore = score ? scoreRegex.exec(score) : null;
  const homeScore = parsedScore ? Number(parsedScore[1]) : null;
  const awayScore = parsedScore ? Number(parsedScore[2]) : null;
  const hasScore = homeScore !== null && awayScore !== null;
  const scoreDetails =
    score && parsedScore
      ? score.slice(parsedScore.index + parsedScore[0].length).trim()
      : "";
  const isTie = hasScore && homeScore === awayScore;
  const homeIsWinner = hasScore && !isTie && homeScore > awayScore;
  const awayIsWinner = hasScore && !isTie && awayScore > homeScore;
  const homeDisplay = hasScore && homeIsPlaceholder ? "\u00A0" : home;
  const awayDisplay = hasScore && awayIsPlaceholder ? "\u00A0" : away;

  return (
    <div
      className={`rounded-md border border-white/10 bg-white/5 ${wrapperClass}`}
    >
      <p
        className={`${labelClass} text-foreground/60 font-semibold tracking-wide uppercase`}
      >
        {label}
      </p>
      <div className="space-y-1">
        <div
          className={`flex items-center justify-between gap-2 rounded border border-white/10 bg-[#140b24] ${rowClass}`}
        >
          <span
            className={`flex w-full min-w-0 items-center ${
              homeIsPlaceholder
                ? "text-[#7aa7ff]"
                : homeIsWinner
                  ? "font-semibold text-emerald-400"
                  : hasScore
                    ? "font-semibold text-rose-400"
                    : "font-semibold text-[#8b5cf6]"
            }`}
          >
            <span className="min-w-0 flex-1 truncate">{homeDisplay}</span>
            {hasScore ? (
              <span className="text-foreground/70 ml-auto w-6 pr-1 text-right tabular-nums">
                {homeScore}
              </span>
            ) : null}
          </span>
        </div>
        <div
          className={`flex items-center justify-between gap-2 rounded border border-white/10 bg-[#140b24] ${rowClass}`}
        >
          <span
            className={`flex w-full min-w-0 items-center ${
              awayIsPlaceholder
                ? "text-[#7aa7ff]"
                : awayIsWinner
                  ? "font-semibold text-emerald-400"
                  : hasScore
                    ? "font-semibold text-rose-400"
                    : "font-semibold text-[#8b5cf6]"
            }`}
          >
            <span className="min-w-0 flex-1 truncate">{awayDisplay}</span>
            {hasScore ? (
              <span className="text-foreground/70 ml-auto w-6 pr-1 text-right tabular-nums">
                {awayScore}
              </span>
            ) : null}
          </span>
        </div>
      </div>
      {scoreDetails ? (
        <p className="mt-2 text-[10px] leading-tight text-foreground/55">
          {scoreDetails}
        </p>
      ) : null}
    </div>
  );
};

type BracketColumnProps = {
  title: string;
  children: ReactNode;
  align?: "center" | "start";
  status?: "current" | "upcoming";
};

const BracketColumn = ({
  title,
  children,
  align = "center",
  status,
}: BracketColumnProps) => {
  const titleClass =
    status === "current"
      ? "text-emerald-300"
      : status === "upcoming"
        ? "text-[#a83acd]"
        : "text-foreground/60";

  return (
    <div className="relative flex h-full flex-col">
      <p
        className={`text-[10px] font-semibold tracking-wide uppercase ${titleClass}`}
      >
        {title}
      </p>
      <div
        className={`mt-2 flex flex-1 flex-col ${align === "start" ? "justify-start" : "justify-center"} space-y-3`}
      >
        {children}
      </div>
    </div>
  );
};

export default function TournamentDetailPage() {
  const [activeNav, setActiveNav] = useState("tournaments");
  const [activeTab, setActiveTab] = useState<
    "info" | "players" | "groups" | "playoffs"
  >("info");
  const params = useParams();
  const locale = useLocale();
  const t = getTranslations(locale);
  const regulationsUrl = getRegulationsUrl(locale);
  const guardianConsentUrl = getGuardianConsentUrl(locale);

  const tournamentId = useMemo(() => {
    const raw = params?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
    return Number.isNaN(parsed) ? null : parsed;
  }, [params]);

  const tournament = tournaments.find((item) => item.id === tournamentId);
  const showPlayoffs = Boolean(tournament?.playoffs);
  const isStyczen1 = tournament?.id === 1;
  const isMarzec1 = tournament?.id === 3;
  const isApril1 = tournament?.id === 4;
  const isMundial = tournament?.id === 10;
  const showSchedule = tournament?.id === 2 || isMarzec1;
  const showGroupsPlayoffs = true;
  const groupsTabLabel = isMundial
    ? locale === "en"
      ? "Bracket"
      : "Tabela"
    : t.tournamentDetail.tabs.groups;
  const groupsEmptyText = isMundial
    ? locale === "en"
      ? "The tournament bracket will appear after registration closes and teams are drawn."
      : "Drabinka turnieju pojawi się po zamknięciu rejestracji i losowaniu drużyn."
    : t.tournamentDetail.groupsEmpty;
  const registrationRange = tournament?.registrationDate?.split(" - ") ?? [];
  const registrationLine =
    registrationRange.length === 2
      ? locale === "en"
        ? `Open from ${registrationRange[0]} to ${registrationRange[1]}`
        : `Otwarta od ${registrationRange[0]} do ${registrationRange[1]}`
      : null;
  const tournamentInfo = tournament?.info;
  const registrationInfoTitle =
    locale === "en"
      ? (tournamentInfo?.registrationTitleEn ??
        tournamentInfo?.registrationTitle ??
        t.tournamentDetail.info.registration.title)
      : (tournamentInfo?.registrationTitle ??
        t.tournamentDetail.info.registration.title);
  const registrationInfoBullets =
    locale === "en"
      ? (tournamentInfo?.registrationBulletsEn ??
        tournamentInfo?.registrationBullets ??
        t.tournamentDetail.info.registration.bullets)
      : (tournamentInfo?.registrationBullets ??
        t.tournamentDetail.info.registration.bullets);
  const qualifiersInfoTitle =
    locale === "en"
      ? (tournamentInfo?.qualifiersTitleEn ??
        tournamentInfo?.qualifiersTitle ??
        t.tournamentDetail.info.qualifiers.title)
      : (tournamentInfo?.qualifiersTitle ??
        t.tournamentDetail.info.qualifiers.title);
  const qualifiersInfoBullets =
    locale === "en"
      ? (tournamentInfo?.qualifiersBulletsEn ??
        tournamentInfo?.qualifiersBullets ??
        t.tournamentDetail.info.qualifiers.bullets)
      : (tournamentInfo?.qualifiersBullets ??
        t.tournamentDetail.info.qualifiers.bullets);
  const announcementsInfoTitle =
    locale === "en"
      ? (tournamentInfo?.announcementsTitleEn ??
        tournamentInfo?.announcementsTitle ??
        t.tournamentDetail.info.announcements.title)
      : (tournamentInfo?.announcementsTitle ??
        t.tournamentDetail.info.announcements.title);
  const announcementsInfoBullets =
    locale === "en"
      ? (tournamentInfo?.announcementsBulletsEn ??
        tournamentInfo?.announcementsBullets ??
        t.tournamentDetail.info.announcements.bullets)
      : (tournamentInfo?.announcementsBullets ??
        t.tournamentDetail.info.announcements.bullets);
  const playoffsInfoTitle =
    locale === "en"
      ? (tournamentInfo?.playoffsTitleEn ??
        tournamentInfo?.playoffsTitle ??
        t.tournamentDetail.info.playoffs.title)
      : (tournamentInfo?.playoffsTitle ??
        t.tournamentDetail.info.playoffs.title);
  const playoffsInfoBullets =
    locale === "en"
      ? (tournamentInfo?.playoffsBulletsEn ??
        tournamentInfo?.playoffsBullets ??
        t.tournamentDetail.info.playoffs.bullets)
      : (tournamentInfo?.playoffsBullets ??
        t.tournamentDetail.info.playoffs.bullets);
  const infoSections = [
    {
      title: registrationInfoTitle,
      bullets: registrationLine
        ? [
            registrationLine,
            ...registrationInfoBullets.filter(
              (item) =>
                !/^Otwarta od\b/i.test(item)
                && !/^Open from\b/i.test(item)
                && !/^Rejestracja jest otwarta od\b/i.test(item)
                && !/^Registration is open from\b/i.test(item),
            ),
          ]
        : registrationInfoBullets,
    },
    {
      title: qualifiersInfoTitle,
      bullets: qualifiersInfoBullets,
    },
    {
      title: announcementsInfoTitle,
      bullets: announcementsInfoBullets,
    },
    {
      title: playoffsInfoTitle,
      bullets: playoffsInfoBullets,
    },
  ].filter((section) => section.bullets.length > 0);
  const groupNoticeLines = isMarzec1
    ? [
        locale === "en"
          ? "Group stage lasts from 18.03 to 25.03 until 24:00."
          : "Faza grupowa trwa od 18.03 do 25.03 do godz. 24:00.",
      ]
    : t.tournamentDetail.groups.noticeLines;
  useEffect(() => {
    if (!showPlayoffs && activeTab === "playoffs") {
      setActiveTab("info");
    }
    if (
      !showGroupsPlayoffs &&
      (activeTab === "groups" || activeTab === "playoffs")
    ) {
      setActiveTab("info");
    }
  }, [activeTab, showGroupsPlayoffs, showPlayoffs]);
  const playoffGroups = useMemo(() => {
    if (!tournament) {
      return [];
    }

    return tournament.groups
      .map((group) => {
        const playedPlayers = new Set<string>();
        group.matches.played.forEach((match) => {
          playedPlayers.add(match.home);
          playedPlayers.add(match.away);
        });

        const realSlots = group.advanceSlots ?? 2;
        const targetSlots = 2;
        const realPlayers =
          isMarzec1 && group.name === "Grupa A"
            ? ["wiksoonszef", "Kubadzik2009"]
                .map((player, index) => {
                  const row = group.standings.find(
                    (standing) => standing.player === player,
                  );
                  return row
                    ? {
                        player: row.player,
                        points: row.points,
                        seed: index + 1,
                      }
                    : null;
                })
                .filter(
                  (
                    player,
                  ): player is {
                    player: string;
                    points: number;
                    seed: number;
                  } => player !== null,
                )
                .slice(0, realSlots)
            : group.standings
                .filter((row) => playedPlayers.has(row.player))
                .map((row, index) => ({
                  player: row.player,
                  points: row.points,
                  seed: index + 1,
                }))
                .slice(0, realSlots);

        const players = [...realPlayers];

        while (players.length < targetSlots) {
          players.push({
            player:
              group.placeholderAdvance ??
              t.tournamentDetail.playoffsBracket.placeholderTbd,
            points: 0,
            seed: players.length + 1,
          });
        }

        return {
          name: group.name,
          players,
          displayPlayers: realPlayers,
        };
      })
      .filter((group) => group.players.length > 0);
  }, [isMarzec1, t, tournament]);

  const qualifiedPlayers = useMemo(
    () =>
      playoffGroups.flatMap((group) =>
        group.players.map((player) => ({
          player: player.player,
          points: player.points,
          seed: player.seed,
          group: group.name,
        })),
      ),
    [playoffGroups],
  );
  const groupedScheduledMatches = useMemo(() => {
    if (!tournament) {
      return new Map<
        string,
        Array<{
          players: [string, string];
          matches: TournamentMatch[];
        }>
      >();
    }

    return new Map(
      tournament.groups.map((group) => {
        const seriesByPair = new Map<
          string,
          {
            players: [string, string];
            matches: TournamentMatch[];
          }
        >();

        group.matches.scheduled.forEach((match) => {
          const orderedPlayers = [match.home, match.away].sort();
          const pairKey = orderedPlayers.join("|");
          const existingSeries = seriesByPair.get(pairKey);

          if (existingSeries) {
            existingSeries.matches.push(match);
            return;
          }

          seriesByPair.set(pairKey, {
            players: [
              orderedPlayers[0] ?? match.home,
              orderedPlayers[1] ?? match.away,
            ],
            matches: [match],
          });
        });

        return [
          group.name,
          Array.from(seriesByPair.values()).sort((a, b) =>
            a.players.join("|").localeCompare(b.players.join("|")),
          ),
        ];
      }),
    );
  }, [tournament]);
  const groupedPlayedMatches = useMemo(() => {
    if (!tournament) {
      return new Map<
        string,
        Array<{
          players: [string, string];
          matches: TournamentMatch[];
        }>
      >();
    }

    return new Map(
      tournament.groups.map((group) => {
        const seriesByPair = new Map<
          string,
          {
            players: [string, string];
            matches: TournamentMatch[];
          }
        >();

        group.matches.played.forEach((match) => {
          const orderedPlayers = [match.home, match.away].sort();
          const pairKey = orderedPlayers.join("|");
          const existingSeries = seriesByPair.get(pairKey);

          if (existingSeries) {
            existingSeries.matches.push(match);
            return;
          }

          seriesByPair.set(pairKey, {
            players: [
              orderedPlayers[0] ?? match.home,
              orderedPlayers[1] ?? match.away,
            ],
            matches: [match],
          });
        });

        return [
          group.name,
          Array.from(seriesByPair.values()).sort((a, b) =>
            a.players.join("|").localeCompare(b.players.join("|")),
          ),
        ];
      }),
    );
  }, [tournament]);
  const isEightBracket = qualifiedPlayers.length <= 8;
  const now = new Date();
  type RoundRange = readonly [Date, Date];
  type ScheduleRanges = {
    winnersQuarterfinals: RoundRange;
    winnersSemifinals: RoundRange;
    winnersFinal: RoundRange;
    losersRound1: RoundRange;
    losersRound2: RoundRange;
    losersRound3: RoundRange;
    losersFinal: RoundRange;
    grandFinal: RoundRange;
  };
  const scheduleRanges: ScheduleRanges = isMarzec1
    ? {
        winnersQuarterfinals: [
          new Date(2026, 2, 26),
          new Date(2026, 2, 28, 23, 59, 59, 999),
        ],
        winnersSemifinals: [
          new Date(2026, 2, 29),
          new Date(2026, 2, 31, 23, 59, 59, 999),
        ],
        winnersFinal: [
          new Date(2026, 3, 1),
          new Date(2026, 3, 3, 23, 59, 59, 999),
        ],
        losersRound1: [
          new Date(2026, 2, 29),
          new Date(2026, 2, 31, 23, 59, 59, 999),
        ],
        losersRound2: [
          new Date(2026, 3, 1),
          new Date(2026, 3, 3, 23, 59, 59, 999),
        ],
        losersRound3: [
          new Date(2026, 3, 1),
          new Date(2026, 3, 3, 23, 59, 59, 999),
        ],
        losersFinal: [
          new Date(2026, 3, 4),
          new Date(2026, 3, 7, 23, 59, 59, 999),
        ],
        grandFinal: [
          new Date(2026, 3, 4),
          new Date(2026, 3, 7, 23, 59, 59, 999),
        ],
      }
    : {
        winnersQuarterfinals: [
          new Date(2026, 2, 1),
          new Date(2026, 2, 4, 23, 59, 59, 999),
        ],
        winnersSemifinals: [
          new Date(2026, 2, 4),
          new Date(2026, 2, 7, 23, 59, 59, 999),
        ],
        winnersFinal: [
          new Date(2026, 2, 7),
          new Date(2026, 2, 9, 23, 59, 59, 999),
        ],
        losersRound1: [
          new Date(2026, 2, 4),
          new Date(2026, 2, 7, 23, 59, 59, 999),
        ],
        losersRound2: [
          new Date(2026, 2, 4),
          new Date(2026, 2, 7, 23, 59, 59, 999),
        ],
        losersRound3: [
          new Date(2026, 2, 7),
          new Date(2026, 2, 9, 23, 59, 59, 999),
        ],
        losersFinal: [
          new Date(2026, 2, 9),
          new Date(2026, 2, 11, 23, 59, 59, 999),
        ],
        grandFinal: [
          new Date(2026, 2, 9),
          new Date(2026, 2, 11, 23, 59, 59, 999),
        ],
      };
  const getRoundStatus = (range: RoundRange) => {
    if (now < range[0]) {
      return "upcoming";
    }
    if (now <= range[1]) {
      return "current";
    }
    return undefined;
  };
  const formatDeadlineDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return locale === "en" ? `${month}.${day}` : `${day}.${month}`;
  };
  const withDeadline = (title: string, range?: RoundRange) => {
    if (!range) {
      return title;
    }
    return `${title} (${formatDeadlineDate(range[0])}-${formatDeadlineDate(range[1])})`;
  };
  const playoffDeadlineLines = isMarzec1
    ? locale === "en"
      ? [
          "03.26-03.28: Quarterfinals",
          "03.29-03.31: Losers Round 1 + Semifinals",
          "04.01-04.03: Losers Rounds 2-3 + Winners Final",
          "04.04-04.07: Losers Final + Grand Final",
        ]
      : [
          "26.03-28.03: Ćwierćfinały",
          "29.03-31.03: Runda 1 drabinki przegranych + Półfinały",
          "01.04-03.04: Rundy 2-3 drabinki przegranych + Finał drabinki zwycięzców",
          "04.04-07.04: Finał drabinki przegranych + Wielki finał",
        ]
    : t.tournamentDetail.playoffsBracket.deadlinesLines;

  const playoffResults = useMemo(
    () => tournament?.playoffs?.winnersRound1 ?? [],
    [tournament],
  );
  const playoffQuarterfinalResults = useMemo(
    () => tournament?.playoffs?.winnersQuarterfinals ?? [],
    [tournament],
  );
  const playoffSemifinalResults = useMemo(
    () => tournament?.playoffs?.winnersSemifinals ?? [],
    [tournament],
  );
  const playoffWinnersFinalResults = useMemo(
    () => tournament?.playoffs?.winnersFinal ?? [],
    [tournament],
  );
  const playoffLosersRound1Results = useMemo(
    () => tournament?.playoffs?.losersRound1 ?? [],
    [tournament],
  );
  const playoffLosersRound2Results = useMemo(
    () => tournament?.playoffs?.losersRound2 ?? [],
    [tournament],
  );
  const playoffLosersRound3Results = useMemo(
    () => tournament?.playoffs?.losersRound3 ?? [],
    [tournament],
  );
  const playoffLosersFinalResults = useMemo(
    () => tournament?.playoffs?.losersFinal ?? [],
    [tournament],
  );
  const playoffGrandFinalResults = useMemo(
    () => tournament?.playoffs?.grandFinal ?? [],
    [tournament],
  );
  const compactSemifinalMatches = useMemo(
    () => tournament?.playoffs?.winnersSemifinals?.slice(0, 2) ?? [],
    [tournament],
  );
  const matchKey = (home: string, away: string) =>
    [home, away].sort().join("|");
  const parseScore = (score?: string) => {
    if (!score) {
      return null;
    }
    const scoreRegex = /(\d+)\s*:\s*(\d+)/;
    const result = scoreRegex.exec(score);
    if (!result) {
      return null;
    }
    return {
      home: Number(result[1]),
      away: Number(result[2]),
    };
  };
  const buildResultsMap = (results: TournamentMatch[]) => {
    const resultsByPair = new Map<string, TournamentMatch>();
    results.forEach((result) => {
      if (result.score) {
        resultsByPair.set(matchKey(result.home, result.away), result);
      }
    });
    return resultsByPair;
  };
  const normalizeBracketParticipant = (name: string) =>
    name
      .replace(/^Zwycięzca\b/i, "Winner")
      .replace(/^Przegrany\b/i, "Loser")
      .replace(/\s+/g, " ")
      .trim();
  const resolveScoreFromMap = (
    resultsByPair: Map<string, TournamentMatch>,
    home: string,
    away: string,
  ) => {
    const storedResult =
      resultsByPair.get(matchKey(home, away)) ??
      [...resultsByPair.values()].find((result) => {
        const directMatch =
          normalizeBracketParticipant(result.home) ===
            normalizeBracketParticipant(home) &&
          normalizeBracketParticipant(result.away) ===
            normalizeBracketParticipant(away);
        const reverseMatch =
          normalizeBracketParticipant(result.home) ===
            normalizeBracketParticipant(away) &&
          normalizeBracketParticipant(result.away) ===
            normalizeBracketParticipant(home);
        return directMatch || reverseMatch;
      });
    if (!storedResult?.score) {
      return undefined;
    }
    if (storedResult.home === home && storedResult.away === away) {
      return storedResult.score;
    }
    if (
      (storedResult.home === away && storedResult.away === home) ||
      (normalizeBracketParticipant(storedResult.home) ===
        normalizeBracketParticipant(away) &&
        normalizeBracketParticipant(storedResult.away) ===
          normalizeBracketParticipant(home))
    ) {
      const parsed = parseScore(storedResult.score);
      return parsed ? `${parsed.away}:${parsed.home}` : storedResult.score;
    }
    return storedResult.score;
  };
  const isPlaceholderCompetitor = (name: string) =>
    /^(Winner|Loser|Zwycięzca|Przegrany)\b|^TBD$/i.test(name);
  const resolveWinnerFromMap = (
    resultsByPair: Map<string, TournamentMatch>,
    home: string,
    away: string,
  ) => {
    const score = resolveScoreFromMap(resultsByPair, home, away);
    const parsed = parseScore(score);
    if (!parsed || parsed.home === parsed.away) {
      return null;
    }
    return parsed.home > parsed.away ? home : away;
  };

  const winnersRound1 = useMemo(() => {
    if (qualifiedPlayers.length === 0) {
      return [];
    }

    type SeedPlayer = {
      player: string;
      points: number;
      seed?: number;
      seedNumber?: number;
      group?: string;
    };

    const orderedEntries: SeedPlayer[] = [...qualifiedPlayers];
    const seen = new Set<string>();
    const uniqueEntries = orderedEntries.filter((entry) => {
      if (seen.has(entry.player)) {
        return false;
      }
      seen.add(entry.player);
      return true;
    });

    const firstSeeds = uniqueEntries.filter((entry) => entry.seed === 1);
    const secondSeeds = uniqueEntries.filter((entry) => entry.seed === 2);
    const desiredMatchCount = isEightBracket ? 4 : 8;
    const limitedFirstSeeds = firstSeeds.slice(0, desiredMatchCount);
    const remainingSeconds = [...secondSeeds];
    const seededFirst = limitedFirstSeeds.map((entry, index) => ({
      ...entry,
      seedNumber: index + 1,
    }));
    const seededSecond = remainingSeconds.map((entry, index) => ({
      ...entry,
      seedNumber: seededFirst.length + index + 1,
    }));

    const matches: Array<{ home: SeedPlayer | null; away: SeedPlayer | null }> =
      [];

    seededFirst.forEach((first) => {
      let index = seededSecond.findIndex(
        (entry) => entry.group !== first.group,
      );
      if (index === -1) {
        index = 0;
      }
      const second =
        index >= 0 ? (seededSecond.splice(index, 1)[0] ?? null) : null;
      matches.push({ home: first, away: second });
    });

    while (seededSecond.length > 0 && matches.length < desiredMatchCount) {
      matches.push({ home: null, away: seededSecond.shift() ?? null });
    }

    while (matches.length < desiredMatchCount) {
      matches.push({ home: null, away: null });
    }

    const resultsByPair = buildResultsMap(playoffResults);

    return matches.map((match, index) => {
      const home =
        match.home?.player ?? t.tournamentDetail.playoffsBracket.placeholderTbd;
      const away =
        match.away?.player ?? t.tournamentDetail.playoffsBracket.placeholderTbd;
      const score = resolveScoreFromMap(resultsByPair, home, away);

      return {
        id: `W${index + 1}`,
        home,
        away,
        score,
      };
    });
  }, [isEightBracket, qualifiedPlayers, t, playoffResults]);

  const playoffOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const loserById = new Map<string, string>();

    winnersRound1.forEach((match) => {
      if (!match.score) {
        return;
      }
      const parsed = parseScore(match.score);
      if (!parsed || parsed.home === parsed.away) {
        return;
      }
      const winner = parsed.home > parsed.away ? match.home : match.away;
      const loser = parsed.home > parsed.away ? match.away : match.home;
      winnerById.set(match.id, winner);
      loserById.set(match.id, loser);
    });

    return {
      winnerById,
      loserById,
    };
  }, [winnersRound1]);

  const resolveWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnersWPrefix;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `W${suffix}`;
    return playoffOutcomes.winnerById.get(id) ?? label;
  };

  const resolveLoserLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.loserWPrefix;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `W${suffix}`;
    return playoffOutcomes.loserById.get(id) ?? label;
  };

  const quarterfinalResultsByPair = useMemo(
    () => buildResultsMap(playoffQuarterfinalResults),
    [playoffQuarterfinalResults],
  );
  const semifinalResultsByPair = useMemo(
    () => buildResultsMap(playoffSemifinalResults),
    [playoffSemifinalResults],
  );
  const winnersFinalResultsByPair = useMemo(
    () => buildResultsMap(playoffWinnersFinalResults),
    [playoffWinnersFinalResults],
  );

  const losersRound1ResultsByPair = useMemo(
    () => buildResultsMap(playoffLosersRound1Results),
    [playoffLosersRound1Results],
  );
  const losersRound2ResultsByPair = useMemo(
    () => buildResultsMap(playoffLosersRound2Results),
    [playoffLosersRound2Results],
  );
  const losersRound3ResultsByPair = useMemo(
    () => buildResultsMap(playoffLosersRound3Results),
    [playoffLosersRound3Results],
  );
  const losersFinalResultsByPair = useMemo(
    () => buildResultsMap(playoffLosersFinalResults),
    [playoffLosersFinalResults],
  );
  const grandFinalResultsByPair = useMemo(
    () => buildResultsMap(playoffGrandFinalResults),
    [playoffGrandFinalResults],
  );
  const compactSemifinal1 = compactSemifinalMatches[0] ?? {
    home: t.tournamentDetail.playoffsBracket.placeholderTbd,
    away: t.tournamentDetail.playoffsBracket.placeholderTbd,
  };
  const compactSemifinal2 = compactSemifinalMatches[1] ?? {
    home: t.tournamentDetail.playoffsBracket.placeholderTbd,
    away: t.tournamentDetail.playoffsBracket.placeholderTbd,
  };
  const compactFinalHome =
    resolveWinnerFromMap(
      semifinalResultsByPair,
      compactSemifinal1.home,
      compactSemifinal1.away,
    ) ?? `${t.tournamentDetail.playoffsBracket.winnerPrefix} SF1`;
  const compactFinalAway =
    resolveWinnerFromMap(
      semifinalResultsByPair,
      compactSemifinal2.home,
      compactSemifinal2.away,
    ) ?? `${t.tournamentDetail.playoffsBracket.winnerPrefix} SF2`;
  const compactFinalScore =
    playoffGrandFinalResults[0]?.score ??
    resolveScoreFromMap(
      grandFinalResultsByPair,
      compactFinalHome,
      compactFinalAway,
    );

  const wq1Home = resolveWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWPrefix}1`,
  );
  const wq1Away = resolveWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWPrefix}2`,
  );
  const wq2Home = resolveWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWPrefix}3`,
  );
  const wq2Away = resolveWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWPrefix}4`,
  );
  const wq3Home = resolveWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWPrefix}5`,
  );
  const wq3Away = resolveWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWPrefix}6`,
  );
  const wq4Home = resolveWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWPrefix}7`,
  );
  const wq4Away = resolveWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWPrefix}8`,
  );

  const wqOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const loserById = new Map<string, string>();
    const matches = isEightBracket
      ? [
          { id: "WQ1", home: wq1Home, away: wq1Away },
          { id: "WQ2", home: wq2Home, away: wq2Away },
        ]
      : [
          { id: "WQ1", home: wq1Home, away: wq1Away },
          { id: "WQ2", home: wq2Home, away: wq2Away },
          { id: "WQ3", home: wq3Home, away: wq3Away },
          { id: "WQ4", home: wq4Home, away: wq4Away },
        ];

    matches.forEach((match) => {
      const score = resolveScoreFromMap(
        quarterfinalResultsByPair,
        match.home,
        match.away,
      );
      const parsed = parseScore(score);
      if (!parsed || parsed.home === parsed.away) {
        return;
      }
      const winner = parsed.home > parsed.away ? match.home : match.away;
      const loser = parsed.home > parsed.away ? match.away : match.home;
      winnerById.set(match.id, winner);
      loserById.set(match.id, loser);
    });

    return {
      winnerById,
      loserById,
    };
  }, [
    isEightBracket,
    quarterfinalResultsByPair,
    wq1Away,
    wq1Home,
    wq2Away,
    wq2Home,
    wq3Away,
    wq3Home,
    wq4Away,
    wq4Home,
  ]);

  const resolveWQWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnersWQPrefix;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `WQ${suffix}`;
    return wqOutcomes.winnerById.get(id) ?? label;
  };

  const resolveWQLoserLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.loserWQPrefix;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `WQ${suffix}`;
    return wqOutcomes.loserById.get(id) ?? label;
  };

  const ws1Home = resolveWQWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}1`,
  );
  const ws1Away = resolveWQWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}2`,
  );
  const ws2Home = resolveWQWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}3`,
  );
  const ws2Away = resolveWQWinnerLabel(
    `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}4`,
  );

  const wsOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const loserById = new Map<string, string>();
    const matches = [
      { id: "WS1", home: ws1Home, away: ws1Away },
      { id: "WS2", home: ws2Home, away: ws2Away },
    ];

    matches.forEach((match) => {
      const score = resolveScoreFromMap(
        semifinalResultsByPair,
        match.home,
        match.away,
      );
      const parsed = parseScore(score);
      if (!parsed || parsed.home === parsed.away) {
        return;
      }
      const winner = parsed.home > parsed.away ? match.home : match.away;
      const loser = parsed.home > parsed.away ? match.away : match.home;
      winnerById.set(match.id, winner);
      loserById.set(match.id, loser);
    });

    return {
      winnerById,
      loserById,
    };
  }, [semifinalResultsByPair, ws1Away, ws1Home, ws2Away, ws2Home]);

  const resolveWSWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnersWSPrefix;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `WS${suffix}`;
    return wsOutcomes.winnerById.get(id) ?? label;
  };

  const resolveWSLoserLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.loserWSPrefix;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `WS${suffix}`;
    return wsOutcomes.loserById.get(id) ?? label;
  };

  const wfHome = isEightBracket
    ? resolveWQWinnerLabel(
        `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}1`,
      )
    : resolveWSWinnerLabel(
        `${t.tournamentDetail.playoffsBracket.winnersWSPrefix}1`,
      );
  const wfAway = isEightBracket
    ? resolveWQWinnerLabel(
        `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}2`,
      )
    : resolveWSWinnerLabel(
        `${t.tournamentDetail.playoffsBracket.winnersWSPrefix}2`,
      );

  const wfOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const loserById = new Map<string, string>();
    const match = { id: "WF", home: wfHome, away: wfAway };
    const score = resolveScoreFromMap(
      isEightBracket ? semifinalResultsByPair : winnersFinalResultsByPair,
      match.home,
      match.away,
    );
    const parsed = parseScore(score);
    if (!parsed || parsed.home === parsed.away) {
      return { winnerById, loserById };
    }
    const winner = parsed.home > parsed.away ? match.home : match.away;
    const loser = parsed.home > parsed.away ? match.away : match.home;
    winnerById.set(match.id, winner);
    loserById.set(match.id, loser);
    return { winnerById, loserById };
  }, [
    isEightBracket,
    semifinalResultsByPair,
    wfAway,
    wfHome,
    winnersFinalResultsByPair,
  ]);

  const resolveWFWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnerWF;
    if (!label.startsWith(prefix)) {
      return label;
    }
    return wfOutcomes.winnerById.get("WF") ?? label;
  };

  const resolveWFLoserLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.loserWF;
    if (!label.startsWith(prefix)) {
      return label;
    }
    return wfOutcomes.loserById.get("WF") ?? label;
  };

  const l1Home = resolveLoserLabel(
    `${t.tournamentDetail.playoffsBracket.loserWPrefix}1`,
  );
  const l1Away = resolveLoserLabel(
    `${t.tournamentDetail.playoffsBracket.loserWPrefix}2`,
  );
  const l2Home = resolveLoserLabel(
    `${t.tournamentDetail.playoffsBracket.loserWPrefix}3`,
  );
  const l2Away = resolveLoserLabel(
    `${t.tournamentDetail.playoffsBracket.loserWPrefix}4`,
  );
  const l3Home = resolveLoserLabel(
    `${t.tournamentDetail.playoffsBracket.loserWPrefix}5`,
  );
  const l3Away = resolveLoserLabel(
    `${t.tournamentDetail.playoffsBracket.loserWPrefix}6`,
  );
  const l4Home = resolveLoserLabel(
    `${t.tournamentDetail.playoffsBracket.loserWPrefix}7`,
  );
  const l4Away = resolveLoserLabel(
    `${t.tournamentDetail.playoffsBracket.loserWPrefix}8`,
  );

  const losersRound1Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const matches = isEightBracket
      ? [
          { id: "L1", home: l1Home, away: l1Away },
          { id: "L2", home: l2Home, away: l2Away },
        ]
      : [
          { id: "L1", home: l1Home, away: l1Away },
          { id: "L2", home: l2Home, away: l2Away },
          { id: "L3", home: l3Home, away: l3Away },
          { id: "L4", home: l4Home, away: l4Away },
        ];

    matches.forEach((match) => {
      const score = resolveScoreFromMap(
        losersRound1ResultsByPair,
        match.home,
        match.away,
      );
      const parsed = parseScore(score);
      if (!parsed || parsed.home === parsed.away) {
        return;
      }
      const winner = parsed.home > parsed.away ? match.home : match.away;
      winnerById.set(match.id, winner);
    });

    return { winnerById };
  }, [
    isEightBracket,
    l1Away,
    l1Home,
    l2Away,
    l2Home,
    l3Away,
    l3Home,
    l4Away,
    l4Home,
    losersRound1ResultsByPair,
  ]);

  const resolveLosersRound1WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `L${suffix}`;
    return losersRound1Outcomes.winnerById.get(id) ?? label;
  };

  const losersRound2Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const matches = isEightBracket
      ? [
          {
            id: "L3",
            home: resolveLosersRound1WinnerLabel(
              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L1`,
            ),
            away: resolveWQLoserLabel(
              `${t.tournamentDetail.playoffsBracket.loserWQPrefix}1`,
            ),
          },
          {
            id: "L4",
            home: resolveLosersRound1WinnerLabel(
              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`,
            ),
            away: resolveWQLoserLabel(
              `${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`,
            ),
          },
        ]
      : [
          {
            id: "L6",
            home: resolveLosersRound1WinnerLabel(
              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`,
            ),
            away: resolveWQLoserLabel(
              `${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`,
            ),
          },
          {
            id: "L7",
            home: resolveLosersRound1WinnerLabel(
              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`,
            ),
            away: resolveWQLoserLabel(
              `${t.tournamentDetail.playoffsBracket.loserWQPrefix}3`,
            ),
          },
          {
            id: "L8",
            home: isStyczen1
              ? "I3anani_PL"
              : resolveLosersRound1WinnerLabel(
                  `${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`,
                ),
            away: isStyczen1
              ? "TYMEK2k11"
              : resolveWQLoserLabel(
                  `${t.tournamentDetail.playoffsBracket.loserWQPrefix}4`,
                ),
          },
        ];

    matches.forEach((match) => {
      const score = resolveScoreFromMap(
        losersRound2ResultsByPair,
        match.home,
        match.away,
      );
      const parsed = parseScore(score);
      if (!parsed || parsed.home === parsed.away) {
        if (isEightBracket) {
          const homeIsPlaceholder = isPlaceholderCompetitor(match.home);
          const awayIsPlaceholder = isPlaceholderCompetitor(match.away);
          if (homeIsPlaceholder !== awayIsPlaceholder) {
            winnerById.set(
              match.id,
              homeIsPlaceholder ? match.away : match.home,
            );
          }
        }
        return;
      }
      const winner = parsed.home > parsed.away ? match.home : match.away;
      winnerById.set(match.id, winner);
    });

    return { winnerById };
  }, [
    isEightBracket,
    losersRound1Outcomes,
    losersRound2ResultsByPair,
    t,
    wqOutcomes,
    isStyczen1,
  ]);

  const resolveLosersRound2WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `L${suffix}`;
    return losersRound2Outcomes.winnerById.get(id) ?? label;
  };

  const losersRound3Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const matches: Array<{
      id: string;
      home: string;
      away: string;
      score?: string;
    }> = isEightBracket
      ? [
          {
            id: "L5",
            home: resolveLosersRound2WinnerLabel(
              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`,
            ),
            away: resolveLosersRound2WinnerLabel(
              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`,
            ),
          },
        ]
      : [
          {
            id: "L9",
            home: "Tommy__Rev",
            away: isStyczen1
              ? "Rumcajs_PL"
              : `${t.tournamentDetail.playoffsBracket.winnerPrefix} L6`,
            score: isStyczen1 ? "1:8" : undefined,
          },
          {
            id: "L10",
            home: "andriizrv",
            away: resolveLosersRound2WinnerLabel(
              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L8`,
            ),
            score: "2:6",
          },
        ];

    matches.forEach((match) => {
      const score = isEightBracket
        ? resolveScoreFromMap(losersRound3ResultsByPair, match.home, match.away)
        : match.score;
      if (!score) {
        return;
      }
      const parsed = parseScore(score);
      if (!parsed || parsed.home === parsed.away) {
        return;
      }
      const winner = parsed.home > parsed.away ? match.home : match.away;
      winnerById.set(match.id, winner);
    });

    return { winnerById };
  }, [
    isEightBracket,
    isStyczen1,
    losersRound3ResultsByPair,
    resolveLosersRound2WinnerLabel,
    resolveScoreFromMap,
    t,
  ]);

  const resolveLosersRound3WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `L${suffix}`;
    return losersRound3Outcomes.winnerById.get(id) ?? label;
  };

  const losersRound4Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const matches = [
      {
        id: "L11",
        home: resolveLosersRound3WinnerLabel(
          `${t.tournamentDetail.playoffsBracket.winnerPrefix} L9`,
        ),
        away: isStyczen1
          ? "wiksoonszef"
          : `${t.tournamentDetail.playoffsBracket.winnerPrefix} L9`,
        score: isStyczen1 ? "4:5" : undefined,
      },
      {
        id: "L12",
        home: resolveLosersRound3WinnerLabel(
          `${t.tournamentDetail.playoffsBracket.winnerPrefix} L10`,
        ),
        away: resolveWSLoserLabel(
          `${t.tournamentDetail.playoffsBracket.loserWSPrefix}2`,
        ),
        score: isStyczen1 ? "3:0" : undefined,
      },
    ];

    matches.forEach((match) => {
      if (!match.score) {
        return;
      }
      const parsed = parseScore(match.score);
      if (!parsed || parsed.home === parsed.away) {
        return;
      }
      const winner = parsed.home > parsed.away ? match.home : match.away;
      winnerById.set(match.id, winner);
    });

    return { winnerById };
  }, [isStyczen1, resolveLosersRound3WinnerLabel, resolveWSLoserLabel, t]);

  const resolveLosersRound4WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `L${suffix}`;
    return losersRound4Outcomes.winnerById.get(id) ?? label;
  };

  const losersRound5Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const matches = [
      {
        id: "L13",
        home: resolveLosersRound4WinnerLabel(
          `${t.tournamentDetail.playoffsBracket.winnerPrefix} L11`,
        ),
        away: resolveLosersRound4WinnerLabel(
          `${t.tournamentDetail.playoffsBracket.winnerPrefix} L12`,
        ),
        score: isStyczen1 ? "5:3" : undefined,
      },
    ];

    matches.forEach((match) => {
      if (!match.score) {
        return;
      }
      const parsed = parseScore(match.score);
      if (!parsed || parsed.home === parsed.away) {
        return;
      }
      const winner = parsed.home > parsed.away ? match.home : match.away;
      winnerById.set(match.id, winner);
    });

    return { winnerById };
  }, [isStyczen1, resolveLosersRound4WinnerLabel, t]);

  const resolveLosersRound5WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`;
    if (!label.startsWith(prefix)) {
      return label;
    }
    const suffix = label.slice(prefix.length).trim();
    const id = `L${suffix}`;
    return losersRound5Outcomes.winnerById.get(id) ?? label;
  };

  const losersFinalOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>();
    const matches: Array<{
      id: string;
      home: string;
      away: string;
      score?: string;
    }> = isEightBracket
      ? [
          {
            id: "LF",
            home: resolveLosersRound3WinnerLabel(
              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L5`,
            ),
            away: resolveWFLoserLabel(
              t.tournamentDetail.playoffsBracket.loserWF,
            ),
          },
        ]
      : [];

    matches.forEach((match) => {
      const score = resolveScoreFromMap(
        losersFinalResultsByPair,
        match.home,
        match.away,
      );
      const parsed = parseScore(score);
      if (!parsed || parsed.home === parsed.away) {
        return;
      }
      const winner = parsed.home > parsed.away ? match.home : match.away;
      winnerById.set(match.id, winner);
    });

    return { winnerById };
  }, [
    isEightBracket,
    losersFinalResultsByPair,
    resolveLosersRound3WinnerLabel,
    resolveScoreFromMap,
    resolveWFLoserLabel,
    t,
  ]);

  const resolveLosersFinalWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnerLF;
    if (label !== prefix) {
      return label;
    }
    return losersFinalOutcomes.winnerById.get("LF") ?? label;
  };

  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex flex-1 flex-col">
        <section className="w-full bg-gradient-to-r from-[#2815d3] to-[#a83acd] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">
              {tournament ? tournament.title : t.tournamentDetail.titleFallback}
            </h1>
            <p className="text-lg text-white/90">
              {t.tournamentDetail.subtitle}
            </p>
          </div>
        </section>

        <section className="w-full flex-1 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] px-4 py-20 md:px-8">
          <div className="mx-auto w-full max-w-6xl">
            {!tournament ? (
              <div className="text-foreground/70 rounded-lg border border-[#2815d3]/40 bg-[#1a0f2e] p-8 text-center">
                {t.tournamentDetail.notFound}
              </div>
            ) : (
              <div className="w-full">
                <Link
                  href={`/${locale}/tournaments`}
                  className="mb-4 inline-flex cursor-pointer items-center text-sm text-white/80 underline underline-offset-4"
                >
                  {t.tournamentDetail.back}
                </Link>
                <Card className="w-full border-[#2815d3]/40 bg-[#1a0f2e]">
                  <CardHeader className="space-y-6">
                    <CardTitle className="bg-gradient-to-r from-[#a83acd] to-[#2815d3] bg-clip-text text-2xl text-transparent">
                      {tournament.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("info")}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                          activeTab === "info"
                            ? "bg-[#a83acd] text-white"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        {t.tournamentDetail.tabs.info}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("players")}
                        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                          activeTab === "players"
                            ? "bg-[#a83acd] text-white"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        {t.tournamentDetail.tabs.players}
                      </button>
                      {showGroupsPlayoffs ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setActiveTab("groups")}
                            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                              activeTab === "groups"
                                ? "bg-[#a83acd] text-white"
                                : "bg-white/10 text-white/70 hover:bg-white/20"
                            }`}
                          >
                            {groupsTabLabel}
                          </button>
                          {showPlayoffs ? (
                            <button
                              type="button"
                              onClick={() => setActiveTab("playoffs")}
                              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                activeTab === "playoffs"
                                  ? "bg-[#a83acd] text-white"
                                  : "bg-white/10 text-white/70 hover:bg-white/20"
                              }`}
                            >
                              {t.tournamentDetail.tabs.playoffs}
                            </button>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeTab === "info" ? (
                      <TournamentInfoTab
                        summaryTitle={t.tournamentDetail.info.title}
                        registrationButtonLabel={t.registration.button}
                        guardianConsentButtonLabel={
                          t.tournamentDetail.guardianConsentCta
                        }
                        showRegistrationButton={
                          tournament.isRegistrationOpen &&
                          hasRegistrationForm(tournament, locale)
                        }
                        showGuardianConsentButton={isSeasonOneTournament(
                          tournament,
                        )}
                        registrationUrl={getRegistrationFormUrl(
                          tournament,
                          locale,
                        )}
                        guardianConsentUrl={guardianConsentUrl}
                        regulationsUrl={regulationsUrl}
                        discordUrl="https://discord.gg/xAzn6DzuVP"
                        summaryLabels={{
                          registration: t.tournamentDetail.labels.registration,
                          start: t.tournamentDetail.labels.start,
                          status: t.tournamentDetail.labels.status,
                          info: t.tournamentDetail.labels.info,
                        }}
                        summary={{
                          registration:
                            locale === "en"
                              ? (tournament.registrationLabelEn ??
                                tournament.registrationLabel ??
                                tournament.registrationDate)
                              : (tournament.registrationLabel ??
                                tournament.registrationDate),
                          start: tournament.startDate,
                          status: tournament.isOngoing
                            ? t.tournamentDetail.statusOngoing
                            : tournament.isRegistrationOpen
                              ? t.tournamentDetail.statusOpen
                              : ((locale === "en"
                                  ? tournament.statusLabelEn
                                  : tournament.statusLabel) ??
                                t.tournamentDetail.statusOpen),
                          noticeLabel:
                            ((locale === "en"
                              ? tournament.registrationNoticeEn
                              : tournament.registrationNotice) ??
                            tournament.registrationNotice)
                              ? locale === "en"
                                ? "Notice"
                                : "Komunikat"
                              : undefined,
                          noticeValue:
                            (locale === "en"
                              ? tournament.registrationNoticeEn
                              : tournament.registrationNotice) ??
                            tournament.registrationNotice,
                          accessLabel:
                            tournament.id === 4
                              ? locale === "en"
                                ? "Access"
                                : "Dostęp"
                              : undefined,
                          accessValue:
                            tournament.id === 4
                              ? locale === "en"
                                ? "Active SAL Patronite subscription required"
                                : "Wymagana aktywna subskrypcja SAL na Patronite"
                              : undefined,
                          accessUrl:
                            tournament.id === 4
                              ? "https://patronite.pl/SAL"
                              : undefined,
                          infoHintPrefix: t.tournamentDetail.infoHintPrefix,
                          infoHintLink: t.tournamentDetail.infoHintLink,
                          regulationsLabel:
                            t.tournamentDetail.labels.regulations,
                          regulationsCta: t.tournamentDetail.regulationsCta,
                        }}
                        sections={infoSections}
                      />
                    ) : null}

                    {activeTab === "players" ? (
                      <TournamentPlayersTab
                        players={tournament.players}
                        emptyText={t.tournamentDetail.playersEmpty}
                      />
                    ) : null}

                    {showGroupsPlayoffs && activeTab === "groups" ? (
                      tournament.groups.length > 0 ? (
                        <div className="space-y-6">
                          {groupNoticeLines.length > 0 ? (
                            <div className="rounded-lg border border-[#a83acd]/50 bg-gradient-to-r from-[#2815d3]/30 to-[#a83acd]/20 p-4 text-sm text-white shadow-[0_0_30px_rgba(168,58,205,0.25)]">
                              {groupNoticeLines.map((line) => (
                                <p key={line} className="font-semibold">
                                  {line}
                                </p>
                              ))}
                            </div>
                          ) : null}
                          <div className="grid gap-4 md:grid-cols-2">
                            {tournament.groups.map((group) => (
                              <div
                                key={group.name}
                                className="rounded-lg border border-white/10 bg-white/5 p-4"
                              >
                                <h3 className="text-foreground mb-3 text-base font-semibold">
                                  {group.name}
                                </h3>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-foreground/90 mb-2 text-sm font-semibold">
                                      {t.tournamentDetail.groups.standingsTitle}
                                    </h4>
                                    <div className="max-w-full overflow-x-auto rounded-lg border border-white/10">
                                      <table className="text-foreground/90 w-full table-fixed text-sm">
                                        <thead className="text-foreground/70 bg-white/5">
                                          <tr>
                                            <th className="px-3 py-2 text-left font-semibold">
                                              {
                                                t.tournamentDetail.groups
                                                  .standingsColumns.player
                                              }
                                            </th>
                                            <th className="px-3 py-2 text-center font-semibold">
                                              {
                                                t.tournamentDetail.groups
                                                  .standingsColumns.win
                                              }
                                            </th>
                                            <th className="px-3 py-2 text-center font-semibold">
                                              {
                                                t.tournamentDetail.groups
                                                  .standingsColumns.draw
                                              }
                                            </th>
                                            <th className="px-3 py-2 text-center font-semibold">
                                              {
                                                t.tournamentDetail.groups
                                                  .standingsColumns.loss
                                              }
                                            </th>
                                            <th className="px-3 py-2 text-center font-semibold">
                                              {
                                                t.tournamentDetail.groups
                                                  .standingsColumns.points
                                              }
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {group.standings.map((row, index) => {
                                            const advanceSlots =
                                              group.advanceSlots ?? 2;

                                            return (
                                              <tr
                                                key={`${group.name}-${row.player}`}
                                                className={`border-t border-white/10 ${
                                                  index < advanceSlots
                                                    ? "bg-emerald-500/15"
                                                    : ""
                                                }`}
                                              >
                                              <td
                                                className="truncate px-3 py-2 text-left"
                                                title={row.player}
                                              >
                                                {row.player}
                                              </td>
                                              <td className="px-3 py-2 text-center">
                                                {row.win}
                                              </td>
                                              <td className="px-3 py-2 text-center">
                                                {row.draw ?? 0}
                                              </td>
                                              <td className="px-3 py-2 text-center">
                                                {row.loss}
                                              </td>
                                              <td className="px-3 py-2 text-center font-semibold text-[#a83acd]">
                                                {row.points}
                                              </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="mb-2 text-sm font-semibold text-sky-300">
                                      {
                                        t.tournamentDetail.groups
                                          .matchesScheduledTitle
                                      }
                                    </h4>
                                    {group.matches.scheduled.length === 0 ? (
                                      <p className="text-foreground/70 text-sm">
                                        {t.tournamentDetail.groups.matchesEmpty}
                                      </p>
                                    ) : (
                                      <ul className="text-foreground/90 space-y-3 text-sm">
                                        {(
                                          groupedScheduledMatches.get(
                                            group.name,
                                          ) ?? []
                                        ).map((series) => (
                                          <li
                                            key={`${group.name}-${series.players[0]}-${series.players[1]}`}
                                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                                          >
                                            <div className="flex items-center justify-between gap-3">
                                              <span className="font-semibold text-white">
                                                {series.players[0]} vs{" "}
                                                {series.players[1]}
                                              </span>
                                              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-xs font-semibold text-sky-200">
                                                {series.matches[1]
                                                  ? t.tournamentDetail.groups
                                                      .twoMatchesBadge
                                                  : t.tournamentDetail.groups
                                                      .oneMatchBadge}
                                              </span>
                                            </div>
                                            <div className="text-foreground/70 mt-2 space-y-1 text-xs">
                                              <p>
                                                {series.matches[1]
                                                  ? `${t.tournamentDetail.groups.firstLegLabel}: `
                                                  : ""}
                                                {series.matches[0]?.home} vs{" "}
                                                {series.matches[0]?.away}
                                              </p>
                                              {series.matches[1] ? (
                                                <p>
                                                  {
                                                    t.tournamentDetail.groups
                                                      .secondLegLabel
                                                  }
                                                  : {series.matches[1].home} vs{" "}
                                                  {series.matches[1].away}
                                                </p>
                                              ) : null}
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>

                                  <div>
                                    <h4 className="mb-2 text-sm font-semibold text-fuchsia-300">
                                      {
                                        t.tournamentDetail.groups
                                          .matchesPlayedTitle
                                      }
                                    </h4>
                                    {group.matches.played.length === 0 ? (
                                      <p className="text-foreground/70 text-sm">
                                        {
                                          t.tournamentDetail.groups
                                            .matchesPlayedEmpty
                                        }
                                      </p>
                                    ) : (
                                      <ul className="text-foreground/90 space-y-3 text-sm">
                                        {(
                                          groupedPlayedMatches.get(
                                            group.name,
                                          ) ?? []
                                        ).map((series) => (
                                          <li
                                            key={`${group.name}-played-${series.players[0]}-${series.players[1]}`}
                                            className="border border-white/10 bg-white/5 px-3 py-2"
                                          >
                                            <div className="flex items-center justify-between gap-3">
                                              <span className="font-semibold text-white">
                                                {series.players[0]} vs{" "}
                                                {series.players[1]}
                                              </span>
                                              {series.matches[1] ? (
                                                <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-0.5 text-xs font-semibold text-fuchsia-200">
                                                  {
                                                    t.tournamentDetail.groups
                                                      .twoMatchesBadge
                                                  }
                                                </span>
                                              ) : null}
                                            </div>
                                            <div className="mt-2 space-y-2">
                                              {series.matches.map(
                                                (match, index) => {
                                                  const scoreText =
                                                    match.score ?? "";
                                                  const mainMatch =
                                                    /^\s*(\d+)\s*:\s*(\d+)/.exec(
                                                      scoreText,
                                                    );
                                                  const homeScore = mainMatch
                                                    ? Number.parseInt(
                                                        mainMatch[1] ?? "",
                                                        10,
                                                      )
                                                    : Number.NaN;
                                                  const awayScore = mainMatch
                                                    ? Number.parseInt(
                                                        mainMatch[2] ?? "",
                                                        10,
                                                      )
                                                    : Number.NaN;
                                                  const tiebreakMatch =
                                                    /\((\d+)\s*:\s*(\d+)\)/.exec(
                                                      scoreText,
                                                    );
                                                  const homeTiebreak =
                                                    tiebreakMatch
                                                      ? Number.parseInt(
                                                          tiebreakMatch[1] ??
                                                            "",
                                                          10,
                                                        )
                                                      : Number.NaN;
                                                  const awayTiebreak =
                                                    tiebreakMatch
                                                      ? Number.parseInt(
                                                          tiebreakMatch[2] ??
                                                            "",
                                                          10,
                                                        )
                                                      : Number.NaN;
                                                  const hasScore =
                                                    Number.isFinite(
                                                      homeScore,
                                                    ) &&
                                                    Number.isFinite(awayScore);
                                                  const hasTiebreak =
                                                    Number.isFinite(
                                                      homeTiebreak,
                                                    ) &&
                                                    Number.isFinite(
                                                      awayTiebreak,
                                                    );
                                                  const isMainDraw =
                                                    hasScore &&
                                                    homeScore === awayScore;
                                                  const useTiebreak =
                                                    isMainDraw && hasTiebreak;
                                                  const homeResultScore =
                                                    useTiebreak
                                                      ? homeTiebreak
                                                      : homeScore;
                                                  const awayResultScore =
                                                    useTiebreak
                                                      ? awayTiebreak
                                                      : awayScore;
                                                  const homeClass = hasScore
                                                    ? homeResultScore >
                                                      awayResultScore
                                                      ? "text-emerald-400"
                                                      : homeResultScore <
                                                          awayResultScore
                                                        ? "text-rose-400"
                                                        : "text-amber-300"
                                                    : "text-foreground";
                                                  const awayClass = hasScore
                                                    ? awayResultScore >
                                                      homeResultScore
                                                      ? "text-emerald-400"
                                                      : awayResultScore <
                                                          homeResultScore
                                                        ? "text-rose-400"
                                                        : "text-amber-300"
                                                    : "text-foreground";

                                                  return (
                                                    <div
                                                      key={`${group.name}-played-${match.home}-${match.away}-${index}`}
                                                      className="border border-white/8 bg-black/10 px-2.5 py-2"
                                                    >
                                                      <div className="text-foreground/50 mb-1 text-xs">
                                                        <span>
                                                          {index === 0
                                                            ? t.tournamentDetail
                                                                .groups
                                                                .firstLegLabel
                                                            : t.tournamentDetail
                                                                .groups
                                                                .secondLegLabel}
                                                        </span>
                                                      </div>
                                                      <div className="flex items-center justify-between gap-3">
                                                        <span
                                                          className={`min-w-0 flex-1 font-semibold ${homeClass}`}
                                                        >
                                                          {match.home}
                                                        </span>
                                                        {match.score ? (
                                                          <span className="text-foreground/75 shrink-0 text-sm font-semibold">
                                                            {match.score}
                                                          </span>
                                                        ) : (
                                                          <span className="text-foreground/35 shrink-0 text-xs tracking-[0.18em] uppercase">
                                                            vs
                                                          </span>
                                                        )}
                                                        <span
                                                          className={`min-w-0 flex-1 text-right font-semibold ${awayClass}`}
                                                        >
                                                          {match.away}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  );
                                                },
                                              )}
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground/80">
                          {groupsEmptyText}
                        </div>
                      )
                    ) : null}

                    {showGroupsPlayoffs &&
                    showPlayoffs &&
                    activeTab === "playoffs" ? (
                      <div className="space-y-8">
                        {playoffsInfoBullets.length > 0 ? (
                          <div className="text-foreground/90 rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                            <p className="text-foreground mb-3 text-base font-semibold">
                              {playoffsInfoTitle}
                            </p>
                            <ul className="space-y-2 text-sm">
                              {playoffsInfoBullets.map((line) => (
                                <li key={line}>• {line}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {showSchedule ? (
                          <div className="text-foreground/90 rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                            <p className="text-foreground/60 mb-2 text-xs font-semibold tracking-wide uppercase">
                              {
                                t.tournamentDetail.playoffsBracket
                                  .deadlinesTitle
                              }
                            </p>
                            <ul className="space-y-1 text-sm">
                              {playoffDeadlineLines.map((line) => (
                                <li key={line}>• {line}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {qualifiedPlayers.length > 0 ? (
                          isApril1 ? (
                            <div className="space-y-4">
                              <h3 className="text-foreground text-base font-semibold">
                                {t.tournamentDetail.tabs.playoffs}
                              </h3>
                              <div className="overflow-x-auto">
                                <div className="grid min-w-0 grid-cols-1 gap-4 sm:min-w-[520px] sm:grid-cols-2">
                                  <BracketColumn
                                    title={
                                      t.tournamentDetail.playoffsBracket
                                        .semifinals
                                    }
                                  >
                                    <BracketMatch
                                      label="SF1"
                                      home={compactSemifinal1.home}
                                      away={compactSemifinal1.away}
                                      score={resolveScoreFromMap(
                                        semifinalResultsByPair,
                                        compactSemifinal1.home,
                                        compactSemifinal1.away,
                                      )}
                                    />
                                    <BracketMatch
                                      label="SF2"
                                      home={compactSemifinal2.home}
                                      away={compactSemifinal2.away}
                                      score={resolveScoreFromMap(
                                        semifinalResultsByPair,
                                        compactSemifinal2.home,
                                        compactSemifinal2.away,
                                      )}
                                    />
                                  </BracketColumn>
                                  <BracketColumn
                                    title={
                                      t.tournamentDetail.playoffsBracket
                                        .finalColumn
                                    }
                                  >
                                    <BracketMatch
                                      label="F"
                                      home={compactFinalHome}
                                      away={compactFinalAway}
                                      score={compactFinalScore}
                                    />
                                  </BracketColumn>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-4">
                                <h3 className="text-foreground text-base font-semibold">
                                  {
                                    t.tournamentDetail.playoffsBracket
                                      .grandFinalTitle
                                  }
                                </h3>
                                <div className="overflow-x-auto">
                                  <div className="flex min-w-0 justify-center sm:min-w-[200px]">
                                    <div className="w-full max-w-[220px]">
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .finalColumn,
                                          scheduleRanges.grandFinal,
                                        )}
                                        align="start"
                                        status={getRoundStatus(
                                          scheduleRanges.grandFinal,
                                        )}
                                      >
                                        <BracketMatch
                                          label={
                                            t.tournamentDetail.playoffsBracket
                                              .gfLabel
                                          }
                                          home={resolveWFWinnerLabel(
                                            t.tournamentDetail.playoffsBracket
                                              .winnerWF,
                                          )}
                                          away={
                                            isStyczen1
                                              ? "sliwkafc"
                                              : resolveLosersFinalWinnerLabel(
                                                  t.tournamentDetail
                                                    .playoffsBracket.winnerLF,
                                                )
                                          }
                                          size="compact"
                                          score={
                                            isStyczen1
                                              ? "6:3"
                                              : resolveScoreFromMap(
                                                  grandFinalResultsByPair,
                                                  resolveWFWinnerLabel(
                                                    t.tournamentDetail
                                                      .playoffsBracket.winnerWF,
                                                  ),
                                                  resolveLosersFinalWinnerLabel(
                                                    t.tournamentDetail
                                                      .playoffsBracket.winnerLF,
                                                  ),
                                                )
                                          }
                                        />
                                      </BracketColumn>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="text-foreground text-base font-semibold">
                                  {
                                    t.tournamentDetail.playoffsBracket
                                      .winnersTitle
                                  }
                                </h3>
                                <div className="overflow-x-auto">
                                  {isEightBracket ? (
                                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:min-w-[700px] sm:grid-cols-3">
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .quarterfinals,
                                          scheduleRanges.winnersQuarterfinals,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.winnersQuarterfinals,
                                        )}
                                      >
                                        {winnersRound1.map((match) => (
                                          <BracketMatch
                                            key={match.id}
                                            label={match.id}
                                            home={match.home}
                                            away={match.away}
                                            score={match.score}
                                          />
                                        ))}
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .semifinals,
                                          scheduleRanges.winnersSemifinals,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.winnersSemifinals,
                                        )}
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}1`}
                                          home={wq1Home}
                                          away={wq1Away}
                                          score={resolveScoreFromMap(
                                            quarterfinalResultsByPair,
                                            wq1Home,
                                            wq1Away,
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}2`}
                                          home={wq2Home}
                                          away={wq2Away}
                                          score={resolveScoreFromMap(
                                            quarterfinalResultsByPair,
                                            wq2Home,
                                            wq2Away,
                                          )}
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .winnersFinal,
                                          scheduleRanges.winnersFinal,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.winnersFinal,
                                        )}
                                      >
                                        <BracketMatch
                                          label={
                                            t.tournamentDetail.playoffsBracket
                                              .wfLabel
                                          }
                                          home={wfHome}
                                          away={wfAway}
                                          score={resolveScoreFromMap(
                                            semifinalResultsByPair,
                                            wfHome,
                                            wfAway,
                                          )}
                                        />
                                      </BracketColumn>
                                    </div>
                                  ) : (
                                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:min-w-[940px] sm:grid-cols-4">
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .roundOf16,
                                          scheduleRanges.winnersQuarterfinals,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.winnersQuarterfinals,
                                        )}
                                      >
                                        {winnersRound1.map((match) => (
                                          <BracketMatch
                                            key={match.id}
                                            label={match.id}
                                            home={match.home}
                                            away={match.away}
                                            score={match.score}
                                          />
                                        ))}
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .quarterfinals,
                                          scheduleRanges.winnersQuarterfinals,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.winnersQuarterfinals,
                                        )}
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}1`}
                                          home={wq1Home}
                                          away={wq1Away}
                                          score={resolveScoreFromMap(
                                            quarterfinalResultsByPair,
                                            wq1Home,
                                            wq1Away,
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}2`}
                                          home={wq2Home}
                                          away={wq2Away}
                                          score={resolveScoreFromMap(
                                            quarterfinalResultsByPair,
                                            wq2Home,
                                            wq2Away,
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}3`}
                                          home={wq3Home}
                                          away={wq3Away}
                                          score={resolveScoreFromMap(
                                            quarterfinalResultsByPair,
                                            wq3Home,
                                            wq3Away,
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}4`}
                                          home={wq4Home}
                                          away={wq4Away}
                                          score={resolveScoreFromMap(
                                            quarterfinalResultsByPair,
                                            wq4Home,
                                            wq4Away,
                                          )}
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .semifinals,
                                          scheduleRanges.winnersSemifinals,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.winnersSemifinals,
                                        )}
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.wsLabelPrefix}1`}
                                          home={resolveWQWinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}1`,
                                          )}
                                          away={resolveWQWinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}2`,
                                          )}
                                          score={resolveScoreFromMap(
                                            semifinalResultsByPair,
                                            resolveWQWinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}1`,
                                            ),
                                            resolveWQWinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}2`,
                                            ),
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.wsLabelPrefix}2`}
                                          home={resolveWQWinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}3`,
                                          )}
                                          away={resolveWQWinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}4`,
                                          )}
                                          score={resolveScoreFromMap(
                                            semifinalResultsByPair,
                                            resolveWQWinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}3`,
                                            ),
                                            resolveWQWinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnersWQPrefix}4`,
                                            ),
                                          )}
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .winnersFinal,
                                          scheduleRanges.winnersFinal,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.winnersFinal,
                                        )}
                                      >
                                        <BracketMatch
                                          label={
                                            t.tournamentDetail.playoffsBracket
                                              .wfLabel
                                          }
                                          home={resolveWSWinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnersWSPrefix}1`,
                                          )}
                                          away={resolveWSWinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnersWSPrefix}2`,
                                          )}
                                          score={resolveScoreFromMap(
                                            winnersFinalResultsByPair,
                                            resolveWSWinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnersWSPrefix}1`,
                                            ),
                                            resolveWSWinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnersWSPrefix}2`,
                                            ),
                                          )}
                                        />
                                      </BracketColumn>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="text-foreground text-base font-semibold">
                                  {
                                    t.tournamentDetail.playoffsBracket
                                      .losersTitle
                                  }
                                </h3>
                                <div className="overflow-x-auto">
                                  {isEightBracket ? (
                                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:min-w-[760px] sm:grid-cols-4">
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .losersRound1,
                                          scheduleRanges.losersRound1,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.losersRound1,
                                        )}
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}1`}
                                          home={l1Home}
                                          away={l1Away}
                                          score={resolveScoreFromMap(
                                            losersRound1ResultsByPair,
                                            l1Home,
                                            l1Away,
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}2`}
                                          home={l2Home}
                                          away={l2Away}
                                          score={resolveScoreFromMap(
                                            losersRound1ResultsByPair,
                                            l2Home,
                                            l2Away,
                                          )}
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .losersRound2,
                                          scheduleRanges.losersRound2,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.losersRound2,
                                        )}
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}3`}
                                          home={resolveLosersRound1WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L1`,
                                          )}
                                          away={resolveWQLoserLabel(
                                            `${t.tournamentDetail.playoffsBracket.loserWQPrefix}1`,
                                          )}
                                          score={resolveScoreFromMap(
                                            losersRound2ResultsByPair,
                                            resolveLosersRound1WinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L1`,
                                            ),
                                            resolveWQLoserLabel(
                                              `${t.tournamentDetail.playoffsBracket.loserWQPrefix}1`,
                                            ),
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}4`}
                                          home={resolveLosersRound1WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`,
                                          )}
                                          away={resolveWQLoserLabel(
                                            `${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`,
                                          )}
                                          score={resolveScoreFromMap(
                                            losersRound2ResultsByPair,
                                            resolveLosersRound1WinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`,
                                            ),
                                            resolveWQLoserLabel(
                                              `${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`,
                                            ),
                                          )}
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .losersRound3,
                                          scheduleRanges.losersRound3,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.losersRound3,
                                        )}
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}5`}
                                          home={resolveLosersRound2WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`,
                                          )}
                                          away={resolveLosersRound2WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`,
                                          )}
                                          score={resolveScoreFromMap(
                                            losersRound3ResultsByPair,
                                            resolveLosersRound2WinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`,
                                            ),
                                            resolveLosersRound2WinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`,
                                            ),
                                          )}
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .losersFinal,
                                          scheduleRanges.losersFinal,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.losersFinal,
                                        )}
                                      >
                                        <BracketMatch
                                          label={
                                            t.tournamentDetail.playoffsBracket
                                              .lfLabel
                                          }
                                          home={resolveLosersRound3WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L5`,
                                          )}
                                          away={resolveWFLoserLabel(
                                            t.tournamentDetail.playoffsBracket
                                              .loserWF,
                                          )}
                                          score={resolveScoreFromMap(
                                            losersFinalResultsByPair,
                                            resolveLosersRound3WinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L5`,
                                            ),
                                            resolveWFLoserLabel(
                                              t.tournamentDetail.playoffsBracket
                                                .loserWF,
                                            ),
                                          )}
                                        />
                                      </BracketColumn>
                                    </div>
                                  ) : (
                                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:min-w-[1020px] sm:grid-cols-6">
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .losersRound1,
                                          scheduleRanges.losersRound1,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.losersRound1,
                                        )}
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}1`}
                                          home={l1Home}
                                          away={l1Away}
                                          score={resolveScoreFromMap(
                                            losersRound1ResultsByPair,
                                            l1Home,
                                            l1Away,
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}2`}
                                          home={l2Home}
                                          away={l2Away}
                                          score={resolveScoreFromMap(
                                            losersRound1ResultsByPair,
                                            l2Home,
                                            l2Away,
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}3`}
                                          home={l3Home}
                                          away={l3Away}
                                          score={resolveScoreFromMap(
                                            losersRound1ResultsByPair,
                                            l3Home,
                                            l3Away,
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}4`}
                                          home={l4Home}
                                          away={l4Away}
                                          score={resolveScoreFromMap(
                                            losersRound1ResultsByPair,
                                            l4Home,
                                            l4Away,
                                          )}
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .losersRound2,
                                          scheduleRanges.losersRound2,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.losersRound2,
                                        )}
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}5`}
                                          home="Tommy__Rev"
                                          away="Kwaslun"
                                          score="3:2"
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}6`}
                                          home={resolveLosersRound1WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`,
                                          )}
                                          away={resolveWQLoserLabel(
                                            `${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`,
                                          )}
                                          score={resolveScoreFromMap(
                                            losersRound2ResultsByPair,
                                            resolveLosersRound1WinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`,
                                            ),
                                            resolveWQLoserLabel(
                                              `${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`,
                                            ),
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}7`}
                                          home={resolveLosersRound1WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`,
                                          )}
                                          away={resolveWQLoserLabel(
                                            `${t.tournamentDetail.playoffsBracket.loserWQPrefix}3`,
                                          )}
                                          score={resolveScoreFromMap(
                                            losersRound2ResultsByPair,
                                            resolveLosersRound1WinnerLabel(
                                              `${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`,
                                            ),
                                            resolveWQLoserLabel(
                                              `${t.tournamentDetail.playoffsBracket.loserWQPrefix}3`,
                                            ),
                                          )}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}8`}
                                          home={
                                            isStyczen1
                                              ? "I3anani_PL"
                                              : resolveLosersRound1WinnerLabel(
                                                  `${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`,
                                                )
                                          }
                                          away={
                                            isStyczen1
                                              ? "TYMEK2k11"
                                              : resolveWQLoserLabel(
                                                  `${t.tournamentDetail.playoffsBracket.loserWQPrefix}4`,
                                                )
                                          }
                                          score={
                                            isStyczen1
                                              ? resolveScoreFromMap(
                                                  losersRound2ResultsByPair,
                                                  "I3anani_PL",
                                                  "TYMEK2k11",
                                                )
                                              : resolveScoreFromMap(
                                                  losersRound2ResultsByPair,
                                                  resolveLosersRound1WinnerLabel(
                                                    `${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`,
                                                  ),
                                                  resolveWQLoserLabel(
                                                    `${t.tournamentDetail.playoffsBracket.loserWQPrefix}4`,
                                                  ),
                                                )
                                          }
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .losersRound3,
                                          scheduleRanges.losersRound3,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.losersRound3,
                                        )}
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}9`}
                                          home="Tommy__Rev"
                                          away={
                                            isStyczen1
                                              ? "Rumcajs_PL"
                                              : `${t.tournamentDetail.playoffsBracket.winnerPrefix} L6`
                                          }
                                          score={isStyczen1 ? "1:8" : undefined}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}10`}
                                          home="andriizrv"
                                          away={resolveLosersRound2WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L8`,
                                          )}
                                          score="2:6"
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={
                                          t.tournamentDetail.playoffsBracket
                                            .losersRound4
                                        }
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}11`}
                                          home={resolveLosersRound3WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L9`,
                                          )}
                                          away={
                                            isStyczen1
                                              ? "wiksoonszef"
                                              : `${t.tournamentDetail.playoffsBracket.winnerPrefix} L9`
                                          }
                                          score={isStyczen1 ? "4:5" : undefined}
                                        />
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}12`}
                                          home={resolveLosersRound3WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L10`,
                                          )}
                                          away={resolveWSLoserLabel(
                                            `${t.tournamentDetail.playoffsBracket.loserWSPrefix}2`,
                                          )}
                                          score={isStyczen1 ? "3:0" : undefined}
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={
                                          t.tournamentDetail.playoffsBracket
                                            .losersRound5
                                        }
                                      >
                                        <BracketMatch
                                          label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}13`}
                                          home={resolveLosersRound4WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L11`,
                                          )}
                                          away={resolveLosersRound4WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L12`,
                                          )}
                                          score={isStyczen1 ? "5:3" : undefined}
                                        />
                                      </BracketColumn>
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket
                                            .losersFinal,
                                          scheduleRanges.losersFinal,
                                        )}
                                        status={getRoundStatus(
                                          scheduleRanges.losersFinal,
                                        )}
                                      >
                                        <BracketMatch
                                          label={
                                            t.tournamentDetail.playoffsBracket
                                              .lfLabel
                                          }
                                          home={resolveLosersRound5WinnerLabel(
                                            `${t.tournamentDetail.playoffsBracket.winnerPrefix} L13`,
                                          )}
                                          away={resolveWFLoserLabel(
                                            t.tournamentDetail.playoffsBracket
                                              .loserWF,
                                          )}
                                          score={isStyczen1 ? "1:3" : undefined}
                                        />
                                      </BracketColumn>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )
                        ) : null}

                        {playoffGroups.length > 0 ? (
                          <div className="space-y-4">
                            <h3 className="text-foreground text-base font-semibold">
                              {
                                t.tournamentDetail.playoffsBracket
                                  .qualifiedTitle
                              }
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                              {playoffGroups.map((group) => (
                                <div
                                  key={group.name}
                                  className="rounded-lg border border-white/10 bg-white/5 p-4"
                                >
                                  <h4 className="text-foreground mb-3 text-base font-semibold">
                                    {group.name}
                                  </h4>
                                  <ul className="space-y-2">
                                    {(
                                      group.displayPlayers ?? group.players
                                    ).map((player) => {
                                      const badgeClass =
                                        player.points >= 6
                                          ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
                                          : player.points >= 3
                                            ? "bg-amber-500/20 text-amber-200 border-amber-400/40"
                                            : "bg-slate-500/20 text-slate-200 border-slate-400/40";

                                      return (
                                        <li
                                          key={`${group.name}-${player.player}`}
                                          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                                        >
                                          <span className="text-foreground text-sm font-semibold">
                                            {player.player}
                                          </span>
                                          <span
                                            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass}`}
                                          >
                                            {player.points} pkt
                                          </span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
