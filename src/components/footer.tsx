'use client'

import { Facebook } from 'lucide-react'
import { SiTiktok, SiDiscord } from 'react-icons/si'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const isEnglishDivision = pathname?.startsWith('/division')

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/syndicusamateurleague/' },
    { icon: SiTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@syndicus.amateur' },
    { icon: SiDiscord, label: 'Discord', href: 'https://discord.gg/VyGqaCFgbX' },
  ]

  return (
    <footer className="w-full bg-gradient-to-b from-[#1a0f2e] to-[#0f0a1a] text-foreground border-t border-[#2815d3]/40">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#2815d3] to-[#a83acd] bg-clip-text text-transparent mb-2">
              SAL
            </h3>
            <p className="text-foreground/70 text-sm">
              {isEnglishDivision
                ? 'Syndicus Amateur League. E-sports events at your fingertips'
                : 'Syndicus Amateur League. E-sportowe wydarzenia na wyciągnięcie ręki'}
            </p>
          </div>
        </div>

        <div className="border-t border-[#2815d3]/30 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/70">
              {isEnglishDivision
                ? '© 2025 Syndicus Amateur League. All rights reserved.'
                : '© 2025 Syndicus Amateur League. Wszelkie prawa zastrzeżone.'}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-foreground/70 hover:text-[#a83acd] transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
