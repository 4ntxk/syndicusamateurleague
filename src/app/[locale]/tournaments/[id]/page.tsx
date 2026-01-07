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
                                {tournament.registrationDate}
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
                                {tournament.isOngoing ? t.tournamentDetail.statusOngoing : t.tournamentDetail.statusOpen}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground/60 mb-1">{t.tournamentDetail.labels.registration}</p>
                              <p className="text-foreground/80">
                                {t.tournamentDetail.registrationHint}
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
                      <div className="text-foreground/80">
                        {t.tournamentDetail.playersEmpty}
                      </div>
                    ) : null}

                    {activeTab === 'groups' ? (
                      <div className="text-foreground/80">
                        {t.tournamentDetail.groupsEmpty}
                      </div>
                    ) : null}

                    {activeTab === 'playoffs' ? (
                      <div className="text-foreground/80">
                        {t.tournamentDetail.playoffsEmpty}
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
