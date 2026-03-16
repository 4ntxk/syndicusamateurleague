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
  const homeIsGolden = home === 'wariatbyyyszcz'
  const awayIsGolden = away === 'wariatbyyyszcz'
  const parsedScore = score ? scoreRegex.exec(score) : null
  const homeScore = parsedScore ? Number(parsedScore[1]) : null
  const awayScore = parsedScore ? Number(parsedScore[2]) : null
    const hasScore = homeScore !== null && awayScore !== null
    const isTie = hasScore && homeScore === awayScore
    const homeIsWinner = hasScore && !isTie && homeScore > awayScore
    const awayIsWinner = hasScore && !isTie && awayScore > homeScore

  return (
    <div className={`rounded-md border border-white/10 bg-white/5 ${wrapperClass}`}>
      <p className={`${labelClass} font-semibold uppercase tracking-wide text-foreground/60`}>{label}</p>
      <div className="space-y-1">
        <div className={`flex items-center justify-between gap-2 rounded border border-white/10 bg-[#140b24] ${rowClass}`}>
        <span
          className={`flex w-full min-w-0 items-center ${
            homeIsPlaceholder
              ? 'text-[#7aa7ff]'
              : homeIsGolden
                ? 'text-amber-300 font-semibold'
                : homeIsWinner
                  ? 'text-emerald-400 font-semibold'
                    : hasScore && !isTie
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
              : awayIsGolden
                ? 'text-amber-300 font-semibold'
                : awayIsWinner
                  ? 'text-emerald-400 font-semibold'
                    : hasScore && !isTie
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
  const showPlayoffs = Boolean(tournament?.playoffs)
  const isStyczen1 = tournament?.id === 1
  const showSchedule = tournament?.id === 2
  const showGroupsPlayoffs = true
  const registrationRange = tournament?.registrationDate?.split(' - ') ?? []
  const registrationLine = registrationRange.length === 2
    ? locale === 'en'
      ? `Open from ${registrationRange[0]} to ${registrationRange[1]}`
      : `Otwarta od ${registrationRange[0]} do ${registrationRange[1]}`
    : null

  useEffect(() => {
    if (!showPlayoffs && activeTab === 'playoffs') {
      setActiveTab('info')
    }
    if (!showGroupsPlayoffs && (activeTab === 'groups' || activeTab === 'playoffs')) {
      setActiveTab('info')
    }
  }, [activeTab, showGroupsPlayoffs, showPlayoffs])
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

        const realSlots = group.advanceSlots ?? 2
        const targetSlots = 2
        const realPlayers = group.standings
          .filter((row) => playedPlayers.has(row.player))
          .map((row, index) => ({
            player: row.player,
            points: row.points,
            seed: index + 1,
          }))
          .slice(0, realSlots)

        const players = [...realPlayers]

        while (players.length < targetSlots) {
          players.push({
            player: group.placeholderAdvance ?? t.tournamentDetail.playoffsBracket.placeholderTbd,
            points: 0,
            seed: players.length + 1,
          })
        }

        return {
          name: group.name,
          players,
          displayPlayers: realPlayers,
        }
      })
      .filter((group) => group.players.length > 0)
  }, [tournament])

  const qualifiedPlayers = useMemo(() => (
    playoffGroups.flatMap((group) =>
      group.players.map((player) => ({
        player: player.player,
        points: player.points,
        seed: player.seed,
        group: group.name,
      })),
    )
  ), [playoffGroups])
  const isEightBracket = qualifiedPlayers.length <= 8
  const now = new Date()
  const scheduleRanges = {
    winnersQuarterfinals: [new Date(2026, 2, 1), new Date(2026, 2, 4, 23, 59, 59, 999)],
    winnersSemifinals: [new Date(2026, 2, 4), new Date(2026, 2, 7, 23, 59, 59, 999)],
    winnersFinal: [new Date(2026, 2, 7), new Date(2026, 2, 9, 23, 59, 59, 999)],
    losersRound1: [new Date(2026, 2, 4), new Date(2026, 2, 7, 23, 59, 59, 999)],
    losersRound2: [new Date(2026, 2, 4), new Date(2026, 2, 7, 23, 59, 59, 999)],
    losersRound3: [new Date(2026, 2, 7), new Date(2026, 2, 9, 23, 59, 59, 999)],
    losersFinal: [new Date(2026, 2, 9), new Date(2026, 2, 11, 23, 59, 59, 999)],
    grandFinal: [new Date(2026, 2, 9), new Date(2026, 2, 11, 23, 59, 59, 999)],
  } as const
  const getRoundStatus = (range: readonly [Date, Date]) => {
    if (now < range[0]) {
      return 'upcoming'
    }
    if (now <= range[1]) {
      return 'current'
    }
    return undefined
  }
  const withDeadline = (title: string) => title

  const playoffResults = useMemo(() => tournament?.playoffs?.winnersRound1 ?? [], [tournament])
  const playoffQuarterfinalResults = useMemo(
    () => tournament?.playoffs?.winnersQuarterfinals ?? [],
    [tournament],
  )
  const playoffSemifinalResults = useMemo(
    () => tournament?.playoffs?.winnersSemifinals ?? [],
    [tournament],
  )
  const playoffWinnersFinalResults = useMemo(
    () => tournament?.playoffs?.winnersFinal ?? [],
    [tournament],
  )
  const playoffLosersRound1Results = useMemo(
    () => tournament?.playoffs?.losersRound1 ?? [],
    [tournament],
  )
  const playoffLosersRound2Results = useMemo(
    () => tournament?.playoffs?.losersRound2 ?? [],
    [tournament],
  )
  const playoffLosersRound3Results = useMemo(
    () => tournament?.playoffs?.losersRound3 ?? [],
    [tournament],
  )
  const playoffLosersFinalResults = useMemo(
    () => tournament?.playoffs?.losersFinal ?? [],
    [tournament],
  )
  const playoffGrandFinalResults = useMemo(
    () => tournament?.playoffs?.grandFinal ?? [],
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
  const resolveWinnerFromMap = (
    resultsByPair: Map<string, TournamentMatch>,
    home: string,
    away: string,
  ) => {
    const score = resolveScoreFromMap(resultsByPair, home, away)
    const parsed = parseScore(score)
    if (!parsed || parsed.home === parsed.away) {
      return null
    }
    return parsed.home > parsed.away ? home : away
  }

  const winnersRound1 = useMemo(() => {
    if (qualifiedPlayers.length === 0) {
      return []
    }

    type SeedPlayer = {
      player: string
      points: number
      seed?: number
      seedNumber?: number
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

    const firstSeeds = uniqueEntries.filter((entry) => entry.seed === 1)
    const secondSeeds = uniqueEntries.filter((entry) => entry.seed === 2)
    const desiredMatchCount = isEightBracket ? 4 : 8
    const limitedFirstSeeds = firstSeeds.slice(0, desiredMatchCount)
    const remainingSeconds = [...secondSeeds]
    const seededFirst = limitedFirstSeeds.map((entry, index) => ({
      ...entry,
      seedNumber: index + 1,
    }))
    const seededSecond = remainingSeconds.map((entry, index) => ({
      ...entry,
      seedNumber: seededFirst.length + index + 1,
    }))

    const matches: Array<{ home: SeedPlayer | null; away: SeedPlayer | null }> = []

    seededFirst.forEach((first) => {
      let index = seededSecond.findIndex((entry) => entry.group !== first.group)
      if (index === -1) {
        index = 0
      }
      const second = index >= 0 ? seededSecond.splice(index, 1)[0] ?? null : null
      matches.push({ home: first, away: second })
    })

    while (seededSecond.length > 0 && matches.length < desiredMatchCount) {
      matches.push({ home: null, away: seededSecond.shift() ?? null })
    }

    while (matches.length < desiredMatchCount) {
      matches.push({ home: null, away: null })
    }

    const resultsByPair = buildResultsMap(playoffResults)

    return matches.map((match, index) => {
      const home = match.home?.player ?? t.tournamentDetail.playoffsBracket.placeholderTbd
      const away = match.away?.player ?? t.tournamentDetail.playoffsBracket.placeholderTbd
      const score = resolveScoreFromMap(resultsByPair, home, away)

      return {
        id: `W${index + 1}`,
        homeSeed: index === 0 ? undefined : match.home?.seedNumber,
        awaySeed: match.away?.seedNumber,
        home,
        away,
        score,
      }
    })
  }, [isEightBracket, qualifiedPlayers, t, playoffResults])

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
  const semifinalResultsByPair = useMemo(
    () => buildResultsMap(playoffSemifinalResults),
    [playoffSemifinalResults],
  )
  const winnersFinalResultsByPair = useMemo(
    () => buildResultsMap(playoffWinnersFinalResults),
    [playoffWinnersFinalResults],
  )

  const losersRound1ResultsByPair = useMemo(
    () => buildResultsMap(playoffLosersRound1Results),
    [playoffLosersRound1Results],
  )
  const losersRound2ResultsByPair = useMemo(
    () => buildResultsMap(playoffLosersRound2Results),
    [playoffLosersRound2Results],
  )
  const losersRound3ResultsByPair = useMemo(
    () => buildResultsMap(playoffLosersRound3Results),
    [playoffLosersRound3Results],
  )
  const losersFinalResultsByPair = useMemo(
    () => buildResultsMap(playoffLosersFinalResults),
    [playoffLosersFinalResults],
  )
  const grandFinalResultsByPair = useMemo(
    () => buildResultsMap(playoffGrandFinalResults),
    [playoffGrandFinalResults],
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
    const matches = isEightBracket
      ? [
        { id: 'WQ1', home: wq1Home, away: wq1Away },
        { id: 'WQ2', home: wq2Home, away: wq2Away },
      ]
      : [
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
  }, [isEightBracket, quarterfinalResultsByPair, wq1Away, wq1Home, wq2Away, wq2Home, wq3Away, wq3Home, wq4Away, wq4Home])

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

  const ws1Home = resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}1`)
  const ws1Away = resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}2`)
  const ws2Home = resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}3`)
  const ws2Away = resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}4`)

  const wsOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const loserById = new Map<string, string>()
    const matches = [
      { id: 'WS1', home: ws1Home, away: ws1Away },
      { id: 'WS2', home: ws2Home, away: ws2Away },
    ]

    matches.forEach((match) => {
      const score = resolveScoreFromMap(semifinalResultsByPair, match.home, match.away)
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
  }, [semifinalResultsByPair, ws1Away, ws1Home, ws2Away, ws2Home])

  const resolveWSWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnersWSPrefix
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `WS${suffix}`
    return wsOutcomes.winnerById.get(id) ?? label
  }

  const resolveWSLoserLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.loserWSPrefix
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `WS${suffix}`
    return wsOutcomes.loserById.get(id) ?? label
  }

  const wfHome = isEightBracket
    ? resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}1`)
    : resolveWSWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWSPrefix}1`)
  const wfAway = isEightBracket
    ? resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}2`)
    : resolveWSWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWSPrefix}2`)

  const wfOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const loserById = new Map<string, string>()
    const match = { id: 'WF', home: wfHome, away: wfAway }
    const score = resolveScoreFromMap(
      isEightBracket ? semifinalResultsByPair : winnersFinalResultsByPair,
      match.home,
      match.away,
    )
    const parsed = parseScore(score)
    if (!parsed || parsed.home === parsed.away) {
      return { winnerById, loserById }
    }
    const winner = parsed.home > parsed.away ? match.home : match.away
    const loser = parsed.home > parsed.away ? match.away : match.home
    winnerById.set(match.id, winner)
    loserById.set(match.id, loser)
    return { winnerById, loserById }
  }, [isEightBracket, semifinalResultsByPair, wfAway, wfHome, winnersFinalResultsByPair])

  const resolveWFWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnerWF
    if (!label.startsWith(prefix)) {
      return label
    }
    return wfOutcomes.winnerById.get('WF') ?? label
  }

  const resolveWFLoserLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.loserWF
    if (!label.startsWith(prefix)) {
      return label
    }
    return wfOutcomes.loserById.get('WF') ?? label
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
    const matches = isEightBracket
      ? [
        { id: 'L1', home: l1Home, away: l1Away },
        { id: 'L2', home: l2Home, away: l2Away },
      ]
      : [
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
  }, [isEightBracket, l1Away, l1Home, l2Away, l2Home, l3Away, l3Home, l4Away, l4Home, losersRound1ResultsByPair])

  const resolveLosersRound1WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `L${suffix}`
    return losersRound1Outcomes.winnerById.get(id) ?? label
  }

  const losersRound2Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const matches = isEightBracket
      ? [
        {
          id: 'L3',
          home: resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L1`),
          away: resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}1`),
        },
        {
          id: 'L4',
          home: resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`),
          away: resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`),
        },
      ]
      : [
        {
          id: 'L6',
          home: resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`),
          away: resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`),
        },
        {
          id: 'L7',
          home: resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`),
          away: resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}3`),
        },
        {
          id: 'L8',
          home: isStyczen1
            ? 'I3anani_PL'
            : resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`),
          away: isStyczen1
            ? 'TYMEK2k11'
            : resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}4`),
        },
      ]

    matches.forEach((match) => {
      const score = resolveScoreFromMap(losersRound2ResultsByPair, match.home, match.away)
      const parsed = parseScore(score)
      if (!parsed || parsed.home === parsed.away) {
        return
      }
      const winner = parsed.home > parsed.away ? match.home : match.away
      winnerById.set(match.id, winner)
    })

    return { winnerById }
  }, [isEightBracket, losersRound1Outcomes, losersRound2ResultsByPair, t, wqOutcomes, isStyczen1])

  const resolveLosersRound2WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `L${suffix}`
    return losersRound2Outcomes.winnerById.get(id) ?? label
  }

  const losersRound3Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const matches: Array<{ id: string; home: string; away: string; score?: string }> = isEightBracket
      ? [
        {
          id: 'L5',
          home: resolveLosersRound2WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`),
          away: resolveLosersRound2WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`),
        },
      ]
      : [
        {
          id: 'L9',
          home: 'Tommy__Rev',
          away: isStyczen1 ? 'Rumcajs_PL' : `${t.tournamentDetail.playoffsBracket.winnerPrefix} L6`,
          score: isStyczen1 ? '1:8' : undefined,
        },
        {
          id: 'L10',
          home: 'andriizrv',
          away: resolveLosersRound2WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L8`),
          score: '2:6',
        },
      ]

    matches.forEach((match) => {
      const score = isEightBracket
        ? resolveScoreFromMap(losersRound3ResultsByPair, match.home, match.away)
        : match.score
      if (!score) {
        return
      }
      const parsed = parseScore(score)
      if (!parsed || parsed.home === parsed.away) {
        return
      }
      const winner = parsed.home > parsed.away ? match.home : match.away
      winnerById.set(match.id, winner)
    })

    return { winnerById }
  }, [isEightBracket, isStyczen1, losersRound3ResultsByPair, resolveLosersRound2WinnerLabel, resolveScoreFromMap, t])

  const resolveLosersRound3WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `L${suffix}`
    return losersRound3Outcomes.winnerById.get(id) ?? label
  }

  const losersRound4Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const matches = [
      {
        id: 'L11',
        home: resolveLosersRound3WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L9`),
        away: isStyczen1 ? 'wiksoonszef' : `${t.tournamentDetail.playoffsBracket.winnerPrefix} L9`,
        score: isStyczen1 ? '4:5' : undefined,
      },
      {
        id: 'L12',
        home: resolveLosersRound3WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L10`),
        away: resolveWSLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWSPrefix}2`),
        score: isStyczen1 ? '3:0' : undefined,
      },
    ]

    matches.forEach((match) => {
      if (!match.score) {
        return
      }
      const parsed = parseScore(match.score)
      if (!parsed || parsed.home === parsed.away) {
        return
      }
      const winner = parsed.home > parsed.away ? match.home : match.away
      winnerById.set(match.id, winner)
    })

    return { winnerById }
  }, [isStyczen1, resolveLosersRound3WinnerLabel, resolveWSLoserLabel, t])

  const resolveLosersRound4WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `L${suffix}`
    return losersRound4Outcomes.winnerById.get(id) ?? label
  }

  const losersRound5Outcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const matches = [
      {
        id: 'L13',
        home: resolveLosersRound4WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L11`),
        away: resolveLosersRound4WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L12`),
        score: isStyczen1 ? '5:3' : undefined,
      },
    ]

    matches.forEach((match) => {
      if (!match.score) {
        return
      }
      const parsed = parseScore(match.score)
      if (!parsed || parsed.home === parsed.away) {
        return
      }
      const winner = parsed.home > parsed.away ? match.home : match.away
      winnerById.set(match.id, winner)
    })

    return { winnerById }
  }, [isStyczen1, resolveLosersRound4WinnerLabel, t])

  const resolveLosersRound5WinnerLabel = (label: string) => {
    const prefix = `${t.tournamentDetail.playoffsBracket.winnerPrefix} L`
    if (!label.startsWith(prefix)) {
      return label
    }
    const suffix = label.slice(prefix.length).trim()
    const id = `L${suffix}`
    return losersRound5Outcomes.winnerById.get(id) ?? label
  }

  const losersFinalOutcomes = useMemo(() => {
    const winnerById = new Map<string, string>()
    const matches: Array<{ id: string; home: string; away: string; score?: string }> = isEightBracket
      ? [
        {
          id: 'LF',
          home: resolveLosersRound3WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L5`),
          away: resolveWFLoserLabel(t.tournamentDetail.playoffsBracket.loserWF),
        },
      ]
      : []

    matches.forEach((match) => {
      const score = resolveScoreFromMap(losersFinalResultsByPair, match.home, match.away)
      const parsed = parseScore(score)
      if (!parsed || parsed.home === parsed.away) {
        return
      }
      const winner = parsed.home > parsed.away ? match.home : match.away
      winnerById.set(match.id, winner)
    })

    return { winnerById }
  }, [
    isEightBracket,
    losersFinalResultsByPair,
    resolveLosersRound3WinnerLabel,
    resolveScoreFromMap,
    resolveWFLoserLabel,
    t,
  ])

  const resolveLosersFinalWinnerLabel = (label: string) => {
    const prefix = t.tournamentDetail.playoffsBracket.winnerLF
    if (label !== prefix) {
      return label
    }
    return losersFinalOutcomes.winnerById.get('LF') ?? label
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
                      {showGroupsPlayoffs ? (
                        <>
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
                        </>
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
                                  href="https://discord.gg/zeYCRTEtvR"
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
                              {(tournament?.id === 3 && registrationLine
                                ? [
                                  registrationLine,
                                  ...t.tournamentDetail.info.registration.bullets.filter((item) =>
                                    !/^Otwarta od\b/i.test(item) && !/^Open from\b/i.test(item),
                                  ),
                                ]
                                : t.tournamentDetail.info.registration.bullets
                              ).map((item) => (
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

                    {showGroupsPlayoffs && activeTab === 'groups' ? (
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

                    {showGroupsPlayoffs && showPlayoffs && activeTab === 'playoffs' ? (
                      <div className="space-y-8">
                        {showSchedule ? (
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
                        ) : null}

                        {qualifiedPlayers.length > 0 ? (
                          <>
                            <div className="space-y-4">
                              <h3 className="text-base font-semibold text-foreground">
                                {t.tournamentDetail.playoffsBracket.grandFinalTitle}
                              </h3>
                              <div className="overflow-x-auto">
                                <div className="min-w-0 sm:min-w-[200px] flex justify-center">
                                  <div className="w-full max-w-[220px]">
                                      <BracketColumn
                                        title={withDeadline(
                                          t.tournamentDetail.playoffsBracket.finalColumn,
                                          scheduleRanges.grandFinal,
                                        )}
                                        align="start"
                                        status={getRoundStatus(scheduleRanges.grandFinal)}
                                      >
                                      <BracketMatch
                                        label={t.tournamentDetail.playoffsBracket.gfLabel}
                                        home={resolveWFWinnerLabel(t.tournamentDetail.playoffsBracket.winnerWF)}
                                        away={isStyczen1 ? 'sliwkafc' : resolveLosersFinalWinnerLabel(t.tournamentDetail.playoffsBracket.winnerLF)}
                                        size="compact"
                                        score={
                                          isStyczen1
                                            ? '6:3'
                                            : resolveScoreFromMap(
                                              grandFinalResultsByPair,
                                              resolveWFWinnerLabel(t.tournamentDetail.playoffsBracket.winnerWF),
                                              resolveLosersFinalWinnerLabel(t.tournamentDetail.playoffsBracket.winnerLF),
                                            )
                                        }
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
                                {isEightBracket ? (
                                  <div className="min-w-0 sm:min-w-[700px] grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.quarterfinals,
                                        scheduleRanges.winnersQuarterfinals,
                                      )}
                                      status={getRoundStatus(scheduleRanges.winnersQuarterfinals)}
                                    >
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
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.semifinals,
                                        scheduleRanges.winnersSemifinals,
                                      )}
                                      status={getRoundStatus(scheduleRanges.winnersSemifinals)}
                                    >
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
                                    </BracketColumn>
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.winnersFinal,
                                        scheduleRanges.winnersFinal,
                                      )}
                                      status={getRoundStatus(scheduleRanges.winnersFinal)}
                                    >
                                      <BracketMatch
                                        label={t.tournamentDetail.playoffsBracket.wfLabel}
                                        home={wfHome}
                                        away={wfAway}
                                        score={resolveScoreFromMap(semifinalResultsByPair, wfHome, wfAway)}
                                      />
                                    </BracketColumn>
                                  </div>
                                ) : (
                                  <div className="min-w-0 sm:min-w-[940px] grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.roundOf16,
                                        scheduleRanges.winnersQuarterfinals,
                                      )}
                                      status={getRoundStatus(scheduleRanges.winnersQuarterfinals)}
                                    >
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
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.quarterfinals,
                                        scheduleRanges.winnersQuarterfinals,
                                      )}
                                      status={getRoundStatus(scheduleRanges.winnersQuarterfinals)}
                                    >
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
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.semifinals,
                                        scheduleRanges.winnersSemifinals,
                                      )}
                                      status={getRoundStatus(scheduleRanges.winnersSemifinals)}
                                    >
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.wsLabelPrefix}1`}
                                        home={resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}1`)}
                                        away={resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}2`)}
                                        score={resolveScoreFromMap(
                                          semifinalResultsByPair,
                                          resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}1`),
                                          resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}2`),
                                        )}
                                      />
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.wsLabelPrefix}2`}
                                        home={resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}3`)}
                                        away={resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}4`)}
                                        score={resolveScoreFromMap(
                                          semifinalResultsByPair,
                                          resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}3`),
                                          resolveWQWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWQPrefix}4`),
                                        )}
                                      />
                                    </BracketColumn>
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.winnersFinal,
                                        scheduleRanges.winnersFinal,
                                      )}
                                      status={getRoundStatus(scheduleRanges.winnersFinal)}
                                    >
                                      <BracketMatch
                                        label={t.tournamentDetail.playoffsBracket.wfLabel}
                                        home={resolveWSWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWSPrefix}1`)}
                                        away={resolveWSWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWSPrefix}2`)}
                                        score={resolveScoreFromMap(
                                          winnersFinalResultsByPair,
                                          resolveWSWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWSPrefix}1`),
                                          resolveWSWinnerLabel(`${t.tournamentDetail.playoffsBracket.winnersWSPrefix}2`),
                                        )}
                                      />
                                    </BracketColumn>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-base font-semibold text-foreground">
                                {t.tournamentDetail.playoffsBracket.losersTitle}
                              </h3>
                              <div className="overflow-x-auto">
                                {isEightBracket ? (
                                  <div className="min-w-0 sm:min-w-[760px] grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.losersRound1,
                                        scheduleRanges.losersRound1,
                                      )}
                                      status={getRoundStatus(scheduleRanges.losersRound1)}
                                    >
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
                                    </BracketColumn>
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.losersRound2,
                                        scheduleRanges.losersRound2,
                                      )}
                                      status={getRoundStatus(scheduleRanges.losersRound2)}
                                    >
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}3`}
                                        home={resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L1`)}
                                        away={resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}1`)}
                                        score={resolveScoreFromMap(
                                          losersRound2ResultsByPair,
                                          resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L1`),
                                          resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}1`),
                                        )}
                                      />
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}4`}
                                        home={resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`)}
                                        away={resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`)}
                                        score={resolveScoreFromMap(
                                          losersRound2ResultsByPair,
                                          resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`),
                                          resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`),
                                        )}
                                      />
                                    </BracketColumn>
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.losersRound3,
                                        scheduleRanges.losersRound3,
                                      )}
                                      status={getRoundStatus(scheduleRanges.losersRound3)}
                                    >
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}5`}
                                        home={resolveLosersRound2WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`)}
                                        away={resolveLosersRound2WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`)}
                                        score={resolveScoreFromMap(
                                          losersRound3ResultsByPair,
                                          resolveLosersRound2WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`),
                                          resolveLosersRound2WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`),
                                        )}
                                      />
                                    </BracketColumn>
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.losersFinal,
                                        scheduleRanges.losersFinal,
                                      )}
                                      status={getRoundStatus(scheduleRanges.losersFinal)}
                                    >
                                      <BracketMatch
                                        label={t.tournamentDetail.playoffsBracket.lfLabel}
                                        home={resolveLosersRound3WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L5`)}
                                        away={resolveWFLoserLabel(t.tournamentDetail.playoffsBracket.loserWF)}
                                        score={resolveScoreFromMap(
                                          losersFinalResultsByPair,
                                          resolveLosersRound3WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L5`),
                                          resolveWFLoserLabel(t.tournamentDetail.playoffsBracket.loserWF),
                                        )}
                                      />
                                    </BracketColumn>
                                  </div>
                                ) : (
                                  <div className="min-w-0 sm:min-w-[1020px] grid grid-cols-1 sm:grid-cols-6 gap-4">
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.losersRound1,
                                        scheduleRanges.losersRound1,
                                      )}
                                      status={getRoundStatus(scheduleRanges.losersRound1)}
                                    >
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
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.losersRound2,
                                        scheduleRanges.losersRound2,
                                      )}
                                      status={getRoundStatus(scheduleRanges.losersRound2)}
                                    >
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
                                        score={resolveScoreFromMap(
                                          losersRound2ResultsByPair,
                                          resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L2`),
                                          resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}2`),
                                        )}
                                      />
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}7`}
                                        home={resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`)}
                                        away={resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}3`)}
                                        score={resolveScoreFromMap(
                                          losersRound2ResultsByPair,
                                          resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L3`),
                                          resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}3`),
                                        )}
                                      />
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}8`}
                                        home={
                                          isStyczen1
                                            ? 'I3anani_PL'
                                            : resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`)
                                        }
                                        away={
                                          isStyczen1
                                            ? 'TYMEK2k11'
                                            : resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}4`)
                                        }
                                        score={
                                          isStyczen1
                                            ? resolveScoreFromMap(
                                              losersRound2ResultsByPair,
                                              'I3anani_PL',
                                              'TYMEK2k11',
                                            )
                                            : resolveScoreFromMap(
                                              losersRound2ResultsByPair,
                                              resolveLosersRound1WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L4`),
                                              resolveWQLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWQPrefix}4`),
                                            )
                                        }
                                      />
                                    </BracketColumn>
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.losersRound3,
                                        scheduleRanges.losersRound3,
                                      )}
                                      status={getRoundStatus(scheduleRanges.losersRound3)}
                                    >
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}9`}
                                        home="Tommy__Rev"
                                        away={isStyczen1 ? 'Rumcajs_PL' : `${t.tournamentDetail.playoffsBracket.winnerPrefix} L6`}
                                        score={isStyczen1 ? '1:8' : undefined}
                                      />
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}10`}
                                        home="andriizrv"
                                        away={resolveLosersRound2WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L8`)}
                                        score="2:6"
                                      />
                                    </BracketColumn>
                                    <BracketColumn title={t.tournamentDetail.playoffsBracket.losersRound4}>
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}11`}
                                        home={resolveLosersRound3WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L9`)}
                                        away={isStyczen1 ? 'wiksoonszef' : `${t.tournamentDetail.playoffsBracket.winnerPrefix} L9`}
                                        score={isStyczen1 ? '4:5' : undefined}
                                      />
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}12`}
                                        home={resolveLosersRound3WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L10`)}
                                        away={resolveWSLoserLabel(`${t.tournamentDetail.playoffsBracket.loserWSPrefix}2`)}
                                        score={isStyczen1 ? '3:0' : undefined}
                                      />
                                    </BracketColumn>
                                    <BracketColumn title={t.tournamentDetail.playoffsBracket.losersRound5}>
                                      <BracketMatch
                                        label={`${t.tournamentDetail.playoffsBracket.lLabelPrefix}13`}
                                        home={resolveLosersRound4WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L11`)}
                                        away={resolveLosersRound4WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L12`)}
                                        score={isStyczen1 ? '5:3' : undefined}
                                      />
                                    </BracketColumn>
                                    <BracketColumn
                                      title={withDeadline(
                                        t.tournamentDetail.playoffsBracket.losersFinal,
                                        scheduleRanges.losersFinal,
                                      )}
                                      status={getRoundStatus(scheduleRanges.losersFinal)}
                                    >
                                      <BracketMatch
                                        label={t.tournamentDetail.playoffsBracket.lfLabel}
                                        home={resolveLosersRound5WinnerLabel(`${t.tournamentDetail.playoffsBracket.winnerPrefix} L13`)}
                                        away={resolveWFLoserLabel(t.tournamentDetail.playoffsBracket.loserWF)}
                                        score={isStyczen1 ? '1:3' : undefined}
                                      />
                                    </BracketColumn>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        ) : null}

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
                                    {(group.displayPlayers ?? group.players).map((player) => {
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
