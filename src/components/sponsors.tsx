'use client'

import Image from 'next/image'
import { Card, CardContent } from '../components/ui/card'
import { useLocale } from '../i18n/use-locale'
import { getTranslations } from '../i18n/translations'

export default function Sponsors() {
  const locale = useLocale()
  const t = getTranslations(locale)

  const sponsors = [
    { id: 1, name: 'Aikon', logo: '/aikon.webp', href: 'https://aikon.pl' },
    { id: 2, name: 'Lubuszanka', logo: '/lubuszanka.webp', href: 'https://lubuszanka.pl' },
  ]

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] border-t border-primary/40">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            {t.sponsors.title}
          </h2>
          <p className="text-lg text-foreground/70">
            {t.sponsors.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full sm:w-80"
              aria-label={`${t.sponsors.ariaPrefix} ${sponsor.name}`}
            >
              <Card className="bg-[#1a0f2e] border-[#2815d3]/40 hover:border-[#a83acd]/80 hover:bg-[#1a0f2e]/80 transition-all">
                <CardContent className="flex flex-col items-center justify-center p-8 h-48">
                  <div className="relative w-[200px] h-[100px] mb-4">
                    <Image
                      src={sponsor.logo || "/placeholder.svg"}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground text-center">
                    {sponsor.name}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
