'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { tournaments } from '../data/tournaments'
import { useLocale } from '../i18n/use-locale'
import { getTranslations } from '../i18n/translations'

export default function Schedule() {
  const locale = useLocale()
  const t = getTranslations(locale)

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] border-t border-primary/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            {t.schedule.title}
          </h2>
          <p className="text-lg text-foreground/70">
            {t.schedule.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              href={`/${locale}/registration`}
              className="block"
              aria-label={`${t.schedule.cardAriaPrefix}: ${tournament.title}`}
            >
              <Card className="bg-[#1a0f2e] border-[#2815d3]/40 hover:border-[#a83acd]/80 hover:bg-[#1a0f2e]/80 transition-all group h-full">
                <CardHeader className="pb-3">
                  <div className="text-sm font-semibold text-[#a83acd] mb-2">
                    {tournament.startDate}
                  </div>
                  <CardTitle className="text-lg text-foreground">
                    {tournament.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.isRegistrationOpen ? (
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2815d3]/30 text-[#a83acd]">
                      {t.schedule.open}
                    </div>
                  ) : (
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/60">
                      {t.schedule.soon}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
