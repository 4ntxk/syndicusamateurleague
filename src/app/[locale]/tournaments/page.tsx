'use client'

import { useState } from 'react'
import Sidebar from '../../../components/sidebar'
import Footer from '../../../components/footer'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { tournaments } from '../../../data/tournaments'
import { useLocale } from '../../../i18n/use-locale'
import { getTranslations } from '../../../i18n/translations'
import { getRegulationsUrl } from '../../../lib/regulations'
import { Button } from '../../../components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function TournamentsPage() {
  const [activeNav, setActiveNav] = useState('tournaments')
  const locale = useLocale()
  const t = getTranslations(locale)
  const regulationsUrl = getRegulationsUrl(locale)
  const visibleTournaments = tournaments.filter(
    (tournament) =>
      tournament.id !== 1
      && (
        tournament.isRegistrationOpen
        || tournament.isOngoing
        || (tournament.id === 4 && tournament.statusLabelEn === 'Completed')
      )
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex-1 flex flex-col">
        <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-r from-[#2815d3] to-[#a83acd]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {t.tournaments.title}
            </h1>
            <p className="text-lg text-white/90">
              {t.tournaments.subtitle}
            </p>
          </div>
        </section>

        <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {t.tournaments.activeTitle}
              </h2>
              <p className="text-foreground/70">
                {t.tournaments.activeSubtitle}
              </p>
              <div className="mt-5">
                <a href={regulationsUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-[#a83acd]/70 bg-white/5 text-[#d6adff] hover:bg-[#a83acd]/10 hover:text-white">
                    {t.tournaments.regulationsCta}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            {visibleTournaments.length === 0 ? (
              <div className="bg-[#1a0f2e] border border-[#2815d3]/40 rounded-lg p-8 text-center text-foreground/70">
                {t.tournaments.empty}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleTournaments.map((tournament) => (
                  <Link
                    key={tournament.id}
                    href={`/${locale}/tournaments/${tournament.id}`}
                    className="block h-full"
                    aria-label={`${t.tournaments.cardAriaPrefix}: ${tournament.title}`}
                  >
                    <Card className="bg-[#1a0f2e] border-[#2815d3]/40 hover:border-[#a83acd]/80 hover:shadow-lg hover:shadow-[#a83acd]/20 transition-all flex flex-col h-full">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl bg-gradient-to-r from-[#a83acd] to-[#2815d3] bg-clip-text text-transparent">
                          {tournament.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1">
                        <div className="mb-6 flex-1">
                          <div className="mb-4">
                            <p className="text-sm text-foreground/60 mb-1">{t.tournaments.registrationLabel}</p>
                            <p className="text-foreground font-semibold">
                              {locale === 'en'
                                ? (tournament.registrationLabelEn ?? tournament.registrationLabel ?? tournament.registrationDate)
                                : (tournament.registrationLabel ?? tournament.registrationDate)}
                            </p>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-foreground/60 mb-1">{t.tournaments.startLabel}</p>
                            <p className="font-semibold text-[#a83acd]">{tournament.startDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">{t.tournaments.statusLabel}</p>
                            <p className="font-semibold text-foreground">
                              {tournament.isOngoing
                                ? t.tournaments.statusOngoing
                                : tournament.isRegistrationOpen
                                  ? t.tournaments.statusOpen
                                  : ((locale === 'en' ? tournament.statusLabelEn : tournament.statusLabel) ?? t.schedule.soon)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
