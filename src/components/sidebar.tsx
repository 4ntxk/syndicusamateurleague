'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useLocale } from '../i18n/use-locale'
import { getTranslations } from '../i18n/translations'

interface SidebarProps {
  activeNav: string
  setActiveNav: (nav: string) => void
}

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = getTranslations(locale)

  const navItems = [
    { id: 'home', label: t.nav.home, href: `/${locale}` },
    { id: 'registration', label: t.nav.registration, href: `/${locale}/registration` },
    { id: 'tournaments', label: t.nav.tournaments, href: `/${locale}/tournaments` },
    { id: 'rankings', label: t.nav.rankings, href: `/${locale}/rankings` },
    { id: 'gallery', label: t.nav.gallery, href: `/${locale}/gallery` },
  ]

  const buildLocalePath = (targetLocale: string) => {
    if (!pathname) {
      return `/${targetLocale}`
    }

    const segments = pathname.split('/')
    if (segments.length > 1 && (segments[1] === 'pl' || segments[1] === 'en')) {
      segments[1] = targetLocale
      return segments.join('/') || `/${targetLocale}`
    }

    return `/${targetLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground p-2 rounded-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#1a0f2e] to-[#0f0a1a] text-sidebar-foreground border-r border-primary/40 transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 pt-16 md:pt-6 h-full flex flex-col">
          <div className="mb-12 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2815d3] to-[#a83acd] bg-clip-text text-transparent">
              SAL
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push(buildLocalePath('pl'))}
                className={`text-xs font-semibold px-2 py-1 rounded-full border transition-colors cursor-pointer ${
                  locale === 'pl'
                    ? 'bg-[#2815d3] text-white border-transparent'
                    : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                }`}
                aria-label={`${t.languageSwitch.label}: ${t.languageSwitch.pl}`}
              >
                {t.languageSwitch.pl}
              </button>
              <button
                type="button"
                onClick={() => router.push(buildLocalePath('en'))}
                className={`text-xs font-semibold px-2 py-1 rounded-full border transition-colors cursor-pointer ${
                  locale === 'en'
                    ? 'bg-[#2815d3] text-white border-transparent'
                    : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                }`}
                aria-label={`${t.languageSwitch.label}: ${t.languageSwitch.en}`}
              >
                {t.languageSwitch.en}
              </button>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id)
                  if (item.href) {
                    router.push(item.href)
                  }
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  activeNav === item.id
                    ? 'bg-[#7c3aed] text-white font-semibold'
                    : 'text-sidebar-foreground hover:bg-[#7c3aed]/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-primary/30 pt-4">
            <p className="text-xs text-sidebar-foreground/50">c 2025 Syndicus Amateur League, Inc.</p>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
