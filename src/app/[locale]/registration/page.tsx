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

const parseStartDate = (value: string) => {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(value)

  if (!match) {
    return null
  }

  const [, day, month, year, hours = '0', minutes = '0'] = match

  return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes)).getTime()
}

export default function RegistrationPage() {
  const [activeNav, setActiveNav] = useState('registration')
  const router = useRouter()
  const locale = useLocale()
  const t = getTranslations(locale)
  const regulationsUrl = getRegulationsUrl(locale)
  const guardianConsentUrl = getGuardianConsentUrl(locale)
  const visibleTournaments = tournaments.filter((tournament) => tournament.id !== 1)
  const currentTournaments = visibleTournaments
    .filter((tournament) => tournament.isRegistrationOpen)
    .sort((first, second) => {
      return (
        (parseStartDate(first.startDate) ?? Number.MAX_SAFE_INTEGER) -
        (parseStartDate(second.startDate) ?? Number.MAX_SAFE_INTEGER)
      )
    })
  const unavailableTournaments = visibleTournaments
    .filter((tournament) => !tournament.isRegistrationOpen)
    .sort((first, second) => (parseStartDate(second.startDate) ?? 0) - (parseStartDate(first.startDate) ?? 0))

  const renderTournamentCard = (tournament: (typeof tournaments)[number]) => (
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
      className="flex h-full cursor-pointer flex-col border-[#2815d3]/40 bg-[#1a0f2e] transition-all hover:border-[#a83acd]/80 hover:shadow-lg hover:shadow-[#a83acd]/20"
    >
      <CardHeader className="pb-3">
        <CardTitle className="bg-gradient-to-r from-[#a83acd] to-[#2815d3] bg-clip-text text-xl text-transparent">
          {tournament.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="mb-6 flex-1">
          <div className="mb-4">
            <p className="text-foreground/60 mb-1 text-sm">{t.registration.registrationLabel}</p>
            <p className="text-foreground font-semibold">
              {locale === 'en'
                ? (tournament.registrationLabelEn ?? tournament.registrationLabel ?? tournament.registrationDate)
                : (tournament.registrationLabel ?? tournament.registrationDate)}
            </p>
            {((locale === 'en' ? tournament.registrationNoticeEn : tournament.registrationNotice) ??
            tournament.registrationNotice) ? (
              <p className="mt-2 text-sm font-medium text-amber-200">
                {(locale === 'en' ? tournament.registrationNoticeEn : tournament.registrationNotice) ??
                  tournament.registrationNotice}
              </p>
            ) : null}
          </div>
          <div className="mb-4">
            <p className="text-foreground/60 mb-1 text-sm">{t.registration.startLabel}</p>
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
              <Button
                variant="outline"
                className="w-full cursor-pointer border-[#a83acd] text-[#a83acd] hover:bg-[#a83acd]/10 hover:text-white"
              >
                {t.registration.button}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          ) : tournament.isRegistrationOpen ? (
            <Button variant="outline" disabled className="w-full cursor-not-allowed border-[#a83acd]/40 text-[#d6adff]">
              {t.tournaments.statusOpen}
            </Button>
          ) : (
            <Button variant="outline" disabled className="w-full cursor-not-allowed border-white/20 text-white/40">
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
              <Button
                variant="outline"
                className="w-full cursor-pointer border-white/15 bg-white/[0.03] text-white/80 hover:bg-white/10 hover:text-white"
              >
                {t.registration.guardianConsentCta}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex flex-1 flex-col">
        <section className="w-full bg-gradient-to-r from-[#2815d3] to-[#a83acd] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">{t.registration.title}</h1>
            <p className="text-lg text-white/90">{t.registration.subtitle}</p>
          </div>
        </section>

        <section className="w-full flex-1 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] px-4 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-foreground mb-2 text-3xl font-bold">{t.registration.heading}</h2>
              <p className="text-foreground/70">{t.registration.description}</p>
              <div className="mt-5">
                <a href={regulationsUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="border-[#a83acd]/70 bg-white/5 text-[#d6adff] hover:bg-[#a83acd]/10 hover:text-white"
                  >
                    {t.registration.regulationsCta}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="mb-14">
              <div className="mb-6">
                <h3 className="text-foreground text-2xl font-bold">{t.registration.currentTitle}</h3>
                <p className="text-foreground/65 mt-2">{t.registration.currentDescription}</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentTournaments.map(renderTournamentCard)}
              </div>
            </div>

            <div>
              <div className="mb-6 border-t border-white/10 pt-10">
                <h3 className="text-foreground text-2xl font-bold">{t.registration.unavailableTitle}</h3>
                <p className="text-foreground/65 mt-2">{t.registration.unavailableDescription}</p>
              </div>
              <div className="grid grid-cols-1 gap-6 opacity-75 md:grid-cols-2 lg:grid-cols-3">
                {unavailableTournaments.map(renderTournamentCard)}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
