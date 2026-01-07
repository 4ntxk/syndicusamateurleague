'use client'

import { useState } from 'react'
import Sidebar from '../../../components/sidebar'
import Footer from '../../../components/footer'
import { Button } from '../../../components/ui/button'
import { ExternalLink } from 'lucide-react'
import { useLocale } from '../../../i18n/use-locale'
import { getTranslations } from '../../../i18n/translations'

export default function GalleryPage() {
  const [activeNav, setActiveNav] = useState('gallery')
  const locale = useLocale()
  const t = getTranslations(locale)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex-1 flex flex-col">
        <section className="w-full py-16 px-4 md:px-8 bg-gradient-to-r from-[#2815d3] to-[#a83acd]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {t.gallery.title}
            </h1>
            <p className="text-lg text-white/90">
              {t.gallery.subtitle}
            </p>
          </div>
        </section>

        <section className="w-full py-32 px-4 md:px-8 bg-gradient-to-b from-[#0f0a1a] to-[#1a0f2e] flex-1 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-[#2815d3] to-[#a83acd] bg-clip-text text-transparent mb-6">
                {t.gallery.wipTitle}
              </div>
              <p className="text-xl text-foreground/80 mb-8">
                {t.gallery.wipText}
              </p>
            </div>

            <a
              href="https://drive.google.com/drive/folders/1RPsjaBlYmf39H4XtujPRFgWk5IMcpjA4?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#2815d3] hover:bg-[#a83acd] text-white px-8 py-6 text-lg">
                {t.gallery.button}
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
