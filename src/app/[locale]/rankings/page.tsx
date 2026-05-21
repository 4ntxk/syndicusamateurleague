'use client'

import { CalendarDays, Crown, Medal, Trophy } from 'lucide-react'
import { useState } from 'react'
import Footer from '../../../components/footer'
import Sidebar from '../../../components/sidebar'
import { seasonOne } from '../../../data/season-rankings'
import { useLocale } from '../../../i18n/use-locale'
import { getTranslations } from '../../../i18n/translations'

export default function RankingsPage() {
  const [activeNav, setActiveNav] = useState('rankings')
  const locale = useLocale()
  const t = getTranslations(locale)

  const getEventStatusClass = (status: (typeof seasonOne.events)[number]['status']) => {
    if (status === 'live') {
      return 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
    }

    if (status === 'completed') {
      return 'border-[#a83acd]/30 bg-[#2815d3]/20 text-[#d6adff]'
    }

    return 'border-white/10 bg-white/10 text-white/70'
  }

  const getEventStatusLabel = (status: (typeof seasonOne.events)[number]['status']) => {
    if (status === 'live') {
      return t.rankings.statusLive
    }

    if (status === 'completed') {
      return t.rankings.statusCompleted
    }

    return t.rankings.statusUpcoming
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#12081f] via-[#2815d3] to-[#a83acd] px-4 py-18 md:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-[-8rem] h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-[-4rem] left-[-4rem] h-56 w-56 rounded-full bg-[#d6adff]/20 blur-3xl" />
            <div className="absolute inset-y-0 left-1/3 w-px bg-white/10" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
                <Trophy className="h-4 w-4" />
                {seasonOne.seasonName}
              </div>
              <h1 className="mb-4 text-4xl font-black text-white md:text-6xl">
                {t.rankings.title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-white/88 md:text-xl">
                {t.rankings.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex-1 overflow-hidden bg-gradient-to-b from-[#0f0a1a] via-[#140b24] to-[#1a0f2e] px-4 py-20 md:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-[12%] h-52 w-52 rounded-full bg-[#2815d3]/10 blur-3xl" />
            <div className="absolute right-[8%] bottom-24 h-64 w-64 rounded-full bg-[#a83acd]/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl space-y-10">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-[#2815d3]/25 text-[#d6adff]">
                  <Crown className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">
                  {t.rankings.summarySeason}
                </p>
                <p className="mt-3 text-3xl font-black text-foreground">{seasonOne.seasonName}</p>
                <p className="mt-2 text-sm leading-6 text-foreground/70">{t.rankings.summarySeasonText}</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-[#a83acd]/20 text-[#f1d4ff]">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">
                  {t.rankings.summaryEvents}
                </p>
                <p className="mt-3 text-3xl font-black text-foreground">{seasonOne.totalEvents}</p>
                <p className="mt-2 text-sm leading-6 text-foreground/70">{t.rankings.summaryEventsText}</p>
              </div>

              <div className="rounded-lg border border-emerald-400/20 bg-gradient-to-br from-emerald-500/18 to-emerald-500/6 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-100">
                  <Medal className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100/80">
                  {t.rankings.summaryFinals}
                </p>
                <p className="mt-3 text-3xl font-black text-emerald-50">{seasonOne.finalsCutoff}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/80">{t.rankings.summaryFinalsText}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm md:p-8">
              <div className="max-w-3xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#d6adff]">
                  Format
                </p>
                <h2 className="text-2xl font-black text-foreground">{t.rankings.howItWorksTitle}</h2>
                <p className="mt-3 text-[15px] leading-7 text-foreground/75">{t.rankings.howItWorksText}</p>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm md:p-8">
                <div className="mb-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#d6adff]">
                    Season Map
                  </p>
                  <h2 className="text-2xl font-black text-foreground">{t.rankings.eventsTitle}</h2>
                  <p className="mt-2 text-foreground/70">{t.rankings.eventsSubtitle}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {seasonOne.events.map((event, index) => (
                    <div
                      key={event.id}
                      className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#140b24] p-5 transition-colors hover:border-[#a83acd]/35"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,58,205,0.14),transparent_45%)] opacity-80" />
                      <div className="relative">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d6adff]">
                            {t.rankings.eventLabel} {index + 1}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getEventStatusClass(event.status)}`}
                          >
                            {getEventStatusLabel(event.status)}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-foreground">{event.title}</p>
                        <p className="mt-1 text-sm text-foreground/65">{event.month}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm md:p-8">
                <div className="mb-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#d6adff]">
                    Scoring
                  </p>
                  <h2 className="text-2xl font-black text-foreground">{t.rankings.pointsTitle}</h2>
                  <p className="mt-2 text-foreground/70">{t.rankings.pointsSubtitle}</p>
                </div>

                <div className="overflow-hidden rounded-lg border border-white/10 bg-[#140b24]">
                  <table className="min-w-full table-fixed">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60">
                          {t.rankings.pointsPlacement}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60">
                          {t.rankings.pointsPoints}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {seasonOne.pointsTable.map((row, index) => (
                        <tr
                          key={row.place}
                          className={`border-t border-white/10 ${index === 0 ? 'bg-[#1a1030]' : 'bg-[#140b24]'}`}
                        >
                          <td className="px-4 py-3 text-sm font-semibold text-foreground">{row.place}</td>
                          <td className="px-4 py-3 text-right text-sm font-black text-[#d6adff]">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm">
              <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(168,58,205,0.16),rgba(40,21,211,0.06))] px-6 py-6 md:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#d6adff]">
                      Leaderboard
                    </p>
                    <h2 className="text-2xl font-black text-foreground">{t.rankings.ladderTitle}</h2>
                    <p className="mt-2 max-w-2xl text-foreground/70">{t.rankings.ladderSubtitle}</p>
                  </div>
                  <div className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                    {t.rankings.finalsCutoffBadge.replace('{count}', String(seasonOne.finalsCutoff))}
                  </div>
                </div>
              </div>

              {seasonOne.standings.length === 0 ? (
                <div className="bg-[#140b24] px-6 py-14 text-center md:px-8">
                  <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-5 py-10 text-foreground/65">
                    {t.rankings.ladderEmpty}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto bg-[#140b24]">
                  <table className="min-w-full table-fixed">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60 md:px-6">
                          {t.rankings.tableRank}
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60 md:px-6">
                          {t.rankings.tablePlayer}
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60 md:px-6">
                          {t.rankings.tableBestFinish}
                        </th>
                        <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60 md:px-6">
                          {t.rankings.tableEvents}
                        </th>
                        <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-foreground/60 md:px-6">
                          {t.rankings.tablePoints}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {seasonOne.standings.map((entry, index) => {
                        const inFinalsZone = index < seasonOne.finalsCutoff

                        return (
                          <tr
                            key={entry.player}
                            className={`border-t border-white/10 transition-colors ${
                              inFinalsZone
                                ? 'bg-emerald-500/[0.045]'
                                : 'bg-[#140b24]'
                            }`}
                          >
                            <td className="px-4 py-4 md:px-6">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-foreground">{index + 1}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold text-[#d6adff] md:px-6">
                              {entry.player}
                            </td>
                            <td className="px-4 py-4 text-sm text-foreground/75 md:px-6">
                              {entry.bestFinish}
                            </td>
                            <td className="px-4 py-4 text-right text-sm text-foreground/75 md:px-6">
                              {entry.eventsPlayed}
                            </td>
                            <td className="px-4 py-4 text-right md:px-6">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-black ${
                                  inFinalsZone
                                    ? 'bg-emerald-500/15 text-emerald-200'
                                    : 'bg-white/10 text-foreground'
                                }`}
                              >
                                {entry.totalPoints}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
