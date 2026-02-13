'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Sidebar from '../../../../components/sidebar'
import Footer from '../../../../components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { tournaments, type TournamentMatch } from '../../../../data/tournaments'
import { useLocale } from '../../../../i18n/use-locale'
import { getTranslations } from '../../../../i18n/translations'

type BracketMatchProps = {
  label: string
  home: string
  away: string
  homeSeed?: number
  awaySeed?: number
  size?: 'compact' | 'normal'
  score?: string
}

const BracketMatch = ({
  label,
  home,
  away,
  homeSeed,
  awaySeed,
  size = 'normal',
  score,
}: BracketMatchProps) => {
  const isCompact = size === 'compact'
  const wrapperClass = isCompact ? 'p-2 text-[10.5px]' : 'p-2 text-[11px]'
  const rowClass = isCompact ? 'px-2 py-0.5 text-[10.5px]' : 'px-2 py-1 text-[11px]'
  const labelClass = isCompact ? 'mb-1 text-[9.5px]' : 'mb-1 text-[10px]'
  const placeholderRegex = /^(Winner|Loser|Zwycięzca|Przegrany)\b|^TBD$/i
  const scoreRegex = /(\d+)\s*:\s*(\d+)/
  const homeIsPlaceholder = placeholderRegex.test(home)
  const awayIsPlaceholder = placeholderRegex.test(away)
  const parsedScore = score ? scoreRegex.exec(score) : null
  const homeScore = parsedScore ? Number(parsedScore[1]) : null
  const awayScore = parsedScore ? Number(parsedScore[2]) : null
  const hasScore = homeScore !== null && awayScore !== null
  const homeIsWinner = hasScore && homeScore > awayScore
  const awayIsWinner = hasScore && awayScore > homeScore

  return (
    <div className={`rounded-md border border-white/10 bg-white/5 ${wrapperClass}`}>
      <p className={`${labelClass} font-semibold uppercase tracking-wide text-foreground/60`}>{label}</p>
      <div className="space-y-1">
        <div className={`flex items-center justify-between gap-2 rounded border border-white/10 bg-[#140b24] ${rowClass}`}>
        <span
          className={`flex w-full min-w-0 items-center ${
            homeIsPlaceholder
              ? 'text-[#7aa7ff]'
              : homeIsWinner
                ? 'text-emerald-400 font-semibold'
                : hasScore
                  ? 'text-rose-400 font-semibold'
                  : 'text-[#8b5cf6] font-semibold'
          }`}
        >
          {homeSeed ? (
            <span className="mr-2 rounded-full border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] text-foreground/70">
              {homeSeed}
            </span>
          ) : null}
          <span className="min-w-0 flex-1 truncate">{home}</span>
          {hasScore ? (
            <span className="ml-auto w-6 pr-1 text-right text-foreground/70 tabular-nums">
              {homeScore}
            </span>
          ) : null}
        </span>
        </div>
        <div className={`flex items-center justify-between gap-2 rounded border border-white/10 bg-[#140b24] ${rowClass}`}>
        <span
          className={`flex w-full min-w-0 items-center ${
            awayIsPlaceholder
              ? 'text-[#7aa7ff]'
              : awayIsWinner
                ? 'text-emerald-400 font-semibold'
                : hasScore
                  ? 'text-rose-400 font-semibold'
                  : 'text-[#8b5cf6] font-semibold'
          }`}
        >
          {awaySeed ? (
            <span className="mr-2 rounded-full border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] text-foreground/70">
              {awaySeed}
            </span>
          ) : null}
          <span className="min-w-0 flex-1 truncate">{away}</span>
          {hasScore ? (
            <span className="ml-auto w-6 pr-1 text-right text-foreground/70 tabular-nums">
              {awayScore}
            </span>
          ) : null}
        </span>
        </div>
      </div>
    </div>
  )
}

type BracketColumnProps = {
  title: string
  children: ReactNode
  align?: 'center' | 'start'
  status?: 'current' | 'upcoming'
}

const BracketColumn = ({ title, children, align = 'center', status }: BracketColumnProps) => {
  const titleClass = status === 'current'
    ? 'text-emerald-300'
    : status === 'upcoming'
      ? 'text-[#a83acd]'
      : 'text-foreground/60'

  return (
    <div className="relative flex h-full flex-col">
      <p className={`text-[10px] font-semibold uppercase tracking-wide ${titleClass}`}>{title}</p>
    <div className={`mt-2 flex flex-1 flex-col ${align === 'start' ? 'justify-start' : 'justify-center'} space-y-3`}>
      {children}
    </div>
  </div>
  )
}

