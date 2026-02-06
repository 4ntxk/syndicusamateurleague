'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Sidebar from '../../../../components/sidebar'
import Footer from '../../../../components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { tournaments } from '../../../../data/tournaments'
import { useLocale } from '../../../../i18n/use-locale'
import { getTranslations } from '../../../../i18n/translations'

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
                                  <div className="overflow-hidden rounded-lg border border-white/10">
                                    <table className="w-full text-sm text-foreground/90">
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
                                            <td className="px-3 py-2 text-left">{row.player}</td>
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

                    {activeTab === 'playoffs' ? (
                      playoffGroups.length > 0 ? (
                        <div className="space-y-6">
                          <div className="rounded-lg border border-[#a83acd]/50 bg-gradient-to-r from-[#2815d3]/30 to-[#a83acd]/20 p-4 text-sm text-white shadow-[0_0_30px_rgba(168,58,205,0.25)] font-semibold">
                            {t.tournamentDetail.playoffsEmpty}
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {playoffGroups.map((group) => (
                              <div
                                key={group.name}
                                className="rounded-lg border border-white/10 bg-white/5 p-4"
                              >
                                <h3 className="mb-3 text-base font-semibold text-foreground">
                                  {group.name}
                                </h3>
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
                      ) : (
                        <div className="text-foreground/80">
                          {t.tournamentDetail.playoffsEmpty}
                        </div>
                      )
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
