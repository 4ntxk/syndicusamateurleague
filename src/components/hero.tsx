'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { tournaments } from '../data/tournaments'
import { useLocale } from '../i18n/use-locale'
import { getTranslations } from '../i18n/translations'
import { getRegulationsUrl } from '../lib/regulations'
import { Button } from './ui/button'

export default function Hero() {
  const locale = useLocale()
  const t = getTranslations(locale)
  const regulationsUrl = getRegulationsUrl(locale)
  const openRegistrationTournaments = tournaments.filter(
    (tournament) => tournament.isRegistrationOpen && tournament.statusLabelEn !== 'Completed',
  )
  const activeTournament = tournaments.find(
    (tournament) => tournament.isOngoing && tournament.statusLabelEn !== 'Completed' && tournament.id !== 1,
  )
    ?? tournaments.find((tournament) => tournament.isOngoing && tournament.statusLabelEn !== 'Completed')
  const promotedTournament = tournaments.find(
    (tournament) =>
      tournament.id !== 1
      && !tournament.isRegistrationOpen
      && !tournament.isOngoing
      && tournament.statusLabelEn !== 'Completed',
  )
  const fallbackFeaturedTournament = activeTournament
    ?? promotedTournament
    ?? tournaments.find((tournament) => tournament.id !== 1 && tournament.statusLabelEn !== 'Completed')
  const featuredTournaments = openRegistrationTournaments.length > 0
    ? openRegistrationTournaments
    : fallbackFeaturedTournament
      ? [fallbackFeaturedTournament]
      : []

  const getFeaturedTournamentBadge = (tournament: (typeof tournaments)[number]) => {
    if (tournament.isRegistrationOpen) {
      return t.hero.registrationOpen
    }

    if (tournament.isOngoing) {
      return t.hero.activeTournamentCta
    }

    return t.schedule.soon
  }

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a0f2e] to-[#0f0a1a]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#2815d3]/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#a83acd]/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2815d3]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-10 text-center md:px-8 md:pb-0">
        <div className="mb-8 flex justify-center">
          <div className="flex h-[250px] w-[250px] items-center justify-center">
            <Image
              src="/logov1.webp"
              alt="Syndicus Amateur League Logo"
              width={250}
              height={250}
              priority
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="inline-block">
            <div className="bg-gradient-to-r from-[#2815d3] via-[#a83acd] to-[#a83acd] bg-clip-text text-6xl font-black text-transparent md:text-7xl">
              SAL
            </div>
            <p className="text-lg font-black leading-tight text-foreground md:text-xl">
              Syndicus Amateur League
            </p>
          </div>
        </div>

        <h1 className="mb-6 text-4xl font-black leading-tight text-foreground md:text-6xl">
          {t.hero.title}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-foreground/70 md:text-xl">
          {t.hero.subtitle}
        </p>

        {featuredTournaments.length > 0 ? (
          <div className="mb-8 rounded-3xl border border-[#a83acd]/30 bg-white/5 px-5 py-4 text-left shadow-lg shadow-[#2815d3]/10 backdrop-blur-sm">
            <div className="grid gap-4 md:grid-cols-2">
              {featuredTournaments.map((featuredTournament) => (
                <Link
                  key={featuredTournament.id}
                  href={`/${locale}/tournaments/${featuredTournament.id}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-[#a83acd]/60 hover:bg-white/[0.06]"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-center gap-2 text-center sm:justify-start">
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      {getFeaturedTournamentBadge(featuredTournament)}
                    </span>
                  </div>
                  <p className="text-center text-lg font-black text-foreground sm:text-left">
                    {featuredTournament.title}
                  </p>
                  <p className="mt-1 text-center text-sm text-foreground/70 sm:text-left">
                    {t.hero.registrationStarts}:{' '}
                    <span className="font-semibold text-[#d6adff]">{featuredTournament.startDate}</span>
                  </p>
                  {((locale === 'en' ? featuredTournament.registrationNoticeEn : featuredTournament.registrationNotice)
                    ?? featuredTournament.registrationNotice) ? (
                    <p className="mt-3 rounded-2xl border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-center text-sm font-medium text-amber-100 sm:text-left">
                      {(locale === 'en' ? featuredTournament.registrationNoticeEn : featuredTournament.registrationNotice)
                        ?? featuredTournament.registrationNotice}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {activeTournament ? (
            <Link href={`/${locale}/tournaments/${activeTournament.id}`}>
              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer rounded-full border-emerald-400/40 bg-emerald-500/10 px-8 py-6 text-lg font-semibold text-emerald-100 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-500/20 hover:text-white"
              >
                {t.hero.activeTournamentCta}
              </Button>
            </Link>
          ) : null}
          <Link href={`/${locale}/registration`}>
            <Button
              size="lg"
              className="cursor-pointer rounded-full bg-[#2815d3] px-8 py-6 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#a83acd] hover:shadow-lg hover:shadow-[#a83acd]/50"
            >
              {t.hero.cta}
            </Button>
          </Link>
          <a href={regulationsUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer rounded-full border-white/12 bg-[#120b1f] px-8 py-6 text-lg font-semibold text-white/78 transition-all duration-300 hover:border-[#d6adff]/25 hover:bg-[#181028] hover:text-white"
            >
              {t.hero.regulationsCta}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <a href="https://discord.gg/xAzn6DzuVP" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer rounded-full border-[#a83acd]/70 bg-[#a83acd]/12 px-8 py-6 text-lg font-semibold text-white transition-all duration-300 hover:border-[#d6adff] hover:bg-[#a83acd]/20 hover:text-white"
            >
              {t.hero.discordCta}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