export default function TournamentDetailPage() {
  const [activeNav, setActiveNav] = useState('tournaments')
  const [activeTab, setActiveTab] = useState<'info' | 'players' | 'groups' | 'playoffs'>('info')
  const params = useParams()
  const locale = useLocale()
  const t = getTranslations(locale)

  const tournamentId = useMemo(() => {
    const raw = params?.id
    const value = Array.isArray(raw) ? raw[0] : raw
    const parsed = value ? Number.parseInt(value, 10) : Number.NaN
    return Number.isNaN(parsed) ? null : parsed
  }, [params])

  const tournament = tournaments.find((item) => item.id === tournamentId)
  const showPlayoffs = tournament?.id !== 2

  useEffect(() => {
    if (!showPlayoffs && activeTab === 'playoffs') {
      setActiveTab('info')
    }
  }, [activeTab, showPlayoffs])
  const playoffGroups = useMemo(() => {
    if (!tournament) {
      return []
    }

    return tournament.groups
      .map((group) => {
        const playedPlayers = new Set<string>()
        group.matches.played.forEach((match) => {
          playedPlayers.add(match.home)
          playedPlayers.add(match.away)
        })

        const players = group.standings
          .filter((row) => playedPlayers.has(row.player))
          .map((row) => ({
            player: row.player,
            points: row.points,
          }))

        return {
          name: group.name,
          players,
        }
      })
      .filter((group) => group.players.length > 0)
  }, [tournament])

  const qualifiedPlayers = useMemo(() => (
    playoffGroups.flatMap((group) =>
      group.players.map((player) => ({
        player: player.player,
        points: player.points,
        group: group.name,
      })),
    )
  ), [playoffGroups])

  const playoffResults = useMemo(() => tournament?.playoffs?.winnersRound1 ?? [], [tournament])
  const playoffQuarterfinalResults = useMemo(
    () => tournament?.playoffs?.winnersQuarterfinals ?? [],
    [tournament],
  )
  const playoffLosersRound1Results = useMemo(
    () => tournament?.playoffs?.losersRound1 ?? [],
    [tournament],
  )
  const matchKey = (home: string, away: string) => [home, away].sort().join('|')
  const parseScore = (score?: string) => {
    if (!score) {
      return null
    }
    const scoreRegex = /(\d+)\s*:\s*(\d+)/
    const result = scoreRegex.exec(score)
    if (!result) {
      return null
    }
    return {
      home: Number(result[1]),
      away: Number(result[2]),
    }
  }
  const buildResultsMap = (results: TournamentMatch[]) => {
    const resultsByPair = new Map<string, TournamentMatch>()
    results.forEach((result) => {
      if (result.score) {
        resultsByPair.set(matchKey(result.home, result.away), result)
      }
    })
    return resultsByPair
  }
  const resolveScoreFromMap = (
    resultsByPair: Map<string, TournamentMatch>,
    home: string,
    away: string,
  ) => {
    const storedResult = resultsByPair.get(matchKey(home, away))
    if (!storedResult?.score) {
      return undefined
    }
    if (storedResult.home === home && storedResult.away === away) {
      return storedResult.score
    }
    if (storedResult.home === away && storedResult.away === home) {
      const parsed = parseScore(storedResult.score)
      return parsed ? `${parsed.away}:${parsed.home}` : storedResult.score
    }
    return storedResult.score
  }

  const winnersRound1 = useMemo(() => {
    if (qualifiedPlayers.length === 0) {
      return []
    }

    type SeedPlayer = {
      player: string
      points: number
      group?: string
    }

    const orderedEntries: SeedPlayer[] = [...qualifiedPlayers]
    const seen = new Set<string>()
    const uniqueEntries = orderedEntries.filter((entry) => {
      if (seen.has(entry.player)) {
        return false
      }
      seen.add(entry.player)
      return true
    })

    const withPoints = uniqueEntries.filter((entry) => entry.points > 0)
    const withoutPoints = uniqueEntries.filter((entry) => entry.points <= 0)

    const matches: Array<{ home: SeedPlayer | null; away: SeedPlayer | null }> = []
    const pullFrom = (list: SeedPlayer[], predicate?: (entry: SeedPlayer) => boolean) => {
      if (list.length === 0) {
        return null
      }
      if (!predicate) {
        return list.shift() ?? null
      }
      const index = list.findIndex(predicate)
      if (index === -1) {
        return null
      }
      return list.splice(index, 1)[0] ?? null
    }

    while (matches.length < 8 && (withPoints.length > 0 || withoutPoints.length > 0)) {
      const home = pullFrom(withPoints) ?? pullFrom(withoutPoints)
      const homeGroup = home?.group
      const homeHasPoints = (home?.points ?? 0) > 0

      let away: SeedPlayer | null = null
      if (homeHasPoints) {
        away = pullFrom(withoutPoints, (entry) => entry.group !== homeGroup)
          ?? pullFrom(withPoints, (entry) => entry.group !== homeGroup)
          ?? pullFrom(withoutPoints)
          ?? pullFrom(withPoints)
      } else {
        away = pullFrom(withPoints, (entry) => entry.group !== homeGroup)
          ?? pullFrom(withoutPoints, (entry) => entry.group !== homeGroup)
          ?? pullFrom(withPoints)
          ?? pullFrom(withoutPoints)
      }

      matches.push({ home: home ?? null, away })
    }

    while (matches.length < 8) {
      const home = pullFrom(withPoints) ?? pullFrom(withoutPoints)
      const away = pullFrom(withPoints) ?? pullFrom(withoutPoints)
      matches.push({ home, away })
    }

    const resultsByPair = buildResultsMap(playoffResults)

    return matches.map((match, index) => {
      const home = match.home?.player ?? t.tournamentDetail.playoffsBracket.placeholderTbd
      const away = match.away?.player ?? t.tournamentDetail.playoffsBracket.placeholderTbd
      const score = resolveScoreFromMap(resultsByPair, home, away)

      return {
        id: `W${index + 1}`,
        homeSeed: index * 2 + 1,
        awaySeed: index * 2 + 2,
        home,
        away,
        score,
      }
    })
  }, [qualifiedPlayers, t, playoffResults])

  const playoffOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const loserById = new Map<string, string>()

    winnersRound1.forEach((match) => {
      if (!match.score) {
        return
      }
      const parsed = parseScore(match.score)
      if (!parsed || parsed.home === parsed.away) {
        return
      }
      const winner = parsed.home > parsed.away ? match.home : match.away
      const loser = parsed.home > parsed.away ? match.away : match.home
      winnerById.set(match.id, winner)
      loserById.set(match.id, loser)
    })

    return {
      winnerById,
      loserById,
    }
  }, [winnersRound1])

  const resolveWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnersWPrefix
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `W${suffix}`
    return playoffOutcomes.winnerById.get(id) ?? label
  }

  const resolveLoserLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.loserWPrefix
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `W${suffix}`
    return playoffOutcomes.loserById.get(id) ?? label
  }

  const quarterfinalResultsByPair = useMemo(
    () => buildResultsMap(playoffQuarterfinalResults),
    [playoffQuarterfinalResults],
  )

  const losersRound1ResultsByPair = useMemo(
    () => buildResultsMap(playoffLosersRound1Results),
    [playoffLosersRound1Results],
  )

  const wq1Home = resolveWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWPrefix}1`)
  const wq1Away = resolveWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWPrefix}2`)
  const wq2Home = resolveWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWPrefix}3`)
  const wq2Away = resolveWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWPrefix}4`)
  const wq3Home = resolveWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWPrefix}5`)
  const wq3Away = resolveWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWPrefix}6`)
  const wq4Home = resolveWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWPrefix}7`)
  const wq4Away = resolveWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWPrefix}8`)

  const wqOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const loserById = new Map<string, string>()
    const matches = [
      { id: 'WQ1', home: wq1Home, away: wq1Away },
      { id: 'WQ2', home: wq2Home, away: wq2Away },
      { id: 'WQ3', home: wq3Home, away: wq3Away },
      { id: 'WQ4', home: wq4Home, away: wq4Away },
    ]

    matches.forEach((match) => {
      const score = resolveScoreFromMap(quarterfinalResultsByPair, match.home, match.away)
      const parsed = parseScore(score)
      if (!parsed || parsed.home === parsed.away) {
        return
      }
      const winner = parsed.home > parsed.away ? match.home : match.away
      const loser = parsed.home > parsed.away ? match.away : match.home
      winnerById.set(match.id, winner)
      loserById.set(match.id, loser)
    })

    return {
      winnerById,
      loserById,
    }
  }, [quarterfinalResultsByPair, wq1Away, wq1Home, wq2Away, wq2Home, wq3Away, wq3Home, wq4Away, wq4Home])

  const resolveWQWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnersWQPrefix
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `WQ${suffix}`
    return wqOutcomes.winnerById.get(id) ?? label
  }

  const resolveWQLoserLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.loserWQPrefix
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `WQ${suffix}`
    return wqOutcomes.loserById.get(id) ?? label
  }

  const l1Home = resolveLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWPrefix}1`)
  const l1Away = resolveLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWPrefix}2`)
  const l2Home = resolveLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWPrefix}3`)
  const l2Away = resolveLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWPrefix}4`)
  const l3Home = resolveLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWPrefix}5`)
  const l3Away = resolveLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWPrefix}6`)
  const l4Home = resolveLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWPrefix}7`)
  const l4Away = resolveLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWPrefix}8`)

  const losersRound1Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const matches = [
      { id: 'L1', home: l1Home, away: l1Away },
      { id: 'L2', home: l2Home, away: l2Away },
      { id: 'L3', home: l3Home, away: l3Away },
      { id: 'L4', home: l4Home, away: l4Away },
    ]

    matches.forEach((match) => {
      const score = resolveScoreFromMap(losersRound1ResultsByPair, match.home, match.away)
      const parsed = parseScore(score)
      if (!parsed || parsed.home === parsed.away) {
        return
      }
      const winner = parsed.home > parsed.away ? match.home : match.away
      winnerById.set(match.id, winner)
    })

    return { winnerById }
  }, [l1Away, l1Home, l2Away, l2Home, l3Away, l3Home, l4Away, l4Home, losersRound1ResultsByPair])

  const resolveLosersRound1WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `L${suffix}`
    return losersRound1Outcomes.winnerById.get(id) ?? label
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex-1 flex flex-col">
        <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-r from-[#2815d3] to-[#a83acd]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {tournament ? tournament.title : t.tournamentDetail.titleFallback}
            </h1>
            <p className="text-lg text-white/90">
              {t.tournamentDetail.subtitle}
            </p>
          </div>
        </section>

        <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] flex-1">
          <div className="max-w-6xl mx-auto w-full">
            {!tournament ? (
              <div className="bg-[#1a0f2e] border border-[#2815d3]/40 rounded-lg p-8 text-center text-foreground/70">
                {t.tournamentDetail.notFound}
              </div>
            ) : (
              <div className="w-full">
                <Link
                  href={`/${locale}/tournaments`}
                  className="inline-flex items-center text-sm text-white/80 underline underline-offset-4 cursor-pointer mb-4"
                >
                  {t.tournamentDetail.back}
                </Link>
                <Card className="bg-[#1a0f2e] border-[#2815d3]/40 w-full">
                  <CardHeader className="space-y-6">
                    <CardTitle className="text-2xl bg-gradient-to-r from-[#a83acd] to-[#2815d3] bg-clip-text text-transparent">
                      {tournament.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('info')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                          activeTab === 'info'
                            ? 'bg-[#a83acd] text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {t.tournamentDetail.tabs.info}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('players')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                          activeTab === 'players'
                            ? 'bg-[#a83acd] text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {t.tournamentDetail.tabs.players}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('groups')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                          activeTab === 'groups'
                            ? 'bg-[#a83acd] text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {t.tournamentDetail.tabs.groups}
                      </button>
                      {showPlayoffs ? (
                        <button
                          type="button"
                          onClick={() => setActiveTab('playoffs')}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                            activeTab === 'playoffs'
                              ? 'bg-[#a83acd] text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {t.tournamentDetail.tabs.playoffs}
                        </button>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeTab === 'info' ? (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3">
                            {t.tournamentDetail.info.title}
                          </h3>
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <p className="text-sm text-foreground/60 mb-1">{t.tournamentDetail.labels.registration}</p>
                              <p className="text-foreground font-semibold">
                                {locale === 'en'
                                  ? (tournament.registrationLabelEn ?? tournament.registrationLabel ?? tournament.registrationDate)
                                  : (tournament.registrationLabel ?? tournament.registrationDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground/60 mb-1">{t.tournamentDetail.labels.start}</p>
                              <p className="font-semibold text-[#a83acd]">
                                {tournament.startDate}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground/60 mb-1">{t.tournamentDetail.labels.status}</p>
                              <p className="font-semibold text-foreground">
                                {(locale === 'en' ? tournament.statusLabelEn : tournament.statusLabel) ??
                                  (tournament.isOngoing
                                    ? t.tournamentDetail.statusOngoing
                                    : t.tournamentDetail.statusOpen)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground/60 mb-1">{t.tournamentDetail.labels.info}</p>
                              <p className="text-foreground/80">
                                {t.tournamentDetail.infoHintPrefix}{' '}
                                <a
                                  href="https://discord.gg/tuPwbXBDad"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-foreground/80 underline underline-offset-4 hover:text-[#a83acd] transition-colors"
                                >
                                  {t.tournamentDetail.infoHintLink}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="bg-[#140b24] border border-[#2815d3]/40 rounded-lg p-5 shadow-[0_0_30px_rgba(168,58,205,0.15)]">
                            <h4 className="text-base font-semibold mb-3 bg-gradient-to-r from-[#a83acd] to-[#2815d3] bg-clip-text text-transparent">
                              {t.tournamentDetail.info.registration.title}
                            </h4>
                            <ul className="space-y-2 text-foreground/80 text-sm">
                              {t.tournamentDetail.info.registration.bullets.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-[#140b24] border border-[#2815d3]/40 rounded-lg p-5 shadow-[0_0_30px_rgba(40,21,211,0.15)]">
                            <h4 className="text-base font-semibold mb-3 bg-gradient-to-r from-[#a83acd] to-[#2815d3] bg-clip-text text-transparent">
                              {t.tournamentDetail.info.qualifiers.title}
                            </h4>
                            <ul className="space-y-2 text-foreground/80 text-sm">
                              {t.tournamentDetail.info.qualifiers.bullets.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-[#140b24] border border-[#2815d3]/40 rounded-lg p-5 shadow-[0_0_30px_rgba(168,58,205,0.12)]">
                            <h4 className="text-base font-semibold mb-3 bg-gradient-to-r from-[#a83acd] to-[#2815d3] bg-clip-text text-transparent">
                              {t.tournamentDetail.info.announcements.title}
                            </h4>
                            <ul className="space-y-2 text-foreground/80 text-sm">
                              {t.tournamentDetail.info.announcements.bullets.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          {showPlayoffs ? (
                            <div className="bg-[#140b24] border border-[#2815d3]/40 rounded-lg p-5 shadow-[0_0_30px_rgba(40,21,211,0.12)]">
                              <h4 className="text-base font-semibold mb-3 bg-gradient-to-r from-[#a83acd] to-[#2815d3] bg-clip-text text-transparent">
                                {t.tournamentDetail.info.playoffs.title}
                              </h4>
                              <ul className="space-y-2 text-foreground/80 text-sm">
                                {t.tournamentDetail.info.playoffs.bullets.map((item) => (
                                  <li key={item}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {activeTab === 'players' ? (
                      tournament.players.length > 0 ? (
                        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {tournament.players.map((player) => (
                            <li
                              key={player}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground"
                            >
                              {player}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-foreground/80">
                          {t.tournamentDetail.playersEmpty}
                        </div>
                      )
                    ) : null}

                    {activeTab === 'groups' ? (
                      tournament.groups.length > 0 ? (
                        <div className="space-y-6">
                          <div className="rounded-lg border border-[#a83acd]/50 bg-gradient-to-r from-[#2815d3]/30 to-[#a83acd]/20 p-4 text-sm text-white shadow-[0_0_30px_rgba(168,58,205,0.25)]">
                            {t.tournamentDetail.groups.noticeLines.map((line) => (
                              <p key={line} className="font-semibold">
                                {line}
                              </p>
                            ))}
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                          {tournament.groups.map((group) => (
                            <div
                              key={group.name}
                              className="rounded-lg border border-white/10 bg-white/5 p-4"
                            >
                              <h3 className="mb-3 text-base font-semibold text-foreground">
                                {group.name}
                              </h3>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="mb-2 text-sm font-semibold text-foreground/90">
                                    {t.tournamentDetail.groups.standingsTitle}
                                  </h4>
                                  <div className="max-w-full overflow-x-auto rounded-lg border border-white/10">
                                    <table className="w-full table-fixed text-sm text-foreground/90">
                                      <thead className="bg-white/5 text-foreground/70">
                                        <tr>
                                          <th className="px-3 py-2 text-left font-semibold">
                                            {t.tournamentDetail.groups.standingsColumns.player}
                                          </th>
                                          <th className="px-3 py-2 text-center font-semibold">
                                            {t.tournamentDetail.groups.standingsColumns.win}
                                          </th>
                                          <th className="px-3 py-2 text-center font-semibold">
                                            {t.tournamentDetail.groups.standingsColumns.loss}
                                          </th>
                                          <th className="px-3 py-2 text-center font-semibold">
                                            {t.tournamentDetail.groups.standingsColumns.points}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {group.standings.map((row, index) => (
                                          <tr
                                            key={`${group.name}-${row.player}`}
                                            className={`border-t border-white/10 ${
                                              index === 0
                                                ? 'bg-emerald-500/15'
                                                : index === 1
                                                  ? 'bg-amber-500/15'
                                                  : ''
                                            }`}
                                          >
                                            <td className="px-3 py-2 text-left truncate" title={row.player}>
                                              {row.player}
                                            </td>
                                            <td className="px-3 py-2 text-center">{row.win}</td>
                                            <td className="px-3 py-2 text-center">{row.loss}</td>
                                            <td className="px-3 py-2 text-center font-semibold text-[#a83acd]">
                                              {row.points}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="mb-2 text-sm font-semibold text-sky-300">
                                    {t.tournamentDetail.groups.matchesScheduledTitle}
                                  </h4>
                                  {group.matches.scheduled.length === 0 ? (
                                    <p className="text-sm text-foreground/70">
                                      {t.tournamentDetail.groups.matchesEmpty}
                                    </p>
                                  ) : (
                                    <ul className="space-y-1 text-sm text-foreground/90">
                                      {group.matches.scheduled.map((match) => (
                                        <li key={`${group.name}-${match.home}-${match.away}`}>
                                          {match.home} vs {match.away}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>

                                <div>
                                  <h4 className="mb-2 text-sm font-semibold text-fuchsia-300">
                                    {t.tournamentDetail.groups.matchesPlayedTitle}
                                  </h4>
                                  {group.matches.played.length === 0 ? (
                                    <p className="text-sm text-foreground/70">
                                      {t.tournamentDetail.groups.matchesPlayedEmpty}
                                    </p>
                                  ) : (
                                    <ul className="space-y-1 text-sm text-foreground/90">
                                      {group.matches.played.map((match) => {
                                        const scoreText = match.score ?? ''
                                        const mainMatch = /^\s*(\d+)\s*:\s*(\d+)/.exec(scoreText)
                                        const homeScore = mainMatch ? Number.parseInt(mainMatch[1] ?? '', 10) : Number.NaN
                                        const awayScore = mainMatch ? Number.parseInt(mainMatch[2] ?? '', 10) : Number.NaN
                                        const tiebreakMatch = /\((\d+)\s*:\s*(\d+)\)/.exec(scoreText)
                                        const homeTiebreak = tiebreakMatch ? Number.parseInt(tiebreakMatch[1] ?? '', 10) : Number.NaN
                                        const awayTiebreak = tiebreakMatch ? Number.parseInt(tiebreakMatch[2] ?? '', 10) : Number.NaN
                                        const hasScore = Number.isFinite(homeScore) && Number.isFinite(awayScore)
                                        const hasTiebreak = Number.isFinite(homeTiebreak) && Number.isFinite(awayTiebreak)
                                        const isMainDraw = hasScore && homeScore === awayScore
                                        const useTiebreak = isMainDraw && hasTiebreak
                                        const homeResultScore = useTiebreak ? homeTiebreak : homeScore
                                        const awayResultScore = useTiebreak ? awayTiebreak : awayScore
                                        const homeClass = hasScore
                                          ? homeResultScore > awayResultScore
                                            ? 'text-emerald-400'
                                            : homeResultScore < awayResultScore
                                              ? 'text-rose-400'
                                              : 'text-amber-300'
                                          : 'text-foreground'
                                        const awayClass = hasScore
                                          ? awayResultScore > homeResultScore
                                            ? 'text-emerald-400'
                                            : awayResultScore < homeResultScore
                                              ? 'text-rose-400'
                                              : 'text-amber-300'
                                          : 'text-foreground'

                                        return (
                                          <li key={`${group.name}-played-${match.home}-${match.away}`}>
                                            <span className={homeClass}>{match.home}</span> vs{' '}
                                            <span className={awayClass}>{match.away}</span>
                                            {match.score ? (
                                              <span className="text-foreground/60">{` (${match.score})`}</span>
                                            ) : null}
                                          </li>
                                        )
                                      })}
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
                          {t.tournamentDetail.groupsEmpty}
                        </div>
                      )
                    ) : null}

                    {showPlayoffs && activeTab === 'playoffs' ? (
                      <div className="space-y-8">
                        <div className="rounded-lg border border-[#a83acd]/50 bg-gradient-to-r from-[#2815d3]/30 to-[#a83acd]/20 p-4 text-sm text-white shadow-[0_0_30px_rgba(168,58,205,0.25)]">
                          <p className="font-semibold">
                            {t.tournamentDetail.playoffsBracket.introTitle}
                          </p>
                          <p className="text-white/80">
                            {t.tournamentDetail.playoffsBracket.introSubtitle}
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-foreground/90">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/60">
                            {t.tournamentDetail.playoffsBracket.deadlinesTitle}
                          </p>
                          <ul className="space-y-1 text-sm">
                            {t.tournamentDetail.playoffsBracket.deadlinesLines.map((line) => (
                              <li key={line}>• {line}</li>
                            ))}
                          </ul>
                        </div>

                        {qualifiedPlayers.length >= 16 ? (
                          <>
                            <div className="space-y-4">
                              <h3 className="text-base font-semibold text-foreground">
                                {t.tournamentDetail.playoffsBracket.grandFinalTitle}
                              </h3>
                              <div className="overflow-x-auto">
                                <div className="min-w-0 sm:min-w-[200px] flex justify-center">
                                  <div className="w-full max-w-[220px]">
                                    <BracketColumn
                                      title={t.tournamentDetail.playoffsBracket.finalColumn}
                                      align="start"
                                      status="upcoming"
                                    >
                                      <BracketMatch
                                        label={t.tournamentDetail.playoffsBracket.gfLabel}
                                        home={t.tournamentDetail.playoffsBracket.winnerWF}
                                        away={t.tournamentDetail.playoffsBracket.winnerLF}
                                        size="compact"
                                      />
                                    </BracketColumn>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-base font-semibold text-foreground">
                                {t.tournamentDetail.playoffsBracket.winnersTitle}
                              </h3>
                              <div className="overflow-x-auto">
                                <div className="min-w-0 sm:min-w-[940px] grid grid-cols-1 sm:grid-cols-4 gap-4">
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.roundOf16}>
                                    {winnersRound1.map((match) => (
                                      <BracketMatch
                                        key={match.id}
                                        label={match.id}
                                        home={match.home}
                                        away={match.away}
                                        homeSeed={match.homeSeed}
                                        awaySeed={match.awaySeed}
                                        score={match.score}
                                      />
                                    ))}
                                  </BracketColumn>
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.quarterfinals} status="current">
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}1`}
                                      home={wq1Home}
                                      away={wq1Away}
                                      score={resolveScoreFromMap(quarterfinalResultsByPair, wq1Home, wq1Away)}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}2`}
                                      home={wq2Home}
                                      away={wq2Away}
                                      score={resolveScoreFromMap(quarterfinalResultsByPair, wq2Home, wq2Away)}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}3`}
                                      home={wq3Home}
                                      away={wq3Away}
                                      score={resolveScoreFromMap(quarterfinalResultsByPair, wq3Home, wq3Away)}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.wqLabelPrefix}4`}
                                      home={wq4Home}
                                      away={wq4Away}
                                      score={resolveScoreFromMap(quarterfinalResultsByPair, wq4Home, wq4Away)}
                                    />
                                  </BracketColumn>
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.semifinals} status="current">
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.wsLabelPrefix}1`}
                                      home={resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}1`)}
                                      away={resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}2`)}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.wsLabelPrefix}2`}
                                      home={resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}3`)}
                                      away={resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}4`)}
                                    />
                                  </BracketColumn>
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.winnersFinal} status="upcoming">
                                    <BracketMatch
                                      label={t.tournamentDetail.playoffsBracket.wfLabel}
                                      home={`${t.tournamentDetail.playoffsBracket.winnersWSPrefix}1`}
                                      away={`${t.tournamentDetail.playoffsBracket.winnersWSPrefix}2`}
                                    />
                                  </BracketColumn>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-base font-semibold text-foreground">
                                {t.tournamentDetail.playoffsBracket.losersTitle}
                              </h3>
                              <div className="overflow-x-auto">
                                <div className="min-w-0 sm:min-w-[1020px] grid grid-cols-1 sm:grid-cols-6 gap-4">
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.losersRound1}>
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}1`}
                                      home={l1Home}
                                      away={l1Away}
                                      score={resolveScoreFromMap(losersRound1ResultsByPair, l1Home, l1Away)}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}2`}
                                      home={l2Home}
                                      away={l2Away}
                                      score={resolveScoreFromMap(losersRound1ResultsByPair, l2Home, l2Away)}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}3`}
                                      home={l3Home}
                                      away={l3Away}
                                      score={resolveScoreFromMap(losersRound1ResultsByPair, l3Home, l3Away)}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}4`}
                                      home={l4Home}
                                      away={l4Away}
                                      score={resolveScoreFromMap(losersRound1ResultsByPair, l4Home, l4Away)}
                                    />
                                  </BracketColumn>
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.losersRound2} status="current">
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}5`}
                                      home="Tommy__Rev"
                                      away="Kwaslun"
                                      score="3:2"
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}6`}
                                      home={resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`)}
                                      away={resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`)}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}7`}
                                      home={resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`)}
                                      away={resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}3`)}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}8`}
                                      home={resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`)}
                                      away={resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}4`)}
                                    />
                                  </BracketColumn>
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.losersRound3} status="current">
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}9`}
                                      home="Tommy__Rev"
                                      away={`${t.tournamentDetail.playoffsBracket.winnerPrefix} L6`}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}10`}
                                      home={`${t.tournamentDetail.playoffsBracket.winnerPrefix} L7`}
                                      away={`${t.tournamentDetail.playoffsBracket.winnerPrefix} L8`}
                                    />
                                  </BracketColumn>
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.losersRound4} status="current">
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}11`}
                                      home={`${t.tournamentDetail.playoffsBracket.winnerPrefix} L9`}
                                      away={`${t.tournamentDetail.playoffsBracket.loserWSPrefix}1`}
                                    />
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}12`}
                                      home={`${t.tournamentDetail.playoffsBracket.winnerPrefix} L10`}
                                      away={`${t.tournamentDetail.playoffsBracket.loserWSPrefix}2`}
                                    />
                                  </BracketColumn>
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.losersRound5} status="upcoming">
                                    <BracketMatch
                                      label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}13`}
                                      home={`${t.tournamentDetail.playoffsBracket.winnerPrefix} L11`}
                                      away={`${t.tournamentDetail.playoffsBracket.winnerPrefix} L12`}
                                    />
                                  </BracketColumn>
                                  <BracketColumn title={t.tournamentDetail.playoffsBracket.losersFinal} status="upcoming">
                                    <BracketMatch
                                      label={t.tournamentDetail.playoffsBracket.lfLabel}
                                      home={`${t.tournamentDetail.playoffsBracket.winnerPrefix} L13`}
                                      away={t.tournamentDetail.playoffsBracket.loserWF}
                                    />
                                  </BracketColumn>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-foreground/80">
                            {t.tournamentDetail.playoffsBracket.addPlayersHint}
                          </div>
                        )}

                        {playoffGroups.length > 0 ? (
                          <div className="space-y-4">
                            <h3 className="text-base font-semibold text-foreground">
                              {t.tournamentDetail.playoffsBracket.qualifiedTitle}
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                              {playoffGroups.map((group) => (
                                <div
                                  key={group.name}
                                  className="rounded-lg border border-white/10 bg-white/5 p-4"
                                >
                                  <h4 className="mb-3 text-base font-semibold text-foreground">
                                    {group.name}
                                  </h4>
                                  <ul className="space-y-2">
                                    {group.players.map((player) => {
                                      const badgeClass = player.points >= 6
                                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                                        : player.points >= 3
                                          ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                                          : 'bg-slate-500/20 text-slate-200 border-slate-400/40'

                                      return (
                                        <li
                                          key={`${group.name}-${player.player}`}
                                          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                                        >
                                          <span className="text-sm font-semibold text-foreground">
                                            {player.player}
                                          </span>
                                          <span
                                            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass}`}
                                          >
                                            {player.points} pkt
                                          </span>
                                        </li>
                                      )
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
  )
}
