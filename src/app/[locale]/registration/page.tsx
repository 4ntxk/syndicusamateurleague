'use client'

import { ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Footer from '../../../components/footer'
import Sidebar from '../../../components/sidebar'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { getRegistrationFormUrl, hasRegistrationForm, tournaments } from '../../../data/tournaments'
import { useLocale } from '../../../i18n/use-locale'
import { getTranslations } from '../../../i18n/translations'
import { getGuardianConsentUrl, isSeasonOneTournament } from '../../../lib/guardian-consent'
import { getRegulationsUrl } from '../../../lib/regulations'

export default function RegistrationPage() {
  const [activeNav, setActiveNav] = useState('registration')
  const router = useRouter()
  const locale = useLocale()
  const t = getTranslations(locale)
  const regulationsUrl = getRegulationsUrl(locale)
  const guardianConsentUrl = getGuardianConsentUrl(locale)
  const upcomingRegistrationIds = new Set([6, 7])
  const visibleTournaments = tournaments.filter(
    (tournament) => upcomingRegistrationIds.has(tournament.id)
  )

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex-1 flex flex-col">
        <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-r from-[#2815d3] to-[#a83acd]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {t.registration.title}
            </h1>
            <p className="text-lg text-white/90">
              {t.registration.subtitle}
            </p>
          </div>
        </section>

        <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {t.registration.heading}
              </h2>
              <p className="text-foreground/70">
                {t.registration.description}
              </p>
              <div className="mt-5">
                <a href={regulationsUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-[#a83acd]/70 bg-white/5 text-[#d6adff] hover:bg-[#a83acd]/10 hover:text-white">
                    {t.registration.regulationsCta}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleTournaments.map((tournament) => (
                <Card
                  key={tournament.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/${locale}/tournaments/${tournament.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      router.push(`/${locale}/tournaments/${tournament.id}`)
                    }
                  }}
                  className="bg-[#1a0f2e] border-[#2815d3]/40 hover:border-[#a83acd]/80 hover:shadow-lg hover:shadow-[#a83acd]/20 transition-all flex flex-col h-full cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl bg-gradient-to-r from-[#a83acd] to-[#2815d3] bg-clip-text text-transparent">
                      {tournament.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <div className="mb-6 flex-1">
                      <div className="mb-4">
                        <p className="text-sm text-foreground/60 mb-1">{t.registration.registrationLabel}</p>
                        <p className="text-foreground font-semibold">
                          {locale === 'en'
                            ? (tournament.registrationLabelEn ?? tournament.registrationLabel ?? tournament.registrationDate)
                            : (tournament.registrationLabel ?? tournament.registrationDate)}
                        </p>
                        {((locale === 'en' ? tournament.registrationNoticeEn : tournament.registrationNotice)
                          ?? tournament.registrationNotice) ? (
                          <p className="mt-2 text-sm font-medium text-amber-200">
                            {(locale === 'en' ? tournament.registrationNoticeEn : tournament.registrationNotice)
                              ?? tournament.registrationNotice}
                          </p>
                        ) : null}
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-foreground/60 mb-1">{t.registration.startLabel}</p>
                        <p className="font-semibold text-[#a83acd]">{tournament.startDate}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {tournament.isRegistrationOpen && hasRegistrationForm(tournament, locale) ? (
                          <a
                            href={getRegistrationFormUrl(tournament, locale)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Button variant="outline" className="w-full border-[#a83acd] text-[#a83acd] hover:bg-[#a83acd]/10 hover:text-whtie cursor-pointer">
                            {t.registration.button}
                            <ExternalLink className="ml-2 w-4 h-4" />
                          </Button>
                        </a>
                      ) : tournament.isRegistrationOpen ? (
                        <Button
                          variant="outline"
                          disabled
                          className="w-full border-[#a83acd]/40 text-[#d6adff] cursor-not-allowed"
                        >
                          {t.tournaments.statusOpen}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          disabled
                          className="w-full border-white/20 text-white/40 cursor-not-allowed"
                        >
                          {t.registration.buttonUnavailable}
                        </Button>
                      )}
                      {isSeasonOneTournament(tournament) ? (
                        <a
                          href={guardianConsentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Button variant="outline" className="w-full border-white/15 bg-white/[0.03] text-white/80 hover:bg-white/10 hover:text-white cursor-pointer">
                            {t.registration.guardianConsentCta}
                            <ExternalLink className="ml-2 w-4 h-4" />
                          </Button>
                        </a>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
