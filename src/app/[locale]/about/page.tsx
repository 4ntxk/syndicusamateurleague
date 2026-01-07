'use client'

import Link from 'next/link'
import { useLocale } from '../../../i18n/use-locale'
import { getTranslations } from '../../../i18n/translations'

export default function AboutPage() {
  const locale = useLocale()
  const t = getTranslations(locale)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <h1 className="mb-6 text-4xl font-bold">{t.about.title}</h1>
        <p className="mb-8 text-lg text-white/90">
          {t.about.body}
        </p>
        <Link
          href={`/${locale}`}
          className="rounded-full bg-white/10 px-6 py-3 font-semibold hover:bg-white/20"
        >
          {t.about.back}
        </Link>
      </div>
    </main>
  )
}
