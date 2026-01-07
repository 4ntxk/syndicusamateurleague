'use client'

import Link from 'next/link'
import { Button } from '../components/ui/button'
import Image from 'next/image'
import { useLocale } from '../i18n/use-locale'
import { getTranslations } from '../i18n/translations'

export default function Hero() {
  const locale = useLocale()
  const t = getTranslations(locale)

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a0f2e] to-[#0f0a1a] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2815d3]/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#a83acd]/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2815d3]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="w-[250px] h-[250px] flex items-center justify-center">
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
            <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-[#2815d3] via-[#a83acd] to-[#a83acd] bg-clip-text text-transparent">
              SAL
            </div>
            <p className="text-lg md:text-xl font-black text-foreground leading-tight">Syndicus Amateur League</p>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
          {t.hero.title}
        </h1>

        <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/registration`}>
            <Button
              size="lg"
              className="cursor-pointer bg-[#2815d3] hover:bg-[#a83acd] hover:shadow-lg hover:shadow-[#a83acd]/50 text-white font-semibold text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {t.hero.cta}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
